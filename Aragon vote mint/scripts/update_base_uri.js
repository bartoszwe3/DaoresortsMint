const hre = require("hardhat");

async function main() {
    const newBaseURL = process.env.NEW_BASE_URL;

    if (!newBaseURL) {
        console.error("❌ ERROR: Musisz podać URL w zmiennej środowiskowej NEW_BASE_URL.");
        console.log("Przykład: NEW_BASE_URL=https://twoja-apka.up.railway.app/api/metadata/ npx hardhat run scripts/update_base_uri.js --network polygon");
        process.exit(1);
    }

    const contractAddress = "0x4CcC886CcB56914695d5Ce5adb79619Ed8122DaB";
    console.log(`🔗 Łączenie z kontraktem: ${contractAddress}`);
    console.log(`🌍 Nowy Base URI: ${newBaseURL}`);

    const BeaverPassport = await hre.ethers.getContractFactory("DAOBeaverPassport");
    const passport = await BeaverPassport.attach(contractAddress);

    console.log("⏳ Wysyłanie transakcji na Polygon (setBaseURI)...");

    // Używamy portfela skonfigurowanego w hardhat.config.js (PRIVATE_KEY)
    const tx = await passport.setBaseURI(newBaseURL);

    console.log(`📡 Transakcja wysłana! Hash: ${tx.hash}`);
    console.log("⏳ Czekam na potwierdzenie...");

    await tx.wait();

    console.log("✅ SUKCES! Base URI został zaktualizowany na blockchainie.");
    console.log("Teraz portfele (MetaMask) będą szukać obrazków pod nowym adresem.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
