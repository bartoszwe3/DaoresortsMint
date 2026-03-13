import { Magic } from 'magic-sdk';

const customNodeOptions = {
    rpcUrl: process.env.REACT_APP_RPC_URL || 'https://polygon-bor-rpc.publicnode.com',
    chainId: process.env.REACT_CHAIN_ID ? parseInt(process.env.REACT_CHAIN_ID, 10) : 137,
};

const apiKey = process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY || 'pk_live_B257294FC65320A7';
console.log("Loaded Magic Key:", apiKey.substring(0, 15) + "...");

// Initialize Magic only on the client side
export const magic = typeof window !== 'undefined'
    ? new Magic(apiKey, {
        network: customNodeOptions,
    })
    : null;
