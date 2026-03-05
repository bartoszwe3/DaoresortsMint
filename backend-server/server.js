require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const app = express();

// -------------------------------
// CONFIG
// -------------------------------
const PORT = process.env.PORT || 5003;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

// Path to data files. On Render or Docker, use a persistent volume path.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const FILE_USERS = path.join(DATA_DIR, "users.json");
const FILE_PROPOSALS = path.join(DATA_DIR, "proposals.json");

// Ensure folders and files exist
if (!fs.existsSync(DATA_DIR)) {
  console.log(`📁 Creating data directory at ${DATA_DIR}`);
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(FILE_USERS)) fs.writeFileSync(FILE_USERS, JSON.stringify([]));
if (!fs.existsSync(FILE_PROPOSALS)) fs.writeFileSync(FILE_PROPOSALS, JSON.stringify([]));

// -------------------------------
// HELPERS
// -------------------------------
const loadJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const saveJSON = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// -------------------------------
// MIDDLEWARE
// -------------------------------
// Capture raw body for webhook signature verification BEFORE json parsing
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// -------------------------------
// SMART CONTRACT (INLINE ABI)
// -------------------------------
const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "addToWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_to", "type": "address" },
      { "internalType": "uint256", "name": "_photoId", "type": "uint256" },
      { "internalType": "string", "name": "_name", "type": "string" }
    ],
    "name": "mintPassport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "startId", "type": "uint256" },
      { "internalType": "uint256", "name": "endId", "type": "uint256" }
    ],
    "name": "getBatchTokenStatus",
    "outputs": [{ "internalType": "bool[]", "name": "", "type": "bool[]" }],
    "stateMutability": "view",
    "type": "function"
  }
  ,
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getOwnedBeavers",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// detect ethers version and create provider
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545/";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIV_KEY = process.env.OWNER_PRIVATE_KEY;

console.log("🛠️  Backend Init: RPC =", RPC_URL);
console.log("🛠️  Backend Init: NFT Contract =", CONTRACT_ADDRESS);

if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "undefined") {
  console.error("❌ CRITICAL: CONTRACT_ADDRESS is not defined in .env!");
}

let provider, wallet, contract;

try {
  if (ethers.providers) {
    provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    wallet = PRIV_KEY ? new ethers.Wallet(PRIV_KEY, provider) : null;
    contract = (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "undefined")
      ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet || provider)
      : null;
  } else {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    wallet = PRIV_KEY ? new ethers.Wallet(PRIV_KEY, provider) : null;
    contract = (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "undefined")
      ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet || provider)
      : null;
  }
} catch (e) {
  console.error("❌ Ethers initialization failed:", e.message);
}

// Voting contract — deployer wallet has PROPOSER_ROLE
const VOTING_CONTRACT_ADDRESS = process.env.VOTING_CONTRACT_ADDRESS || "0x9bd03768a7DCc129555dE410FF8E85528A4F88b5";
const VOTING_ABI_MINIMAL = [
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "address[]", "name": "targets", "type": "address[]" },
      { "internalType": "bytes32", "name": "roleToGrant", "type": "bytes32" }
    ],
    "name": "createProposal",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
let votingContract = null;
try {
  if (wallet) {
    votingContract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI_MINIMAL, wallet);
    console.log("🗳️  Voting contract ready:", VOTING_CONTRACT_ADDRESS);
  }
} catch (e) {
  console.error("❌ Voting contract init failed:", e.message);
}

// API ROUTES
// -------------------------------

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// KYC Routes
const kycRoutes = require('./routes/kyc');
app.use('/api/kyc', kycRoutes);

// Payment Routes
const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

// Admin Payment Routes
const adminPaymentRoutes = require('./routes/admin/payments');
app.use('/api/admin/payments', adminPaymentRoutes);

// -------------------------------
// REGISTER USER
// -------------------------------
app.post("/api/register", (req, res) => {
  const { email, wallet } = req.body;

  if (!email || !wallet)
    return res.status(400).json({ error: "Email and wallet required" });

  let users = loadJSON(FILE_USERS);

  if (users.find((u) => u.wallet === wallet))
    return res.json({ message: "Already registered", status: "pending" });

  users.push({
    email,
    wallet,
    registeredAt: Date.now(),
    whitelisted: false,
    minted: false,
  });

  saveJSON(FILE_USERS, users);

  res.json({ message: "Registered successfully", status: "pending" });
});

