const hre = require("hardhat");

async function main() {
  console.log("Deploying separate DAOBeaverPassport contract...");

  const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");

  // Base URI can be updated later if needed. Setting a default for local dev.
  // UPDATE: This uses the production render.com V2 endpoint
  const baseTokenURI = "https://daoresorts-backend.onrender.com/api/metadata/";

  const passport = await BeaverPassport.deploy(baseTokenURI);

  await passport.deployed();

  console.log("DAOBeaverPassport deployed to:", passport.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
