const hre = require("hardhat");

async function main() {
    const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");
    // Contract address from deployment
    const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const contract = await BeaverPassport.attach(contractAddress);

    console.log("Checking token status on:", contractAddress);

    // Check if contract exists
    const code = await hre.ethers.provider.getCode(contractAddress);
    if (code === "0x") {
        console.error("ERROR: No contract deployed at address " + contractAddress);
        return;
    }
    console.log("Contract code found. Checking tokens...");

    // Check first 20 IDs
    for (let i = 1; i <= 20; i++) {
        try {
            const owner = await contract.ownerOf(i);
            console.log("Token #" + i + " is owned by: " + owner);
        } catch (error) {
            // Token not minted yet
            // console.log("Token #" + i + " is NOT minted: " + error.message);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