// -------------------------------
// CHECK WALLET STATUS
// -------------------------------
app.get("/api/status/:wallet", (req, res) => {
  const { wallet } = req.params;
  const users = loadJSON(FILE_USERS);

  const user = users.find((u) => u.wallet.toLowerCase() === wallet.toLowerCase());

  if (!user) return res.json({ registered: false });

  res.json({
    registered: true,
    email: user.email || null,
    whitelisted: user.whitelisted || false,
    minted: user.minted || false,
    membershipTokenId: user.membershipTokenId ?? null,
    photoId: user.photoId ?? null,
    memberName: user.memberName || "",
    kycStatus: user.kycStatus || "not_started",
    kycVerifiedAt: user.kycVerifiedAt || null,
    registeredAt: user.registeredAt || null,
  });
});

// -------------------------------
// UPDATE EMAIL
// -------------------------------
app.post("/api/update-email", (req, res) => {
  const { wallet, email } = req.body;
  if (!wallet || !email) return res.status(400).json({ error: "Wallet and email required" });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email" });
  const users = loadJSON(FILE_USERS);
  const user = users.find((u) => u.wallet.toLowerCase() === wallet.toLowerCase());
  if (!user) return res.status(404).json({ error: "User not found" });
  user.email = email;
  saveJSON(FILE_USERS, users);
  console.log(`📧 Email updated: ${wallet} -> ${email}`);
  res.json({ ok: true });
});

// -------------------------------
// ADMIN WHITELIST USER
// -------------------------------
// ADMIN WHITELIST USER
app.post("/api/admin/whitelist", async (req, res) => {
  try {
    const { wallet: userWallet } = req.body;

    if (!userWallet || !/^0x[a-fA-F0-9]{40}$/.test(userWallet))
      return res.status(400).json({ error: "Invalid wallet address" });

    let users = loadJSON(FILE_USERS);
    const user = users.find((u) => u.wallet === userWallet);

    if (!user) return res.status(404).json({ error: "Wallet not found" });

    // Update JSON first
    user.whitelisted = true;
    saveJSON(FILE_USERS, users);

    // Contract call
    console.log("Sending addToWhitelist tx to:", userWallet);

    const tx = await contract.addToWhitelist(userWallet, {
      gasLimit: 100000, // set reasonable gas limit
    });
    console.log("Transaction sent. Hash:", tx.hash);

    await tx.wait();
    console.log("Transaction confirmed:", tx.hash);

    res.json({ message: "Whitelisted successfully", tx: tx.hash });
  } catch (err) {
    console.error("Whitelist error:", err);
    if (err.reason) console.error("Reason:", err.reason);
    if (err.data) console.error("Data:", err.data);
    res.status(500).json({ error: "Whitelist failed", details: err.message });
  }
});

// -------------------------------
// ADMIN REJECT USER
// -------------------------------
app.post("/api/admin/reject", (req, res) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet required" });

  let users = loadJSON(FILE_USERS);
  const initialLength = users.length;
  users = users.filter((u) => u.wallet !== wallet);

  if (users.length === initialLength) {
    return res.status(404).json({ error: "User not found" });
  }

  saveJSON(FILE_USERS, users);
  res.json({ message: "User rejected and removed" });
});

