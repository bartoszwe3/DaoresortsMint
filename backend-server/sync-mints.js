const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config();

const FILE_USERS = path.join(__dirname, "data", "users.json");
const RPC_URL = process.env.RPC_URL || "https://polygon-bor-rpc.publicnode.com";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

async function sync() {
    console.log("🔍 Starting NFT Sync...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    if (!fs.existsSync(FILE_USERS)) {
        console.error("❌ users.json not found!");
        return;
    }

    const users = JSON.parse(fs.readFileSync(FILE_USERS, "utf8"));
    let updatedCount = 0;

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // Check users who have a hash but are not marked as minted
        if (!user.minted && user.membershipTxHash) {
            console.log(`⏳ Checking User: ${user.memberName || user.wallet} | Hash: ${user.membershipTxHash}`);

            try {
                const receipt = await provider.getTransactionReceipt(user.membershipTxHash);

                if (receipt && receipt.status === 1) {
                    console.log(`✅ Transaction Success! Updating status...`);

                    // Try to extract TokenID from logs if missing
                    let tokenId = user.photoId;
                    try {
                        const transferLog = receipt.logs.find(l =>
                            l.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
                        );
                        if (transferLog) {
                            tokenId = ethers.toNumber(transferLog.topics[3]);
                        }
                    } catch (e) {
                        console.log("⚠️ Could not extract TokenID from logs, using photoId.");
                    }

                    users[i].minted = true;
                    users[i].membershipTokenId = tokenId;
                    if (!users[i].mintDate) users[i].mintDate = new Date().toLocaleString();

                    updatedCount++;
                } else if (receipt && receipt.status === 0) {
                    console.log(`❌ Transaction Reverted. Clearing hash.`);
                    // Optionally clear hash to allow retry
                    // users[i].membershipTxHash = null;
                } else {
                    console.log(`❓ Transaction not found or pending.`);
                }
            } catch (err) {
                console.error(`❌ Error checking hash ${user.membershipTxHash}:`, err.message);
            }
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(FILE_USERS, JSON.stringify(users, null, 2));
        console.log(`✨ Sync completed. Updated ${updatedCount} users.`);
    } else {
        console.log("ℹ️ No updates needed.");
    }
}

sync().catch(console.error);
