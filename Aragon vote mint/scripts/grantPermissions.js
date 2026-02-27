const { ethers } = require("hardhat");

async function main() {
  const dao = await ethers.getContractAt("MySimpleNftDAO", "0x9868062D545DEc81683BC0C3664Dec94B7F662E9");
  const plugin = await ethers.getContractAt("NftVotingPlugin", "0xba56Bbd49356379Fa06C92e64a40AC867F6F00Bb");
  const [deployer] = await ethers.getSigners();
  
  const createId = await plugin.CREATE_PROPOSAL_PERMISSION_ID();
  const executeId = await plugin.EXECUTE_PROPOSAL_PERMISSION_ID();
  
  // FIXED: 3 args (who, where, permissionId)
  await dao.grantPermission(deployer.address, plugin.address, createId);
  await dao.grantPermission(deployer.address, plugin.address, executeId);
  
  console.log("✅ PERMISSIONS GRANTED!");
  console.log("CREATE_ID:", createId);
  console.log("EXECUTE_ID:", executeId);
  console.log("🚀 Run createProposal.js next!");
}

main().catch(console.error);
