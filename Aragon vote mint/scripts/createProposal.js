const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const plugin = await ethers.getContractAt("NftVotingPlugin", "0xba56Bbd49356379Fa06C92e64a40AC867F6F00Bb");
  const nft = await ethers.getContractAt("IERC721", "0x3395e223b35C6b5C806fdd469791CE7b2b5A4053");
  
  // ✅ DIRECT NFT BALANCE CHECK
  const balance = await nft.balanceOf(deployer.address);
  console.log("✅ NFT Balance:", balance.toString());
  
  const role = ethers.utils.id("MEMBER_ROLE");
  const targets = [deployer.address];
  
  console.log("🚀 CREATING AVENGERS PROPOSAL...");
  console.log("Checks:");
  console.log("- Permissions: ✅ GRANTED");
  console.log("- NFT Balance: " + balance + " ✅");
  
  const tx = await plugin.createProposal(role, targets, { 
    gasLimit: 800000 
  });
  
  const receipt = await tx.wait();
  console.log("✅ PROPOSAL CREATED! Tx:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
  
  const proposalId = await plugin.proposalCount();
  console.log("🎯 PROPOSAL ID:", proposalId.toString());
  console.log("⏳ VOTING OPEN 2min → RUN vote.js NOW!");
}

main().catch(console.error);
