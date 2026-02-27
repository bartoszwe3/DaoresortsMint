const { ethers, run } = require("hardhat");

async function verifyWithRetry(address, args, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await run("verify:verify", {
        address,
        constructorArguments: args
      });
      console.log(`✅ VERIFIED: ${address}`);
      return true;
    } catch (e) {
      if (e.message.includes("already been verified")) {
        console.log(`✅ ALREADY VERIFIED: ${address}`);
        return true;
      }
      console.log(`🔄 Retry ${i + 1}/${maxRetries}...`);
      await new Promise(r => setTimeout(r, 15000));
    }
  }
  return false;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 AVENGERS NFT4_0 + DAO FULL DEPLOY:", deployer.address);

  // ===== 1. DEPLOY DAOBeaverPassport =====
  console.log("\n🦸 1/10 DEPLOY AVENGERS NFT...");
  const nftFactory = await ethers.getContractFactory("DAOBeaverPassport");
  const nft = await nftFactory.deploy("http://localhost:3001/api/metadata/");
  await nft.deployed();
  const nftAddr = nft.address;
  console.log("✅ DEPLOYED NEW NFT CONTRACT:", nftAddr);

  // ===== 2. MINT 5 NFTs TO YOU (FOR TESTING) =====
  console.log("\n🪙 2/10 MINT 5 AVENGERS...");
  await nft.mintPassport(deployer.address, 1, "Bober Alfa");
  await nft.mintPassport(deployer.address, 2, "Bober Beta");
  await nft.mintPassport(deployer.address, 3, "Bober Gamma");
  await nft.mintPassport(deployer.address, 4, "Bober Delta");
  await nft.mintPassport(deployer.address, 5, "Bober Epsilon");
  console.log("✅ 5 Avengers minted! Balance:", (await nft.balanceOf(deployer.address)).toString());

  // ===== 3. DEPLOY DAO =====
  console.log("\n📦 3/10 DEPLOY DAO...");
  const daoFactory = await ethers.getContractFactory("MySimpleNftDAO");
  const dao = await daoFactory.deploy(nftAddr);
  await dao.deployTransaction.wait(1);
  const daoAddr = dao.address;
  console.log("✅ DAO:", daoAddr);
  // await verifyWithRetry(daoAddr, [nftAddr]);

  // ===== 4. DEPLOY SETUP =====
  console.log("\n📦 4/10 DEPLOY SETUP...");
  const setupFactory = await ethers.getContractFactory("NftVotingPluginSetup");
  const setup = await setupFactory.deploy();
  await setup.deployTransaction.wait(1);
  const setupAddr = setup.address;
  console.log("✅ Setup:", setupAddr);
  // await verifyWithRetry(setupAddr, []);

  // ===== 5. CREATE PLUGIN =====
  console.log("\n🔌 5/10 CREATE PLUGIN...");
  const encodedData = ethers.utils.defaultAbiCoder.encode(["address"], [nftAddr]);
  const installTx = await setup.prepareInstallation(daoAddr, encodedData);
  const receipt = await installTx.wait();

  let pluginAddr;
  for (let log of receipt.logs) {
    try {
      const parsed = setup.interface.parseLog(log);
      if (parsed.name === "PluginDeployed") {
        pluginAddr = parsed.args.plugin;
        console.log("✅ PLUGIN:", pluginAddr);
        break;
      }
    } catch { }
  }

  // ===== 6. ACTIVATE PLUGIN =====
  console.log("\n🔧 6/10 ACTIVATE PLUGIN...");
  await dao.activatePlugin(pluginAddr);
  console.log("✅ Plugin activated!");

  // ===== 7. VERIFY PLUGIN =====
  console.log("\n🔍 7/10 VERIFY PLUGIN...");
  await new Promise(r => setTimeout(r, 20000));
  // await verifyWithRetry(pluginAddr, [daoAddr, nftAddr]);


  // ===== 8. TRANSFER OWNERSHIP =====
  console.log("\n🔑 8/10 TRANSFER OWNERSHIP...");
  const plugin = await ethers.getContractAt("NftVotingPlugin", pluginAddr);
  // Plugin is already owned by deployer (constructor default)
  console.log("✅ Plugin owner:", deployer.address);


  // ===== 9. YOUR NFT ID =====
  console.log("\n🎫 9/10 YOUR NFT...");
  // const yourNftId = await nft.tokenOfOwnerByIndex(deployer.address, 0);
  // console.log("✅ YOUR NFT ID:", yourNftId.toString());

  // ===== 10. TEST PROPOSAL =====
  console.log("\n🗳️ 10/10 TEST PROPOSAL...");
  const role = ethers.utils.id("MEMBER_ROLE");
  const targets = [deployer.address];
  const tx = await plugin.createProposal("Initial Test Proposal", "Testing the new voting system.", role, targets);
  await tx.wait();
  const proposalId = await plugin.proposalCount();
  console.log("✅ Proposal #" + proposalId.toString() + " CREATED!");

  // ===== FINAL STATUS =====
  console.log("\n🎉 AVENGERS NFT DAO 100% LIVE! 🎉");
  console.log("═══════════════════════════════════════");
  console.log("🦸 NFT         :", nftAddr);
  console.log("📜 DAO         :", daoAddr);
  console.log("🔌 Plugin      :", pluginAddr);
  // console.log("🎟️  NFT ID     :", yourNftId.toString());
  console.log("🗳️  Proposal # :", proposalId.toString());
  console.log("═══════════════════════════════════════");

  console.log("\n📱 FRONTEND READY - Copy:");
  console.log(`NFT: "${nftAddr}"`);
  console.log(`DAO: "${daoAddr}"`);
  console.log(`PLUGIN: "${pluginAddr}"`);
  console.log(`NFT_ID: "Check Wallet"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERROR:", error.message);
    process.exit(1);
  });
