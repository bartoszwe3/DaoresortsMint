const hre = require("hardhat");

async function main() {
    console.log("Replacing stuck transaction in Polygon Mempool...");

    const [deployer] = await hre.ethers.getSigners();
    const nonce = await hre.ethers.provider.getTransactionCount(deployer.address, "latest");
    const pendingNonce = await hre.ethers.provider.getTransactionCount(deployer.address, "pending");

    console.log("Mined Nonce:", nonce, "| Pending Nonce:", pendingNonce);

    if (pendingNonce > nonce) {
        console.log(`Stuck transaction detected at nonce ${nonce}. Overwriting...`);
        const feeData = await hre.ethers.provider.getFeeData();
        const maxFeePerGas = feeData.maxFeePerGas ? feeData.maxFeePerGas.mul(2) : hre.ethers.utils.parseUnits("300", "gwei");
        const maxPriorityFeePerGas = hre.ethers.utils.parseUnits("70", "gwei"); // Extremely high to force replacement

        const tx = await deployer.sendTransaction({
            to: deployer.address,
            value: 0,
            nonce: nonce,
            maxFeePerGas,
            maxPriorityFeePerGas
        });
        console.log("Replacement Cast. Hash:", tx.hash);
        await tx.wait();
        console.log("Mempool Cleared!");
    } else {
        console.log("No stuck transactions found. Mempool is clear.");
    }
}

main().catch((error) => {
    console.error("❌ Fatal Error:", error);
    process.exitCode = 1;
});
