// scripts/grantPermissions.js
const hre = require("hardhat");

async function main() {
  // UPDATE: ROOT_HOLDER_ADDRESS from Step 1
  const ROOT_HOLDER_PRIVATE_KEY = "88d65ff7c71988b4ec79ab6b881d601b5075a60cbcc3b3a6da3018b3d4ae606b"; 
  const daoAddress = "0x955baa1Cd30381FabeF528562592DA2cAfAe6EcE";
  const pluginAddress = "0xA4F4440F8696eB2fa6063C496AA45392D68D63B6";
  
  // Connect as ROOT holder
  const rootWallet = new hre.ethers.Wallet(ROOT_HOLDER_PRIVATE_KEY, hre.ethers.provider);
  console.log("Granting as:", rootWallet.address);

  const daoAbi = ["function grant(address where, address who, bytes32 permissionId)"];
  const iface = new hre.ethers.utils.Interface(daoAbi);
  const execId = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("EXECUTE_PERMISSION"));

  // 1. Plugin EXECUTE on DAO
  const data1 = iface.encodeFunctionData("grant", [daoAddress, pluginAddress, execId]);
  const tx1 = await rootWallet.sendTransaction({to: daoAddress, data: data1, gasLimit: 300000});
  await tx1.wait();
  console.log("✅ 1/2:", tx1.hash);

  // 2. You EXECUTE on Plugin
  const data2 = iface.encodeFunctionData("grant", [pluginAddress, "0x50302d410B1cc1Ce09c4ab797B1178fd29Fd485b", execId]);
  const tx2 = await rootWallet.sendTransaction({to: daoAddress, data: data2, gasLimit: 300000});
  await tx2.wait();
  console.log("✅ 2/2:", tx2.hash);
  console.log("🎉 EXECUTE NOW WORKS!");
}

main().catch(console.error);
