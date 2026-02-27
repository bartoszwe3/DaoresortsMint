const hre = require("hardhat");

async function main() {
    const addr = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";
    console.log(`Checking contract at ${addr}...`);

    const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");
    const contract = BeaverPassport.attach(addr);

    try {
        const status = await contract.getBatchTokenStatus(1, 5);
        console.log("✅ Contract is responding! getBatchTokenStatus(1, 5):", status);
    } catch (e) {
        console.error("❌ Contract call failed:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
