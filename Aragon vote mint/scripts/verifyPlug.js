// scripts/verifyPlugin.js
const hre = require("hardhat");

async function main() {
  // ===== CONFIGURE HERE =====
  const pluginAddress = "0xYOUR_PLUGIN_ADDRESS";           // Replace with deployed plugin address
  const daoAddress = "0x955baa1Cd30381FabeF528562592DA2cAfAe6EcE";      // DAO used in constructor
  const nftTokenAddress = "0x955baa1Cd30381FabeF528562592DA2cAfAe6EcE"; // NFT token used in constructor

  console.log("Verifying plugin contract:", pluginAddress);

  try {
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