// -------------------------------
// SAVE MINTED STATUS
// -------------------------------
// -------------------------------
// SAVE MINTED STATUS
// -------------------------------
// server.js - fragment odpowiedzialny za POST /mint
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/mint', async (req, res) => {
  try {
    const { userAddress, address, photoId, nick, name } = req.body;
    const targetAddress = userAddress || address;
    const targetNick = nick || name;

    if (!targetAddress || !photoId) {
      return res.status(400).json({ error: "Missing address or photoId" });
    }

    console.log(`🚀 Start mintowania dla: ${targetNick} (Bober #${photoId})`);

    // --- SPRAWDZENIE DOSTĘPNOŚCI (Backend Guard) ---
    const users = loadJSON(FILE_USERS);
    const alreadyMinted = users.find(u => u.minted && String(u.photoId) === String(photoId));

    if (alreadyMinted) {
      console.log(`⚠️ Bober #${photoId} jest już zajęty przez ${alreadyMinted.wallet}!`);
      return res.status(409).json({ error: "Ten Bober został już adoptowany. Wybierz innego!" });
    }

    // Backend łączy się z kontraktem jako Portfel Admina
    const contractWithSigner = contract.connect(wallet);

    // Wywołanie funkcji na blockchainie - Backend płaci za gas tutaj!
    const tx = await contractWithSigner.mintPassport(targetAddress, photoId, targetNick || "Unknown", {
      gasLimit: 300000
    });

    console.log("⏳ Czekam na potwierdzenie transakcji (Polygon Mainnet)...");
    const receipt = await tx.wait();

    // Pobranie Token ID z logów transakcji
    // W Ethers v6: receipt.logs
    // Szukamy eventu Transfer (index 0 zazwyczaj dla _safeMint)
    let mintedTokenId = photoId; // fallback
    try {
      // W prostej wersji _safeMint, pierwszy log to zazwyczaj Transfer
      // Można też sparsować logi za pomocą interface, ale tu wiemy że to pierwsza emisja
      if (receipt.logs && receipt.logs[0]) {
        mintedTokenId = ethers.toNumber(receipt.logs[0].topics[3]);
      }
    } catch (e) {
      console.log("⚠️ Nie udało się wyłuskać TokenID z logów, używam photoId jako fallback.");
    }

    const mintDate = new Date().toLocaleString();
    console.log("\n===============================================");
    console.log("✅ NFT WYMINTOWANE POMYŚLNIE!");
    console.log(`📅 Data: ${mintDate}`);
    console.log(`🔗 Tx Hash: ${tx.hash}`);
    console.log(`🆔 Token ID (Blockchain): ${mintedTokenId}`);
    console.log(`🖼️  Photo ID (Bober): ${photoId}`);
    console.log(`👤 Odbiorca: ${targetAddress}`);
    console.log("===============================================\n");

    // EMAIL AUTOMATION & UPDATE DB
    try {
      const users = loadJSON(FILE_USERS);
      const userIndex = users.findIndex(u => u.wallet.toLowerCase() === targetAddress.toLowerCase());

      if (userIndex !== -1) {
        // Zapisanie wy-mintowanego ID do bazy JSON!
        // WAŻNE: W walletach używamy Token ID, a w UI Photo ID
        users[userIndex].minted = true;
        users[userIndex].membershipTokenId = mintedTokenId;
        users[userIndex].membershipTxHash = tx.hash;
        users[userIndex].photoId = photoId;
        users[userIndex].memberName = targetNick || "";
        users[userIndex].mintDate = mintDate;
        saveJSON(FILE_USERS, users);

        const user = users[userIndex];
        if (user.email) {
          // Dynamic calculation of remaining seats (Total 150)
          const mintedCount = users.filter(u => u.minted === true).length;
          const remainingSeats = Math.max(0, 150 - mintedCount);

          console.log(`📧 Sending premium email to ${user.email}... (Remaining seats: ${remainingSeats})`);

          const { data, error } = await resend.emails.send({
            from: 'DAOResorts <witaj@daoresorts.club>',
            to: [user.email],
            subject: `Witaj w rodzinie ${targetNick}! Twój Paszport jest gotowy 🦫`,
            html: `
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #0c1208; font-family: 'DM Sans', Arial, sans-serif; color: #F5F0E8;">

<div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #0E1208;">

  <!-- HEADER -->
  <div style="background: linear-gradient(160deg, #0E1208 0%, #1C2614 50%, #0E1208 100%); padding: 48px 20px 0; text-align: center;">
    <div style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #F5F0E8; letter-spacing: 0.02em; margin-bottom: 40px;">DAOResorts<span style="color: #C9A84C;">.</span>club</div>

    <!-- NFT Image -->
    <div style="width: 160px; height: 160px; margin: 0 auto 32px; position: relative;">
        <img src="https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/${photoId}.webp" alt="Beaver #${photoId}" style="width: 100%; height: 100%; border-radius: 50%; border: 2px solid rgba(201,168,76,0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.5); object-fit: cover;" />
    </div>

    <div style="display: inline-block; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); color: #C9A84C; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 16px; border-radius: 4px; margin-bottom: 24px;">Paszport Członkowski</div>

    <h1 style="font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 600; line-height: 1.2; color: #F5F0E8; margin-bottom: 16px; margin-top: 0;">
      Witaj w klubie,<br><em style="font-style: italic; color: #C9A84C;">${targetNick}.</em>
    </h1>

    <p style="font-size: 16px; line-height: 1.6; color: #8A9E8A; max-width: 400px; margin: 0 auto 40px;">
      Twój darmowy Paszport DAOResorts jest gotowy. Jesteś o jeden krok od dożywotniego członkostwa.
    </p>

    <!-- NFT Passport Card -->
    <div style="background: linear-gradient(135deg, #1C2614 0%, #162010 50%, #1C2614 100%); border: 1px solid rgba(201,168,76,0.25); border-radius: 16px; padding: 28px 32px; margin: 0 10px; position: relative; text-align: left;">
      <div style="font-size: 10px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #6B7A60; margin-bottom: 8px;">Paszport Członkowski</div>
      <div style="font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: #F5F0E8; margin-bottom: 4px;">${targetNick}</div>
      <div style="font-size: 13px; font-weight: 500; color: #C9A84C; letter-spacing: 0.08em;">PASZPORT #${photoId}</div>
      <div style="position: absolute; top: 28px; right: 32px; background: rgba(45, 90, 61, 0.4); border: 1px solid rgba(45, 90, 61, 0.8); color: #6DB88A; font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px;">✓ Aktywny</div>
    </div>
  </div>

  <!-- STATS BAR -->
  <div style="display: table; width: 100%; padding: 32px 48px; border-collapse: separate;">
    <div style="display: table-cell; text-align: center; border-right: 1px solid rgba(201,168,76,0.1);">
      <span style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: #C9A84C; display: block; margin-bottom: 4px;">${remainingSeats}</span>
      <span style="font-size: 11px; font-weight: 400; color: #6B7A60; letter-spacing: 0.05em;">miejsc pozostało</span>
    </div>
    <div style="display: table-cell; text-align: center; border-right: 1px solid rgba(201,168,76,0.1);">
      <span style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: #C9A84C; display: block; margin-bottom: 4px;">14</span>
      <span style="font-size: 11px; font-weight: 400; color: #6B7A60; letter-spacing: 0.05em;">nocy rocznie</span>
    </div>
    <div style="display: table-cell; text-align: center;">
      <span style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: #C9A84C; display: block; margin-bottom: 4px;">∞</span>
      <span style="font-size: 11px; font-weight: 400; color: #6B7A60; letter-spacing: 0.05em;">dożywotnio</span>
    </div>
  </div>

  <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent); margin: 8px 48px;"></div>

  <!-- BODY -->
  <div style="padding: 56px 48px 40px;">
    <div style="font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; margin-bottom: 12px;">Co dalej</div>
    <h2 style="font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: #F5F0E8; line-height: 1.3; margin-bottom: 16px; margin-top: 0;">Twój Paszport jest gotowy.<br>Token Członkowski czeka.</h2>
    <p style="font-size: 15px; line-height: 1.7; color: #A8B89A; margin-bottom: 32px;">
      Właśnie dołączyłeś do grupy osób które budują razem coś czego nie było dotąd w Polsce.
      Luksusowy resort wakacyjny <strong style="color: #F5F0E8; font-weight: 500;">posiadany i zarządzany przez społeczność</strong> —
      bez banków, bez marży hotelowej, bez ukrytych prowizji.
    </p>

    <!-- Steps -->
    <div style="margin: 32px 0;">
      <div style="display: table; width: 100%; margin-bottom: 20px; border-bottom: 1px solid rgba(201,168,76,0.08); padding-bottom: 20px;">
        <div style="display: table-cell; width: 32px; padding-right: 16px; vertical-align: top;">
          <div style="width: 32px; height: 32px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 50%; text-align: center; line-height: 32px; font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 600; color: #C9A84C;">1</div>
        </div>
        <div style="display: table-cell; vertical-align: top;">
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 4px;">✓ Paszport odebrany</div>
          <div style="font-size: 13px; line-height: 1.5; color: #6B7A60;">Twój bober ${targetNick} #${photoId} jest już Twój. Darmowy, na zawsze.</div>
        </div>
      </div>
      <div style="display: table; width: 100%; margin-bottom: 20px; border-bottom: 1px solid rgba(201,168,76,0.08); padding-bottom: 20px;">
        <div style="display: table-cell; width: 32px; padding-right: 16px; vertical-align: top;">
          <div style="width: 32px; height: 32px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 50%; text-align: center; line-height: 32px; font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 600; color: #C9A84C;">2</div>
        </div>
        <div style="display: table-cell; vertical-align: top;">
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 4px;">Zweryfikuj tożsamość (KYC)</div>
          <div style="font-size: 13px; line-height: 1.5; color: #6B7A60;">Szybka weryfikacja przez DidIt.me — zajmuje 2 minuty.</div>
        </div>
      </div>
      <div style="display: table; width: 100%;">
        <div style="display: table-cell; width: 32px; padding-right: 16px; vertical-align: top;">
          <div style="width: 32px; height: 32px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 50%; text-align: center; line-height: 32px; font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 600; color: #C9A84C;">3</div>
        </div>
        <div style="display: table-cell; vertical-align: top;">
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 4px;">Kup Token Członkowski</div>
          <div style="font-size: 13px; line-height: 1.5; color: #6B7A60;">19 990 PLN jednorazowo. 14 nocy rocznie po kosztach operacyjnych — dożywotnio. Zostało ${remainingSeats} miejsc założycielskich.</div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align: center; padding: 32px 0;">
      <a href="https://daoresorts.club" style="display: inline-block; background: #C9A84C; color: #0E1208; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 16px 40px; border-radius: 6px; margin-bottom: 16px;">
        Sprawdź dostępność →
      </a>
      <div style="font-size: 12px; color: #6B7A60;">Zostało ${remainingSeats} z 150 miejsc założycielskich</div>
    </div>
  </div>

  <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent); margin: 8px 48px;"></div>

  <!-- PROJECT STATUS (Full High-Fidelity Roadmap) -->
  <div style="padding: 48px 48px; background: #0B1008;">
    <div style="font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; margin-bottom: 12px;">Projekt w trakcie realizacji</div>
    <h3 style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #F5F0E8; margin-bottom: 8px; margin-top: 0;">Budujemy. Publicznie i transparentnie.</h3>
    <p style="font-size: 13px; color: #6B7A60; margin-bottom: 32px; line-height: 1.5;">Każdy etap budowy jest widoczny dla społeczności. Oto gdzie jesteśmy:</p>

    <!-- Roadmap Wrapper -->
    <div style="position: relative;">
      
      <!-- Milestone 1 -->
      <div style="display: table; width: 100%; border-left: 1px solid rgba(201,168,76,0.25); margin-left: 11px; padding-left: 20px; position: relative; padding-bottom: 24px;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(45, 90, 61, 0.4); border: 1px solid #2D5A3D; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #6DB88A; z-index: 1;">✓</div>
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 2px;">Działka zakupiona</div>
          <div style="font-size: 12px; line-height: 1.4; color: #6B7A60;">2530m² w Pszczew, Wielkopolska. Las, cisza, jezioro w pobliżu.</div>
      </div>

      <!-- Milestone 2 -->
      <div style="display: table; width: 100%; border-left: 1px solid rgba(201,168,76,0.25); margin-left: 11px; padding-left: 20px; position: relative; padding-bottom: 24px;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(45, 90, 61, 0.4); border: 1px solid #2D5A3D; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #6DB88A; z-index: 1;">✓</div>
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 2px;">Umowa z architektem podpisana</div>
          <div style="font-size: 12px; line-height: 1.4; color: #6B7A60;">Architekt wybrany, umowa podpisana. Projekt ruszył.</div>
      </div>

      <!-- Milestone 3 -->
      <div style="display: table; width: 100%; border-left: 1px solid rgba(201,168,76,0.25); margin-left: 11px; padding-left: 20px; position: relative; padding-bottom: 24px;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(45, 90, 61, 0.4); border: 1px solid #2D5A3D; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #6DB88A; z-index: 1;">✓</div>
          <div style="font-size: 14px; font-weight: 500; color: #F5F0E8; margin-bottom: 2px;">Aplikacja uruchomiona</div>
          <div style="font-size: 12px; line-height: 1.4; color: #6B7A60;">System paszportów, KYC, głosowania i rezerwacji działa i jest dostępny dla członków.</div>
      </div>

      <!-- Milestone 4 (ACTIVE) -->
      <div style="display: table; width: 100%; border-left: 1px solid rgba(201,168,76,0.25); margin-left: 11px; padding-left: 20px; position: relative; padding-bottom: 24px;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #C9A84C; z-index: 1;">→</div>
          <div style="font-size: 14px; font-weight: 500; color: #C9A84C; margin-bottom: 2px;">Praca z architektem nad projektem — trwa</div>
          <div style="font-size: 12px; line-height: 1.4; color: #8A7A50;">Projekt 6 domków 70m² z jacuzzi, restauracja, sala kinowa. Prace projektowe w toku.</div>
      </div>

      <!-- Milestone 5 (PENDING) -->
      <div style="display: table; width: 100%; border-left: 1px solid rgba(201,168,76,0.25); margin-left: 11px; padding-left: 20px; position: relative; padding-bottom: 24px;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #3A4A35; z-index: 1;">○</div>
          <div style="font-size: 14px; font-weight: 500; color: #4A5A42; margin-bottom: 2px;">Oczekiwanie na pozwolenie na budowę</div>
          <div style="font-size: 12px; line-height: 1.4; color: #3A4A35;">Złożenie dokumentacji i decyzja administracyjna.</div>
      </div>

      <!-- Milestone 6 (PENDING) -->
      <div style="display: table; width: 100%; border-left: 1px solid rgba(201,168,76,0.25); margin-left: 11px; padding-left: 20px; position: relative; padding-bottom: 24px;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #3A4A35; z-index: 1;">○</div>
          <div style="font-size: 14px; font-weight: 500; color: #4A5A42; margin-bottom: 2px;">Sprzedaż członkostwa</div>
          <div style="font-size: 12px; line-height: 1.4; color: #3A4A35;">Zbieramy 150 członków założycielskich. Zostało ${remainingSeats} miejsc.</div>
      </div>

      <!-- Milestone 7 (PENDING) -->
      <div style="display: table; width: 100%; border-left: 1px solid rgba(201,168,76,0.25); margin-left: 11px; padding-left: 20px; position: relative; padding-bottom: 24px;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #3A4A35; z-index: 1;">○</div>
          <div style="font-size: 14px; font-weight: 600; color: #4A5A42; margin-bottom: 2px;">Start budowy</div>
          <div style="font-size: 12px; line-height: 1.4; color: #3A4A35;">Po zebraniu społeczności. Fundamenty, stan surowy, wykończenie premium.</div>
      </div>

      <!-- Milestone 8 (FINAL) -->
      <div style="display: table; width: 100%; margin-left: 11px; padding-left: 20px; position: relative;">
          <div style="position: absolute; left: -11px; top: 0; width: 22px; height: 22px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #3A4A35; z-index: 1;">○</div>
          <div style="font-size: 14px; font-weight: 500; color: #4A5A42; margin-bottom: 2px;">Otwarcie resortu — 2026</div>
          <div style="font-size: 12px; line-height: 1.4; color: #3A4A35;">Pierwsze rezerwacje dla członków założycielskich.</div>
      </div>

    </div>
  </div>

  <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent); margin: 8px 48px;"></div>

  <!-- FOOTER -->
  <div style="background: #080D05; padding: 48px 48px; border-top: 1px solid rgba(201,168,76,0.08);">
    <div style="font-family: 'Playfair Display', serif; font-size: 16px; color: #F5F0E8; margin-bottom: 12px;">DAOResorts<span style="color: #C9A84C;">.</span>club</div>
    <p style="font-size: 12px; line-height: 1.6; color: #4A5A42;">Pierwszy Web3 Vacation Club w Polsce. Pszczew, Wielkopolska.</p>
    <div style="margin-top: 16px;">
      <a href="https://daoresorts.club" style="font-size: 12px; color: #6B7A60; text-decoration: none; margin-right: 16px;">WWW</a>
      <a href="#" style="font-size: 12px; color: #6B7A60; text-decoration: none;">FAQ</a>
    </div>
    <div style="font-size: 11px; line-height: 1.5; color: #3A4A35; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 16px; margin-top: 16px;">
      Ten mail został wysłany do ${user.email}. Token NFT stanowi cyfrowy dokument członkostwa w DAOResorts.
    </div>
  </div>

</div>
</body>
</html>
            `
          });

          if (error) {
            console.error('❌ Resend Error:', error);
          } else {
            console.log('✅ Email sent:', data);
          }
        } else {
          console.log("⚠️ No email found for this wallet, skipping email notification.");
        }
      }
    } catch (dbErr) {
      console.error("❌ DB/Email automation failed:", dbErr);
    }

    res.json({
      success: true,
      message: "NFT został wysłany! Backend opłacił gas.",
      txHash: tx.hash
    });

  } catch (error) {
    console.error("❌ Błąd mintowania:", error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------
// NFT METADATA API (V2)
// -------------------------------
// MetaMask queries `https://api.daoresorts.com/api/metadata/1`.
// We must translate Token ID (1) -> Photo ID (e.g. 48) via Polygon.
const NFT_METADATA_ABI = [
  "function tokenToPhoto(uint256 tokenId) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

app.get("/api/metadata/:id", async (req, res) => {
  const tokenId = req.params.id;

  try {
    const nftReader = new ethers.Contract(CONTRACT_ADDRESS, NFT_METADATA_ABI, provider);

    // Check if token exists
    await nftReader.ownerOf(tokenId);

    // Get actual Photo ID mapping
    const photoIdBN = await nftReader.tokenToPhoto(tokenId);
    const photoId = photoIdBN.toString();

    // Standard OpenSea Metadata JSON
    const metadata = {
      name: `Beaver Passport #${photoId}`,
      description: "Quiet Luxury DAO Resorts Passport. Your key to exclusive governance and rewards.",
      image: `https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/${photoId}.webp`,
      attributes: [
        { trait_type: "Species", value: "Beaver" },
        { trait_type: "Edition", value: "Founding Member" }
      ]
    };

    res.json(metadata);
  } catch (error) {
    console.error(`Metadata Error for Token ${tokenId}:`, error.message);
    // If token doesn't exist, return 404
    res.status(404).json({ error: "Token not found" });
  }
});

// -------------------------------
// ADMIN GET ALL USERS
// -------------------------------
app.get("/api/admin/users", (_, res) => {
  res.json(loadJSON(FILE_USERS));
});

// ============================================================
// VOTING — BACKEND-ONLY (off-chain, Phase 1 pre-DAO)
// ============================================================

const NFT_OWNERSHIP_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)"
];

function getNftReader() {
  try {
    return new ethers.Contract(CONTRACT_ADDRESS, NFT_OWNERSHIP_ABI, provider);
  } catch { return null; }
}

// GET proposals list
app.get("/api/vote/proposals", (_, res) => {
  const proposals = loadJSON(FILE_PROPOSALS);
  const now = Date.now();
  const enriched = proposals.map(p => {
    const liveFor = (p.votes || []).filter(v => v.choice === "for").length;
    const liveAgainst = (p.votes || []).filter(v => v.choice === "against").length;
    const liveAbstain = (p.votes || []).filter(v => v.choice === "abstain").length;
    const votesFor = liveFor + (p.historicalVotesFor || 0);
    const votesAgainst = liveAgainst + (p.historicalVotesAgainst || 0);
    const votesAbstain = liveAbstain + (p.historicalVotesAbstain || 0);
    const status = p.status_override || (p.endTime ? (now < p.endTime ? "active" : "ended") : "active");
    return {
      ...p,
      status,
      votesFor,
      votesAgainst,
      votesAbstain,
      totalVotes: votesFor + votesAgainst + votesAbstain,
    };
  });
  res.json(enriched);
});

// GET single proposal
app.get("/api/vote/proposals/:id", (req, res) => {
  const proposals = loadJSON(FILE_PROPOSALS);
  const p = proposals.find(pr => String(pr.id) === String(req.params.id));
  if (!p) return res.status(404).json({ error: "Not found" });
  const now = Date.now();
  res.json({
    ...p,
    status: p.endTime ? (now < p.endTime ? "active" : "ended") : "active",
    votesFor: (p.votes || []).filter(v => v.choice === "for").length,
    votesAgainst: (p.votes || []).filter(v => v.choice === "against").length,
    votesAbstain: (p.votes || []).filter(v => v.choice === "abstain").length,
    totalVotes: (p.votes || []).length,
  });
});

// CREATE proposal (admin only)
app.post("/api/vote/create-proposal", (req, res) => {
  const { title, description, durationMinutes, adminAddress } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  const OWNER = process.env.OWNER_ADDRESS || "";
  if (OWNER && adminAddress && adminAddress.toLowerCase() !== OWNER.toLowerCase()) {
    return res.status(403).json({ error: "Not admin" });
  }

  const proposals = loadJSON(FILE_PROPOSALS);
  const newId = proposals.length > 0 ? Math.max(...proposals.map(p => p.id || 0)) + 1 : 1;
  const durationMs = (Number(durationMinutes) || 60) * 60 * 1000;

  const newProposal = {
    id: newId,
    title,
    description: description || "",
    createdAt: Date.now(),
    endTime: Date.now() + durationMs,
    votes: [],
  };

  proposals.push(newProposal);
  saveJSON(FILE_PROPOSALS, proposals);

  console.log(`🗳️  Proposal #${newId} created: "${title}"`);
  res.json({ ok: true, proposalId: newId, proposal: newProposal });
});

// CAST VOTE — verify NFT ownership, prevent double vote
app.post("/api/vote/cast", async (req, res) => {
  const { walletAddress, proposalId, tokenId, choice } = req.body;

  if (!walletAddress || !proposalId || tokenId == null || !choice) {
    return res.status(400).json({ error: "Missing fields: walletAddress, proposalId, tokenId, choice" });
  }
  if (!["for", "against", "abstain"].includes(choice)) {
    return res.status(400).json({ error: "Invalid choice. Use: for / against / abstain" });
  }

  const proposals = loadJSON(FILE_PROPOSALS);
  const proposal = proposals.find(p => String(p.id) === String(proposalId));
  if (!proposal) return res.status(404).json({ error: "Proposal not found" });

  // Check voting period
  if (proposal.endTime && Date.now() > proposal.endTime) {
    return res.status(400).json({ error: "Voting period has ended" });
  }

  // Check double vote for this tokenId
  if (!proposal.votes) proposal.votes = [];
  const alreadyVoted = proposal.votes.find(v => String(v.tokenId) === String(tokenId));
  if (alreadyVoted) {
    return res.status(409).json({ error: `Token #${tokenId} already voted on this proposal` });
  }

  // Verify NFT ownership on-chain (read-only)
  try {
    const nftReader = getNftReader();
    if (nftReader) {
      const owner = await nftReader.ownerOf(Number(tokenId));
      if (owner.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(403).json({ error: `You are not the owner of token #${tokenId}` });
      }
    }
  } catch (e) {
    console.warn("⚠️  NFT ownership check failed (blockchain may be down):", e.message);
    // Fallback: check users.json
    const users = loadJSON(FILE_USERS);
    const userRecord = users.find(u => u.wallet?.toLowerCase() === walletAddress.toLowerCase());
    if (!userRecord || !userRecord.minted || String(userRecord.membershipTokenId) !== String(tokenId)) {
      return res.status(403).json({ error: "Cannot verify NFT ownership" });
    }
  }

  // Record vote
  proposal.votes.push({
    walletAddress: walletAddress.toLowerCase(),
    tokenId: String(tokenId),
    choice,
    votedAt: Date.now(),
  });

  saveJSON(FILE_PROPOSALS, proposals);
  console.log(`✅ Vote cast: Proposal #${proposalId} | Token #${tokenId} | ${choice}`);
  res.json({ ok: true, message: `Vote (${choice}) recorded for token #${tokenId}` });
});

// GET my votes for a wallet
app.get("/api/vote/my-votes/:wallet", (req, res) => {
  const { wallet } = req.params;
  const proposals = loadJSON(FILE_PROPOSALS);
  const result = {};
  for (const p of proposals) {
    const myVotes = (p.votes || []).filter(v => v.walletAddress === wallet.toLowerCase());
    if (myVotes.length > 0) result[p.id] = myVotes;
  }
  res.json(result);
});

// DELETE proposal (admin only)
app.delete("/api/vote/proposals/:id", (req, res) => {
  const OWNER = process.env.OWNER_ADDRESS || "";
  const adminAddress = req.headers["x-admin-address"] || "";
  if (OWNER && adminAddress.toLowerCase() !== OWNER.toLowerCase()) {
    return res.status(403).json({ error: "Not admin" });
  }
  let proposals = loadJSON(FILE_PROPOSALS);
  proposals = proposals.filter(p => String(p.id) !== String(req.params.id));
  saveJSON(FILE_PROPOSALS, proposals);
  res.json({ ok: true });
});


// -------------------------------
// PUBLIC MEMBERS LIST
// -------------------------------
app.get("/api/members/public", (req, res) => {
  const users = loadJSON(FILE_USERS);
  const members = users
    .filter(u => u.minted && u.membershipTokenId != null)
    .map((u, index) => ({
      memberName: u.memberName || "Member",
      tokenId: u.membershipTokenId,
      photoId: u.photoId,
      registeredAt: u.registeredAt || null,
      memberNumber: index + 1,
    }))
    .sort((a, b) => a.tokenId - b.tokenId);
  res.json(members);
});

// -------------------------------
// SERVE STATIC FRONTEND (MONOLITH)
// -------------------------------
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route to serve React's index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -------------------------------
// START SERVER
// -------------------------------
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);
