// src/components/RegisterUsers.jsx

import React, { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import useContract from "../hooks/useContract";
import toast from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE;
const IPFS_BASE =
  "https://bafybeignrkywnoamdcjp7ulkot7wwmf5p7kmfefz3jfdob2p5nl5yul4ri.ipfs.dweb.link/";

export default function RegisterUsers() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { isWhitelisted, isTokenMinted, mintById } = useContract();

  const NFTs_PER_PAGE = 20;

  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [whitelistStatus, setWhitelistStatus] = useState(false);

  const [nftPage, setNftPage] = useState(0);
  const [pageTokens, setPageTokens] = useState([]);
  const [loadingGrid, setLoadingGrid] = useState(true);
  const [mintingId, setMintingId] = useState(null);

  useEffect(() => {
    if (isConnected && address) setWalletAddress(address);
  }, [isConnected, address]);

  useEffect(() => {
    if (!isConnected) return;
    (async () => {
      try {
        const white = await isWhitelisted();
        setWhitelistStatus(white);
      } catch {}
    })();
  }, [isConnected, address, isWhitelisted]);

  /** 🔥 Load EXACTLY 20 un-minted NFTs */
  const loadPageTokens = async () => {
    setLoadingGrid(true);

    const startId = nftPage * NFTs_PER_PAGE + 1;
    let currentId = startId;
    const tokens = [];

    while (tokens.length < NFTs_PER_PAGE) {
      const minted = await isTokenMinted(currentId);
      if (!minted) tokens.push(currentId);
      currentId++;
    }

    setPageTokens(tokens);
    setLoadingGrid(false);
  };

  useEffect(() => {
    if (!isConnected) return;
    loadPageTokens();
  }, [isConnected, nftPage]);

  /** 🔥 Mint NFT by ID */
  const handleMintById = async (tokenId) => {
    if (!whitelistStatus) return toast.error("Not whitelisted!");
    setMintingId(tokenId);
    const t = toast.loading(`Minting NFT #${tokenId}...`);

    try {
      await mintById(tokenId);
      toast.success(`NFT #${tokenId} minted 🎉`);
      await loadPageTokens();
    } catch (err) {
      toast.error(err.message || "Failed mint");
    }

    toast.dismiss(t);
    setMintingId(null);
  };

  return (
    <div className="w-full flex flex-col items-center px-4 pt-4 pb-10 gap-12">

      {/* REGISTER FORM */}
      <div className="w-full max-w-5xl bg-[#0a0f1c] rounded-3xl p-8 shadow-xl border border-[#1a2333]">
        <h1 className="text-4xl text-center font-bold text-[#06f4c3] mb-6">Register</h1>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email || !walletAddress) return toast.error("Fill all fields");
            if (!agreedToPrivacy) return toast.error("Agree to privacy policy");
            if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress))
              return toast.error("Invalid wallet");

            await fetch(`${API_BASE}/api/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, wallet: walletAddress }),
            });

            toast.success("Registered! Wait for whitelist approval");
            setEmail("");
            setAgreedToPrivacy(false);
          }}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-[#050815] border border-[#252b3b]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Wallet Address"
            className="w-full px-4 py-2 rounded bg-[#050815] border border-[#252b3b]"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />

          <label className="flex items-center gap-2 text-gray-400 text-xs">
            <input
              type="checkbox"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            />
            I agree to privacy policy
          </label>

          {!isConnected && (
            <button type="button" onClick={() => open("Connect")} className="text-[#06f4c3] underline">
              Connect Wallet
            </button>
          )}

          <button
            type="submit"
            className="w-full p-3 rounded-full bg-gradient-to-r from-[#3E8715] to-[#37DCD0] text-white font-semibold"
          >
            Register
          </button>
        </form>
      </div>

      {/* NFT GRID (only if whitelisted) */}
      {whitelistStatus && (
        <div className="w-full max-w-5xl bg-[#0a0f1c] rounded-3xl p-8 shadow-xl border border-[#1a2333]">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Select NFT to Mint</h2>
            <button
              onClick={loadPageTokens}
              className="text-[#06f4c3] text-sm hover:text-white"
            >
              🔄 Reload
            </button>
          </div>

          {loadingGrid ? (
            <p className="text-gray-300 text-center">Loading NFTs…</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {pageTokens.map((id) => (
                <div
                  key={id}
                  onClick={() => handleMintById(id)}
                  className="bg-[#050815] rounded-xl p-2 border border-[#252b3b] cursor-pointer hover:bg-[#11172a] transition relative"
                >
                  <img
                    src={`${IPFS_BASE}${id}.png`}
                    alt={`NFT ${id}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-300 mt-1">#{id}</p>

                  {mintingId === id && (
                    <div className="absolute inset-0 bg-black/70 flex justify-center items-center text-sm text-white rounded-xl">
                      Minting…
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              disabled={nftPage === 0}
              onClick={() => setNftPage((p) => Math.max(p - 1, 0))}
              className="px-4 py-2 bg-gray-700 disabled:opacity-40 rounded text-white"
            >
              Prev
            </button>

            <button
              onClick={() => setNftPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-700 rounded text-white"
            >
              Next
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
