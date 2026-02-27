const express = require('express');
const crypto = require('crypto');
const fs = require('fs');

const router = express.Router();

const FILE_USERS = "./data/users.json";
const loadJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// --- MOCKED INTEGRATION POINTS AS REQUESTED ---
// The prompt stated to "assume these functions exist".
const mintMembershipNFT = async (walletAddress) => {
    console.log(`Minting Membership NFT for ${walletAddress}`);
    return { success: true, tokenId: "100" + Math.floor(Math.random() * 100), txHash: "0xabc123" };
};

const sendEmail = async (email, template, data) => {
    console.log(`Sending email to ${email} with template ${template}`);
};
// ---------------------------------------------

// POST /api/kyc/webhook
router.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-didit-signature']
            || req.headers['x-signature']
            || req.headers['x-hub-signature-256']
            || req.headers['x-hub-signature']
            || '';

        const payload = req.rawBody || JSON.stringify(req.body);
        const secret = process.env.DIDIT_WEBHOOK_SECRET || '';

        // DidIt.me sends plain hex hash (no sha256= prefix)
        const expectedHash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        const isValid = expectedHash === signature || `sha256=${expectedHash}` === signature;

        if (!isValid && secret) {
            console.error("❌ KYC Webhook: Invalid signature");
            console.error("Received:", signature, "Expected:", expectedHash);
            return res.status(401).json({ error: "Invalid signature" });
        }

        const body = req.body;

        // DidIt.me sends wallet in vendor_data (set via ?external_id= in popup URL)
        const walletAddress = body.vendor_data || body.external_user_id || '';
        // Status comes capitalised: "Approved", "Declined" etc.
        const status = (body.status || '').toLowerCase(); // normalise to lowercase
        const sessionId = body.session_id;

        console.log(`🔔 KYC Webhook: wallet=${walletAddress}, status=${status}, session=${sessionId}`);

        if (!walletAddress) {
            console.error("❌ KYC Webhook: No wallet address in vendor_data");
            return res.status(200).send("OK");
        }

        let users = loadJSON(FILE_USERS);
        let user = users.find(u => u.wallet.toLowerCase() === walletAddress.toLowerCase());

        if (!user) {
            console.error(`❌ KYC Webhook: User not found for wallet ${walletAddress}`);
            return res.status(200).send("OK");
        }

        // Map DidIt.me statuses to our internal statuses
        const statusMap = {
            approved: 'approved',
            declined: 'rejected',
            rejected: 'rejected',
            pending: 'pending',
            processing: 'pending',
        };
        user.kycStatus = statusMap[status] || status;
        user.kycVerifiedAt = new Date().toISOString();
        user.kycSessionId = sessionId;

        const idVerification = body.decision?.id_verifications?.[0];
        if (idVerification) {
            user.kycData = {
                firstName: idVerification.first_name,
                lastName: idVerification.last_name,
                dateOfBirth: idVerification.date_of_birth,
                documentType: idVerification.document_type,
                documentNumber: idVerification.document_number,
            };
        }

        saveJSON(FILE_USERS, users);
        console.log(`✅ KYC updated: ${user.wallet} -> ${user.kycStatus}`);

        res.status(200).send("OK");

    } catch (error) {
        console.error("❌ KYC Webhook Exception:", error);
        res.status(200).send("OK");
    }
});

// GET /api/kyc/status/:userId
router.get('/status/:userId', (req, res) => {
    const { userId } = req.params;
    try {
        const users = loadJSON(FILE_USERS);
        const user = users.find(u => u.wallet.toLowerCase() === userId.toLowerCase());

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            status: user.kycStatus || 'not_started',
            verifiedAt: user.kycVerifiedAt || null,
            membershipTokenId: user.membershipTokenId || null,
            kycData: user.kycData || null
        });
    } catch (error) {
        console.error("❌ KYC Status Error:", error);
        res.status(500).json({ error: "Internal error" });
    }
});

module.exports = router;
