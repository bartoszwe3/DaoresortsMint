const { ethers } = require("hardhat");

async function main() {
    // 1. Setup provider and contract
    const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const BeaverPassport = await ethers.getContractFactory("DAOBeaverPassport");
    const nft = BeaverPassport.attach(NFT_ADDRESS);

    const [signer] = await ethers.getSigners();
    console.log("🕵️ Debugging with account:", signer.address);

    // 2. Call getOwnedBeavers to see raw data
    console.log("\n1️⃣ Calling getOwnedBeavers...");
    try {
        const ownedInfo = await nft.getOwnedBeavers(signer.address);
        console.log("Raw Result (Length):", ownedInfo.length);

        if (ownedInfo.length > 0) {
            const first = ownedInfo[0];
            console.log("First Item Structure:");
            console.log(" - tokenId:", first.tokenId.toString(), typeof first.tokenId);
            console.log(" - photoId:", first.photoId.toString(), typeof first.photoId);
            console.log(" - memberName:", first.memberName);
            console.log(" - mintTimestamp:", first.mintTimestamp.toString());
        } else {
            console.log("⚠️ No NFTs owned by this account.");
        }
    } catch (e) {
        console.error("❌ getOwnedBeavers failed:", e.message);
    }

    // 3. Test Event Filtering for Mint Hash
    console.log("\n2️⃣ Testing Event Filter (Mint Hash)...");
    try {
        // Assume tokenId 1 exists for testing
        const tokenId = 1;
        const filter = nft.filters.Transfer(ethers.constants.AddressZero, null, tokenId);
        // Note: Hardhat ethers might be v5 or v6 depending on tooling. 
        // In v5: ethers.constants.AddressZero. In v6: ethers.ZeroAddress.
        // Adjusting script to be robust.
        const zeroAddress = ethers.constants ? ethers.constants.AddressZero : ethers.ZeroAddress;

        console.log("Filter params:", zeroAddress, signer.address, tokenId);

        const events = await nft.queryFilter(nft.filters.Transfer(zeroAddress, null, tokenId));
        console.log("Found Events:", events.length);
        if (events.length > 0) {
            console.log("✅ Mint Hash Found:", events[0].transactionHash);
        } else {
            console.log("⚠️ No mint event found for Token ID 1");
        }
    } catch (e) {
        console.error("❌ Event filtering failed:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
