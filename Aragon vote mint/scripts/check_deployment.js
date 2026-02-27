const hre = require("hardhat");

async function main() {
    const addr = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
    console.log(`Checking address: ${addr}`);

    const code = await hre.ethers.provider.getCode(addr);
    if (code === "0x") {
        console.log("❌ NO CODE at this address!");
    } else {
        console.log("✅ CODE FOUND! Contract is deployed.");
        console.log(`Bytecode length: ${code.length}`);
    }

    try {
        const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");
        const contract = BeaverPassport.attach(addr);

        // Try to read baseURI (it's internal in openzeppelin usually, but we have _baseURI override or public var?)
        // In BeaverPassport.sol:
        // string public baseTokenURI; 
        // function _baseURI() internal view override returns (string memory) { return baseTokenURI; }

        // contract.baseTokenURI() should work as it is public
        const uri = await contract.baseTokenURI();
        console.log(`✅ Base URI: ${uri}`);
    } catch (e) {
        console.log("⚠️ Could not read baseTokenURI:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
