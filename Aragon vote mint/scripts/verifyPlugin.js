const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // UPDATE THESE ADDRESSES FROM YOUR DEPLOY OUTPUT
  const DAO_ADDRESS = "0xF0Fce9852FDB1De9FfC5d1B9f10380C425D334b7";
  const NFT_ADDRESS = "0xc1C6eB78A9C77019782F8797734786e546802F0f";
  const PLUGIN_ADDRESS = "0xaE6396A35e5f3417E60EC337750e4cef9625C9d1."; // From PluginDeployed event in your deploy receipt
  const SETUP_ADDRESS = "0x...";  // Your NftVotingPluginSetup address
  
  console.log("🔍 Verifying NFT Voting Plugin...");
  console.log("Network:", hre.network.name);
  console.log("DAO:", DAO_ADDRESS);
  console.log("Plugin:", PLUGIN_ADDRESS);
  
  // 1. Connect contracts
  const dao = await hre.ethers.getContractAt("IDAO", DAO_ADDRESS);
  const plugin = await hre.ethers.getContractAt("NftVotingPlugin", PLUGIN_ADDRESS);
  const nft = await hre.ethers.getContractAt("IERC721Enumerable", NFT_ADDRESS);
  
  // 2. Check basic config
  console.log("\n📊 Plugin Config:");
  const config = await plugin.getConfig();
  console.log("- NFT Token:", await plugin.nftToken());
  console.log("- Voting Duration:", config.duration.toString(), "seconds");
  console.log("- Support Threshold:", config.supportBps.toString(), "/10000");
  console.log("- Quorum Threshold:", config.quorumBps.toString(), "/10000");
  console.log("- Total Proposals:", config.totalProposals.toString());
  console.log("- Total NFTs:", config.totalNFTs.toString());
  
  // 3. Check critical permissions (MUST all be true for plugin to work)
  const permissions = {
    CREATE: await hre.ethers.utils.id("CREATE_PROPOSAL_PERMISSION"),
    EXECUTE_PROPOSAL: await hre.ethers.utils.id("EXECUTE_PROPOSAL_PERMISSION"),
    UPDATE_SETTINGS: await hre.ethers.utils.id("UPDATE_VOTING_SETTINGS_PERMISSION"),
    EXECUTE: await hre.ethers.utils.id("EXECUTE_PERMISSION")
  };
  
  console.log("\n🔑 Permissions Check:");
  for (const [name, permId] of Object.entries(permissions)) {
    const hasPerm = await dao.hasPermission(PLUGIN_ADDRESS, permId, DAO_ADDRESS);
    console.log(`${name.padEnd(20)}: ${hasPerm ? "✅ GRANTED" : "❌ MISSING"}`);
  }
  
  // 4. Check your NFT holdings
  console.log("\n🖼️  Your NFT Holdings:");
  const yourNfts = await nft.balanceOf(deployer.address);
  console.log(`You own ${yourNfts} NFTs`);
  
  if (yourNfts > 0) {
    console.log("Your NFT IDs:");
    for (let i = 0; i < Number(yourNfts); i++) {
      const tokenId = await nft.tokenOfOwnerByIndex(deployer.address, i);
      console.log(`  - Token #${tokenId}`);
    }
  }
  
  // 5. Installation status
  const status = await dao.isPluginInstalled(PLUGIN_ADDRESS);
  console.log("\n🏗️  Installation Status:", status ? "✅ COMPLETE" : "⚠️  PENDING applyInstallation");
  
  console.log("\n✅ VERIFICATION COMPLETE!");
  if (!status) {
    console.log("\n🚨 ACTION REQUIRED: Create DAO proposal for PluginSetupProcessor.applyInstallation()");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
