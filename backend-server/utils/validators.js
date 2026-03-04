const fs = require('fs');
const path = require('path');

const FILE_USERS = path.join(__dirname, '../data/users.json');

const loadJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

async function checkDuplicateNFT(email, walletAddress, excludeUserId = null) {
    const users = loadJSON(FILE_USERS);

    const existing = users.find(u => {
        // If we're excluding a specific user (e.g. updating the current user), skip them
        if (excludeUserId && u.wallet && u.wallet.toLowerCase() === excludeUserId.toLowerCase()) {
            return false;
        }

        // Check for email OR wallet match
        const emailMatch = u.email && u.email.toLowerCase() === email.toLowerCase();
        const walletMatch = u.wallet && walletAddress && u.wallet.toLowerCase() === walletAddress.toLowerCase();

        // They must have the NFT
        const hasNFT = !!u.membershipTokenId;

        return (emailMatch || walletMatch) && hasNFT;
    });

    if (existing) {
        throw new Error(
            'Ten email lub portfel już posiada NFT membership. ' +
            'Jedna osoba może mieć tylko jedno członkostwo.'
        );
    }

    return true;
}

module.exports = { checkDuplicateNFT };
