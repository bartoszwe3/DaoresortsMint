const { ethers } = require("hardhat");
async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com");
  const blockNumber = await provider.getBlockNumber();
  console.log("Current Block Number:", blockNumber);
}
main().catch(console.error);
