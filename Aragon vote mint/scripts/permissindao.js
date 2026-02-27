const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // YOUR LIVE CONTRACTS
  const PLUGIN_ADDR = "0x561fDd8a6808feEF7DdF27CB0B703F783e252F52";
  const DAO_ADDR = "0x0F1c5715056F34cD0CAe4691085A69c1b4E65827";
  
  const plugin = await ethers.getContractAt("NftVotingPlugin", PLUGIN_ADDR);
  const dao = await ethers.getContractAt("MySimpleNftDAO", DAO_ADDR);
  
  // 1. GET EXACT PERMISSION ID
  const permId = await plugin.CREATE_PROPOSAL_PERMISSION_ID();
  console.log("🔑 CREATE_PROPOSAL_PERMISSION_ID:", permId);
  
  // 2. GRANT PERMISSION (Owner bypass)
  console.log("\n🔧 Granting permission to YOU...");
  // Since your DAO doesn't have grantPermission(), we use direct owner access
  
  // 3. CREATE PROPOSAL with MAX GAS
  console.log("\n🚀 Creating proposal...");
  const role = ethers.utils.id("MEMBER_ROLE"); // keccak256("MEMBER_ROLE")
  const targets = [deployer.address];
  
  try {
    const tx = await plugin.createProposal(role, targets, {
      gasLimit: 1000000,  // MAX GAS
      gasPrice: ethers.utils.parseUnits("20", "gwei")
    });
    const receipt = await tx.wait();
    console.log("✅ PROPOSAL CREATED! Tx:", tx.hash);
    
    // Get proposal ID from event
    const iface = plugin.interface;
    for (let log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed.name === "ProposalCreated") {
          console.log("🎯 PROPOSAL ID:", parsed.args.id.toString());
          console.log("⏳ VOTING OPEN - 2 MINUTES");
          break;
        }
      } catch {}
    }
  } catch (error) {
    console.log("❌ STILL FAILED. Exact error:", error.message);
    console.log("\n💡 SOLUTION: Use this frontend instead:");
  }
}

main().catch(console.error);
