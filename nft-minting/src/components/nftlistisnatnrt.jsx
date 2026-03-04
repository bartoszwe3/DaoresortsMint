// src/components/Mint.jsx
import React, { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import useContract from "../hooks/useContract";
import toast from "react-hot-toast";

const IPFS_BASE =
  "https://bafybeignrkywnoamdcjp7ulkot7wwmf5p7kmfefz3jfdob2p5nl5yul4ri.ipfs.dweb.link/";

export default function Mint() {
  const { address, isConnected } = useAppKitAccount();
  const {
    isWhitelisted,
    mintNft,
    mintById,
    isTokenMinted
  } = useContract();

  const [whitelistStatus, setWhitelistStatus] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);

  const [nftPage, setNftPage] = useState(0);
  const [loadingMinted, setLoadingMinted] = useState({});
  const NFTs_PER_PAGE = 20;

  useEffect(() => {
    if (!isConnected || !address) return;
    (async () => {
      try {
        const res = await isWhitelisted();
        setWhitelistStatus(res);
      } catch {}
    })();
  }, [isConnected, address, isWhitelisted]);

  // ---------- Normal Mint ----------
  const handleMintMultiple = async () => {
    if (!isConnected) return toast.error("Connect wallet first.");
    if (!whitelistStatus) return toast.error("You are not whitelisted.");

    const t = toast.loading(`Minting ${mintAmount} NFT(s)...`);
    try {
      for (let i = 0; i < mintAmount; i++) {
        await mintNft();
      }
      toast.success(`Minted successfully!`);
    } catch (err) {
      toast.error(err.message);
    }
    toast.dismiss(t);
  };

  // ---------- Mint by ID ----------
  const handleMintById = async (id) => {
    if (!isConnected) return toast.error("Connect wallet first.");

    setLoadingMinted((prev) => ({ ...prev, [id]: true }));
    const t = toast.loading(`Minting NFT #${id}...`);
    try {
      const alreadyMinted = await isTokenMinted(id);
      if (alreadyMinted) {
        toast.error(`NFT #${id} already minted`);
        return;
      }

      const { tokenId } = await mintById(id);
      toast.success(`NFT #${tokenId} minted 🎉`);
    } catch (err) {
      toast.error(err.message);
    }
    toast.dismiss(t);
    setLoadingMinted((prev) => ({ ...prev, [id]: false }));
  };

  const getNftIdsForPage = () => {
    const start = nftPage * NFTs_PER_PAGE;
    return Array.from({ length: NFTs_PER_PAGE }, (_, i) => start + i + 1);
  };

  return (
    <div className="w-full flex flex-col items-center px-4 pt-4 pb-10 gap-12">

      {/* Mint Box */}
      <div className="w-full max-w-5xl bg-[#0a0f1c] rounded-3xl p-8 flex flex-col gap-6 shadow-xl border border-[#1a2333]">
        <h2 className="text-2xl font-semibold text-white">Mint Random NFT</h2>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            min={1}
            max={20}
            value={mintAmount}
            onChange={(e) => setMintAmount(Number(e.target.value))}
            className="w-20 px-3 py-2 rounded-xl bg-[#050815] border border-[#252b3b] text-sm text-white"
          />
          <button
            onClick={handleMintMultiple}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3E8715] to-[#37DCD0] text-white font-semibold"
          >
            Mint
          </button>
        </div>
        {!whitelistStatus && (
          <p className="text-sm text-red-400">⚠ Not whitelisted → mint disabled</p>
        )}
      </div>

      {/* NFT List Mint-by-ID */}
      <div className="w-full max-w-5xl bg-[#0a0f1c] rounded-3xl p-8 flex flex-col gap-6 shadow-xl border border-[#1a2333]">
        <h2 className="text-xl font-semibold text-white">Choose & Mint Specific NFT</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {getNftIdsForPage().map((id) => (
            <MintTokenCard
              key={id}
              id={id}
              loading={!!loadingMinted[id]}
              onMint={() => handleMintById(id)}
            />
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            disabled={nftPage === 0}
            onClick={() => setNftPage((p) => Math.max(p - 1, 0))}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setNftPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function MintTokenCard({ id, onMint, loading }) {
  return (
    <div
      onClick={!loading ? onMint : undefined}
      className="bg-[#050815] rounded-xl p-2 border border-[#252b3b]
                 flex flex-col items-center cursor-pointer hover:bg-[#11172a] 
                 transition relative"
    >
      <img
        src={`${IPFS_BASE}${id}.png`}
        alt={`NFT ${id}`}
        className="w-full h-32 object-cover rounded-lg"
      />
      <span className="text-xs text-gray-300 mt-1">NFT #{id}</span>

      {loading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs rounded-xl">
          Minting...
        </div>
      )}
    </div>
  );
}
