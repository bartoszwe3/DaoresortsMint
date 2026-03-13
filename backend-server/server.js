require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const { Mutex } = require("async-mutex");

const txMutex = new Mutex();
const pendingPhotoIds = new Set();

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
  const release = await txMutex.acquire();
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

    const contractWithSigner = contract.connect(wallet);

    // --- OPTYMALIZACJA GASU ---
    let gasOptions = { gasLimit: 200000 };
    try {
      const feeData = await provider.getFeeData();
      if (feeData.maxPriorityFeePerGas) {
        gasOptions.maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * 150n) / 100n;
        gasOptions.maxFeePerGas = (feeData.maxFeePerGas * 200n) / 100n + gasOptions.maxPriorityFeePerGas;
      }
    } catch (e) { }

    const tx = await contractWithSigner.addToWhitelist(userWallet, gasOptions);
    console.log("Transaction sent. Hash:", tx.hash);

    await tx.wait();
    console.log("Transaction confirmed:", tx.hash);

    res.json({ message: "Whitelisted successfully", tx: tx.hash });
  } catch (err) {
    console.error("Whitelist error:", err);
    res.status(500).json({ error: "Whitelist failed", details: err.message });
  } finally {
    release();
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

    // --- SPRAWDZENIE DOSTĘPNOŚCI (Backend + In-Memory Guard) ---
    if (pendingPhotoIds.has(String(photoId))) {
      return res.status(409).json({ error: "Ten Bober jest właśnie w trakcie adoptowania. Spróbuj za chwilę!" });
    }

    const users = loadJSON(FILE_USERS);
    const alreadyMinted = users.find(u => (u.minted || u.membershipTxHash) && String(u.photoId) === String(photoId));

    if (alreadyMinted) {
      console.log(`⚠️ Bober #${photoId} jest już zajęty!`);
      return res.status(409).json({ error: "Ten Bober został już adoptowany. Wybierz innego!" });
    }

    // Mark as pending in-memory
    pendingPhotoIds.add(String(photoId));

    // Release after 5 minutes just in case of a crash, but normally cleared after confirmation/fail
    const pendingTimeout = setTimeout(() => pendingPhotoIds.delete(String(photoId)), 300000);

    // --- ACQUIRE MUTEX ---
    const release = await txMutex.acquire();
    let tx;

    try {
      // Backend łączy się z kontraktem jako Portfel Admina
      const contractWithSigner = contract.connect(wallet);

      // --- OPTYMALIZACJA GASU (Polygon) ---
      let gasOptions = { gasLimit: 500000 }; // Zwiększony limit
      try {
        const feeData = await provider.getFeeData();
        console.log(`📈 Fee Data: Priority=${feeData.maxPriorityFeePerGas}, Max=${feeData.maxFeePerGas}`);

        if (feeData.maxPriorityFeePerGas) {
          // Gwarantujemy wyższy priorytet (1.5x)
          gasOptions.maxPriorityFeePerGas = (feeData.maxPriorityFeePerGas * 150n) / 100n;
          // Max fee musi być na tyle duże, żeby pokryć base fee (2x base fee + priority)
          gasOptions.maxFeePerGas = (feeData.maxFeePerGas * 200n) / 100n + gasOptions.maxPriorityFeePerGas;
        }
      } catch (e) {
        console.log("⚠️ Nie udało się pobrać aktualnych stawek gas, używam domyślnych.");
      }

      console.log(`📡 Wysyłanie transakcji... Gas Limit: ${gasOptions.gasLimit}`);
      tx = await contractWithSigner.mintPassport(targetAddress, photoId, targetNick || "Unknown", gasOptions);
      console.log(`✅ Transakcja wysłana! Hash: ${tx.hash}`);

    } finally {
      // Release mutex immediately after sending tx so others can queue up their txs with correct Nonce
      release();
    }

    // --- NATYCHMIASTOWA ODPOWIEDŹ DLA KLIENTA ---
    res.json({
      success: true,
      message: "NFT wysłany do sieci! Pojawi się w Twojej galerii za chwilę.",
      txHash: tx.hash
    });

    // --- PRZETWARZANIE W TLE ---
    (async () => {
      try {
        console.log(`⏳ [BKG] Czekam na potwierdzenie: ${tx.hash}...`);
        const receipt = await tx.wait();

        if (receipt.status === 0) {
          throw new Error("Transakcja została odrzucona przez sieć (Execution Reverted).");
        }

        let mintedTokenId = photoId;
        try {
          if (receipt.logs && receipt.logs.length > 0) {
            const transferLog = receipt.logs.find(l =>
              l.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            );
            if (transferLog) {
              mintedTokenId = ethers.toNumber(transferLog.topics[3]);
            }
          }
        } catch (e) {
          console.log("⚠️ [BKG] Nie udało się wyłuskać TokenID z logów.");
        }

        const mintDate = new Date().toLocaleString();

        // Aktualizacja bazy danych
        const usersForUpdate = loadJSON(FILE_USERS);
        const userIndex = usersForUpdate.findIndex(u => u.wallet.toLowerCase() === targetAddress.toLowerCase());

        if (userIndex !== -1) {
          usersForUpdate[userIndex].minted = true;
          usersForUpdate[userIndex].membershipTokenId = mintedTokenId;
          usersForUpdate[userIndex].membershipTxHash = tx.hash;
          usersForUpdate[userIndex].photoId = photoId;
          usersForUpdate[userIndex].memberName = targetNick || "";
          usersForUpdate[userIndex].mintDate = mintDate;
          saveJSON(FILE_USERS, usersForUpdate);

          // Wysyłka Email
          const user = usersForUpdate[userIndex];
          if (user.email) {
            const mintedCount = usersForUpdate.filter(u => u.minted === true).length;
            const remainingSeats = Math.max(0, 150 - mintedCount);

            const { data, error } = await resend.emails.send({
              from: 'DAOResorts <witaj@daoresorts.club>',
              to: [user.email],
              subject: `Witaj w rodzinie ${targetNick}! Twój Paszport jest gotowy 🦫`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0c1208; color: #F5F0E8;">
                    <h1 style="color: #C9A84C;">Witaj w klubie, ${targetNick}!</h1>
                    <p>Twój Paszport <strong>#${photoId}</strong> został pomyślnie wymintowany.</p>
                    <p>Transakcja: <a href="https://polygonscan.com/tx/${tx.hash}" style="color: #C9A84C;">${tx.hash}</a></p>
                    <img src="https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/${photoId}.webp" width="300" style="border-radius: 10px;" />
                    <p>Do zobaczenia w resorcie!</p>
                </div>
              `
            });
            if (error) console.error('❌ [BKG] Resend Error:', error);
            else console.log('✅ [BKG] Email sent:', data);
          }
        }
      } catch (backgroundError) {
        console.error("❌ [BKG] Background processing failed:", backgroundError);
      } finally {
        // Zawsze czyścimy flagę oczekiwania, nawet przy błędzie
        pendingPhotoIds.delete(String(photoId));
        clearTimeout(pendingTimeout);
      }
    })();

  } catch (error) {
    console.error("❌ Błąd mintowania (Submit):", error);
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
