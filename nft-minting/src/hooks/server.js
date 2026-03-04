require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();

// ---------- CONFIG ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nft_whitelist";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "";

// Configure SendGrid (optional)
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("SendGrid configured");
} else {
  console.log("SendGrid not configured (no SENDGRID_API_KEY). Emails will be skipped.");
}

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: false,
  })
);

// ---------- MONGOOSE SETUP ----------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ---------- SCHEMAS ----------
const registrationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "whitelisted", "rejected"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

// ---------- HELPERS ----------
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

async function sendThankYouEmail(email, walletAddress) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    console.log(
      `📭 Skipping email (SendGrid not configured). email=${email}, wallet=${walletAddress}`
    );
    return;
  }

  const msg = {
    to: email,
    from: SENDGRID_FROM_EMAIL,
    subject: "You’re registered for NFT whitelist 🎟",
    html: `
      <h2>Thanks for registering!</h2>
      <p>Your wallet <strong>${walletAddress}</strong> has been submitted for whitelist review.</p>
      <p>Once approved, you’ll be able to mint your NFT and join the DAO.</p>
      <p>We’ll notify you via email when you’re whitelisted.</p>
      <br/>
      <p>– DAO NFT Platform</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`📧 Sent thank-you email to ${email}`);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
}

// ---------- ROUTES ----------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NFT whitelist backend running" });
});

// Register email + wallet
app.post("/api/register-email", async (req, res) => {
  try {
    const { email, address } = req.body;

    if (!email || !address) {
      return res
        .status(400)
        .json({ error: "Email and address are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({ error: "Invalid wallet address." });
    }

    // Check if already registered
    const existing = await Registration.findOne({ email, walletAddress: address });
    if (existing) {
      return res.status(200).json({
        message: "You are already registered. Please wait for whitelist approval.",
        status: existing.status,
      });
    }

    const reg = new Registration({
      email,
      walletAddress: address,
      status: "pending",
    });

    await reg.save();

    // Send thank-you email (if SendGrid configured)
    sendThankYouEmail(email, address).catch((err) =>
      console.error("Error sending thank-you email:", err.message)
    );

    return res.status(201).json({
      message: "Registration successful. You will be notified once whitelisted.",
      status: reg.status,
    });
  } catch (err) {
    console.error("Error in /api/register-email:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---------- ADMIN ROUTES (OPTIONAL) ----------
// Get pending registrations
app.get("/api/admin/registrations", async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const regs = await Registration.find({ status }).sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    console.error("Error in GET /api/admin/registrations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark addresses as whitelisted (this does NOT call the smart contract, just DB)
app.post("/api/admin/mark-whitelisted", async (req, res) => {
  try {
    const { addresses } = req.body;
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: "addresses[] is required" });
    }

    const cleanedAddrs = addresses
      .filter((a) => typeof a === "string")
      .map((a) => a.toLowerCase());

    const result = await Registration.updateMany(
      { walletAddress: { $in: cleanedAddrs } },
      { $set: { status: "whitelisted" } }
    );

    res.json({
      message: "Registrations updated to whitelisted in DB.",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error in /api/admin/mark-whitelisted:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
