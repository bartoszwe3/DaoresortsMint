const hre = require("hardhat");

async function main() {
  console.log("Deploying separate DAOBeaverPassport contract...");

  const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");

  // Base URI can be updated later if needed. Setting a default for local dev.
  const baseTokenURI = "http://localhost:3001/api/metadata/";

  const passport = await BeaverPassport.deploy(baseTokenURI);

  await passport.deployed();

  console.log("DAOBeaverPassport deployed to:", passport.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
