const hre = require("hardhat");

async function main() {
    const addr = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
    console.log(`Connecting to contract at ${addr}...`);

    const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");
    const contract = BeaverPassport.attach(addr);

    try {
        console.log("Calling getBatchTokenStatus(1, 20)...");
        const status = await contract.getBatchTokenStatus(1, 20);
        console.log("✅ getBatchTokenStatus Success!");
        console.log("Result sample:", status.slice(0, 5));
    } catch (e) {
        console.error("❌ getBatchTokenStatus Failed:", e.message);
    }

    try {
        console.log("Calling totalSupply()... (Expect fail?)");
        // BeaverPassport doesn't have totalSupply in source, let's see if it's there
        // If it fails locally, it confirms why browser failed
        const total = await contract.totalSupply();
        console.log("✅ totalSupply:", total.toString());
    } catch (e) {
        console.log("⚠️ totalSupply check failed (Expected):", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
