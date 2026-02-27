// scripts/deployAndVerify.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // ==== CONFIGURATION ====
  const daoAddress = "0xF0Fce9852FDB1De9FfC5d1B9f10380C425D334b7";       // Your DAO address
  const nftTokenAddress = "0xc1C6eB78A9C77019782F8797734786e546802F0f";  // Your NFT contract address
  console.log("Network:", hre.network.name);

  // 1️⃣ Deploy NftVotingPluginSetup
  const SetupFactory = await hre.ethers.getContractFactory("NftVotingPluginSetup");
  const setupContract = await SetupFactory.deploy();
  await setupContract.deployed();
  console.log("NftVotingPluginSetup deployed at:", setupContract.address);

  // Wait for 5 confirmations to make sure Etherscan can see the bytecode
  console.log("Waiting for 5 confirmations for setup contract...");
  await setupContract.deployTransaction.wait(5);

  // 2️⃣ Encode NFT token address for installation
  const encodedData = hre.ethers.utils.defaultAbiCoder.encode(
    ["address"],
    [nftTokenAddress]
  );

  // 3️⃣ Install plugin via prepareInstallation
  console.log("Installing plugin in DAO...");
  const tx = await setupContract.prepareInstallation(daoAddress, encodedData);
  const receipt = await tx.wait(5); // Wait 5 confirmations for plugin deployment
  console.log("Plugin installation transaction mined. Tx hash:", tx.hash);

  // 4️⃣ Get plugin address from emitted event
  const event = receipt.events.find(e => e.event === "PluginDeployed");
  const pluginAddress = event ? event.args.plugin : null;
  console.log("Plugin deployed at:", pluginAddress);

  // 5️⃣ Verify Setup contract on Etherscan
  try {
    console.log("Verifying setup contract on Etherscan...");
    await hre.run("verify:verify", {
      address: setupContract.address,
      constructorArguments: [],
    });
    console.log("Setup contract verified successfully!");
  } catch (err) {
    console.error("Setup verification failed:", err.message);
  }

  // 6️⃣ Verify Plugin contract on Etherscan automatically
  try {
    console.log("Verifying plugin contract on Etherscan...");
    await hre.run("verify:verify", {
      address: pluginAddress,
      constructorArguments: [daoAddress, nftTokenAddress],
    });
    console.log("Plugin contract verified successfully!");
  } catch (err) {
    console.error("Plugin verification failed:", err.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
