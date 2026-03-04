const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { checkDuplicateNFT } = require('../../utils/validators');

const FILE_USERS = path.join(__dirname, '../../data/users.json');
const FILE_PAYMENTS = path.join(__dirname, '../../data/payments.json');

const loadJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Temporary mock functions if they don't exist yet in your global scope
const mintMembershipNFT = async (walletAddress) => {
    console.log(`Minting Membership NFT for ${walletAddress} (admin side)`);
    return { success: true, tokenId: "100" + Math.floor(Math.random() * 100), txHash: "0xdef456" };
};

const sendEmail = async (email, template, data) => {
    console.log(`Sending email to ${email} (Template: ${template})`);
};

// -------------------------------------------------------------
// GET /api/admin/payments
// -------------------------------------------------------------
router.get('/', (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        let payments = loadJSON(FILE_PAYMENTS);
        const users = loadJSON(FILE_USERS);

        if (status && status !== 'all') {
            payments = payments.filter(p => p.status === status);
        }

        // Sort descending by generatedAt
        payments.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

        const startIndex = (page - 1) * limit;
        const paginated = payments.slice(startIndex, startIndex + Number(limit));

        // "Populate" user data
        const populated = paginated.map(p => {
            const u = users.find(user => user.wallet && user.wallet.toLowerCase() === p.userId.toLowerCase());
            return {
                ...p,
                userId: u ? { email: u.email, walletAddress: u.wallet, kycStatus: u.kycStatus } : null
            };
        });

        res.json({
            payments: populated,
            total: payments.length,
            page: parseInt(page),
            pages: Math.ceil(payments.length / limit)
        });

    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------------------------------
// POST /api/admin/payments/generate
// -------------------------------------------------------------
router.post('/generate', async (req, res) => {
    try {
        const { userId } = req.body; // In this JSON version, we'll use wallet address as the unique user ID

        let users = loadJSON(FILE_USERS);
        let userIndex = users.findIndex(u => u.wallet && u.wallet.toLowerCase() === userId.toLowerCase());

        if (userIndex === -1) {
            return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }

        let user = users[userIndex];

        if (user.kycStatus !== 'approved' && user.kycStatus !== 'zatwierdzone') {
            return res.status(400).json({ error: 'Użytkownik musi mieć zatwierdzony KYC' });
        }

        if (user.paymentGenerated) {
            return res.status(400).json({ error: 'Płatność już została wygenerowana dla tego użytkownika' });
        }

        const timestamp = Date.now();
        const random = Math.floor(1000 + Math.random() * 9000);
        const orderId = `DAOR-${timestamp}-${random}`;

        const now = new Date();
        const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const newPayment = {
            id: orderId, // internal generic id matching orderId for simplicity
            userId: user.wallet,
            orderId: orderId,
            amount: 20000,
            status: 'awaiting',
            paymentMethod: 'bank_transfer',
            bankDetails: {
                accountNumber: process.env.MBANK_ACCOUNT_NUMBER || '00 1140 2004 0000 3002 0123 4567',
                recipientName: process.env.MBANK_RECIPIENT_NAME || 'DAOResorts Sp. z o.o.',
                transferTitle: orderId,
                amount: '20,000.00 PLN'
            },
            generatedAt: now.toISOString(),
            expiresAt: expires.toISOString()
        };

        // Save Payment
        let payments = loadJSON(FILE_PAYMENTS);
        payments.push(newPayment);
        saveJSON(FILE_PAYMENTS, payments);

        // Update user
        users[userIndex].paymentGenerated = true;
        users[userIndex].paymentOrderId = orderId;
        users[userIndex].paymentGeneratedAt = now.toISOString();
        users[userIndex].paymentStatus = 'awaiting';
        saveJSON(FILE_USERS, users);

        // Send email
        await sendEmail(user.email, 'payment-instructions', {
            name: user.email.split('@')[0],
            orderId: orderId,
            accountNumber: newPayment.bankDetails.accountNumber,
            expiryDate: expires.toLocaleDateString('pl-PL'),
            dashboardUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/moje-konto`
        });

        res.json({
            success: true,
            payment: newPayment,
            message: 'Płatność wygenerowana i email wysłany do użytkownika'
        });

    } catch (error) {
        console.error('Generate payment error:', error);
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------------------------------
// PATCH /api/admin/payments/:paymentId/verify
// -------------------------------------------------------------
router.patch('/:paymentId/verify', async (req, res) => {
    try {
        const { paymentId } = req.params;

        let ObjectPaymentID = paymentId;

        let payments = loadJSON(FILE_PAYMENTS);
        const paymentIndex = payments.findIndex(p => p.id === ObjectPaymentID || p.orderId === ObjectPaymentID);

        if (paymentIndex === -1) {
            return res.status(404).json({ error: 'Płatność nie znaleziona' });
        }

        const payment = payments[paymentIndex];

        if (!payment.proofOfPayment || !payment.proofOfPayment.fileUrl) {
            return res.status(400).json({ error: 'Użytkownik nie przesłał potwierdzenia płatności' });
        }

        let users = loadJSON(FILE_USERS);
        const userIndex = users.findIndex(u => u.wallet && u.wallet.toLowerCase() === payment.userId.toLowerCase());
        const user = users[userIndex];

        // Check for duplicate NFT before minting
        await checkDuplicateNFT(user.email, user.wallet, user.wallet);

        // Update payment
        payments[paymentIndex].status = 'confirmed';
        payments[paymentIndex].verifiedAt = new Date().toISOString();
        payments[paymentIndex].verifiedBy = "admin"; // Mock admin email
        saveJSON(FILE_PAYMENTS, payments);

        // Update user
        users[userIndex].paymentStatus = 'confirmed';
        users[userIndex].paymentConfirmedAt = new Date().toISOString();

        // Mint NFT
        const nftResult = await mintMembershipNFT(user.wallet);

        if (nftResult.success) {
            users[userIndex].membershipTokenId = nftResult.tokenId;
            users[userIndex].membershipTxHash = nftResult.txHash;
            users[userIndex].isMember = true;

            saveJSON(FILE_USERS, users);

            await sendEmail(user.email, 'membership-activated', {
                name: user.email.split('@')[0],
                tokenId: nftResult.tokenId,
                txHash: nftResult.txHash,
                dashboardUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
            });
        }

        res.json({
            success: true,
            nftResult,
            message: 'Płatność potwierdzona i NFT utworzony'
        });

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
