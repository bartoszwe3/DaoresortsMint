const { ethers } = require("ethers");

async function check() {
    const RPC_URL = "http://127.0.0.1:8545/";
    const ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    console.log("Connecting to RPC:", RPC_URL);
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    try {
        const code = await provider.getCode(ADDR);
        console.log("Contract code at address:", code.slice(0, 20) + "...");
        if (code === "0x" || code === "0x0") {
            console.error("❌ NO CONTRACT FOUND AT THIS ADDRESS!");
        } else {
            console.log("✅ CONTRACT FOUND!");
            const abi = [
                "function getBatchTokenStatus(uint256 startId, uint256 endId) external view returns (bool[])"
            ];
            const contract = new ethers.Contract(ADDR, abi, provider);
            const status = await contract.getBatchTokenStatus(1, 5);
            console.log("Batch Status (1-5):", status);
        }
    } catch (err) {
        console.error("❌ CONNECTION ERROR:", err.message);
    }
}

check();
