const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Setup multer for proof uploads
const uploadDir = path.join(__dirname, '../../uploads/proofs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

const FILE_USERS = path.join(__dirname, '../../data/users.json');
const FILE_PAYMENTS = path.join(__dirname, '../../data/payments.json');

const loadJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

const sendEmail = async (email, template, data) => {
    console.log(`Sending email to ${email} (Template: ${template})`);
};

// -------------------------------------------------------------
// POST /api/payments/upload-proof
// -------------------------------------------------------------
router.post('/upload-proof', upload.single('proof'), async (req, res) => {
    try {
        const { paymentId, walletAddress } = req.body; // Using walletAddress to verify ownership
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Brak pliku' });
        }

        let payments = loadJSON(FILE_PAYMENTS);
        const paymentIndex = payments.findIndex(p => p.id === paymentId || p.orderId === paymentId);

        if (paymentIndex === -1) {
            return res.status(404).json({ error: 'Płatność nie znaleziona' });
        }

        const payment = payments[paymentIndex];

        if (walletAddress && payment.userId.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Nieautoryzowany dostęp' });
        }

        const fileUrl = `/uploads/proofs/${file.filename}`;

        // Update payment
        payments[paymentIndex].proofOfPayment = {
            fileUrl: fileUrl,
            uploadedAt: new Date().toISOString()
        };
        payments[paymentIndex].status = 'verification';
        saveJSON(FILE_PAYMENTS, payments);

        // Update user
        let users = loadJSON(FILE_USERS);
        const userIndex = users.findIndex(u => u.wallet && u.wallet.toLowerCase() === payment.userId.toLowerCase());

        if (userIndex !== -1) {
            users[userIndex].paymentStatus = 'verification';
            saveJSON(FILE_USERS, users);

            // Notify admin
            await sendEmail(process.env.ADMIN_EMAIL || 'admin@daoresorts.club', 'payment-proof-uploaded', {
                userEmail: users[userIndex].email,
                orderId: payment.orderId,
                proofUrl: fileUrl,
                adminPanelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/users`
            });
        }

        res.json({
            success: true,
            message: 'Potwierdzenie przesłane. Weryfikacja w ciągu 24-48h.'
        });

    } catch (error) {
        console.error('Upload proof error:', error);
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------------------------------
// GET /api/payments/my/:walletAddress
// -------------------------------------------------------------
router.get('/my/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;

        const payments = loadJSON(FILE_PAYMENTS);
        const payment = payments.find(p => p.userId.toLowerCase() === walletAddress.toLowerCase());

        if (!payment) {
            return res.status(404).json({ error: 'Płatność nie znaleziona' });
        }

        res.json(payment);

    } catch (error) {
        console.error('Get my payment error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
