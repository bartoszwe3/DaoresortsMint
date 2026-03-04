const hre = require("hardhat");

async function main() {
    console.log("Deploying separate DAOBeaverPassport contract with aggressive Polygon GAS...");

    const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");
    const baseTokenURI = "https://daoresorts-backend.onrender.com/api/metadata/";

    // Get current fee data from Polygon to ensure we beat the mempool
    const feeData = await hre.ethers.provider.getFeeData();
    const maxFeePerGas = feeData.maxFeePerGas ? feeData.maxFeePerGas.mul(2) : hre.ethers.utils.parseUnits("300", "gwei");
    const maxPriorityFeePerGas = hre.ethers.utils.parseUnits("40", "gwei");

    console.log("Estimated MaxFee:", hre.ethers.utils.formatUnits(maxFeePerGas, "gwei"), "gwei");
    console.log("Estimated Priority:", hre.ethers.utils.formatUnits(maxPriorityFeePerGas, "gwei"), "gwei");

    const passport = await BeaverPassport.deploy(baseTokenURI, {
        maxFeePerGas,
        maxPriorityFeePerGas
    });

    await passport.deployed();

    console.log("✅ DAOBeaverPassport V2 deployed to:", passport.address);
}

main().catch((error) => {
    console.error("❌ Fatal Error:", error);
    process.exitCode = 1;
});
