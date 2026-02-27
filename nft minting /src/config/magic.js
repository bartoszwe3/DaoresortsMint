import { Magic } from 'magic-sdk';

const customNodeOptions = {
    rpcUrl: process.env.REACT_APP_RPC_URL || 'http://127.0.0.1:8545/',
    chainId: process.env.REACT_CHAIN_ID ? parseInt(process.env.REACT_CHAIN_ID, 10) : 31337,
};

const apiKey = process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY || 'pk_live_YOUR_MAGIC_KEY';
console.log("Loaded Magic Key:", apiKey.substring(0, 15) + "...");

// Initialize Magic only on the client side
export const magic = typeof window !== 'undefined'
    ? new Magic(apiKey, {
        network: customNodeOptions,
    })
    : null;
