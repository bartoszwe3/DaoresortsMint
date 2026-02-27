# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:


INSTALL:
1:npm install --save-dev hardhat   


(optional)

2:npm install --save-dev @nomicfoundation/hardhat-toolbox dotenv
3:npm install --save-dev @nomiclabs/hardhat-etherscan
4:npm install @openzeppelin/contracts



```shell
npx hardhat accounts
npx hardhat compile  // now for compile run this command

npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js 

npx hardhat help
```
FOR DEPLOY:

npx hardhat run --network sepolia scripts/grantPermissions.js


npx hardhat run --network sepolia scripts/createProposal.js


FOR AUDIT :

npx hardhat run --network sepolia scripts/dao.js

FOR TEST:

npx hardhat test


FOR VERIFY_for example:
 npx hardhat verify \
--contract "contracts/.sol:" \
--network Bscmainnet 
  
 verify :
 
 npx hardhat verify  --network sepolia 0xEa398FB10396DE1F607bc1FC284bfb9429DE39BD 0x50302d410B1cc1Ce09c4ab797B1178fd29Fd485b 0x50302d410B1cc1Ce09c4ab797B1178fd29Fd485b











Before you begin, ensure you have: 

Node.js (v20 or later) → Download here
https://nodejs.org/en/download


Step 1: open project repo to vs code
Step 2: npm init -y
Step 3: npm install --save-dev hardhat
Step 4: npx hardhat
Step 5: npm install --save-dev @nomiclabs/hardhat-waffle @nomiclabs/hardhat-ethers hardhat-spdx-license-identifier @nomicfoundation/hardhat-verify dotenv
Step 6: create a file named secret.js and add your RPC URL and private key
Step 7: set up Sepolia RPC and Mainnet RPC in hardhat.config.js
Step 8: npx hardhat compile
Step 9: npx hardhat clean
Step 10: npx hardhat test
Step 11: npx hardhat accounts
Step 12: npx hardhat help
Step 13: npx hardhat run --network sepolia scripts/deploy.js
Step 14: wait for deployment and copy the contract address
Step 15: npx hardhat verify --network sepolia <contract_address> <treasury_address> <owner_address>
Step 16: if ready for mainnet, update network to mainnet in hardhat.config.js
Step 17: npx hardhat run --network mainnet scripts/deploy.js
Step 18: npx hardhat verify --network mainnet <contract_address> <treasury_address> <owner_address>
Step 19: npx hardhat flatten > Flattened_ThyroSENSE.sol
Step 20: REPORT_GAS=true npx hardhat test
Step21 : npx hardhat run scripts/solidity_audit.js


