// src/components/Mint.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppKitNetwork } from "@reown/appkit/react";
import useContract from "../hooks/useContract";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, UserPlus } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import RegisterUsers from "./RegisterUsers";

import { NFT_CONTRACT_ADDRESS } from "../contracts/contracts";

const IPFS_BASE = "https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/";
const ITEMS_PER_PAGE = 20;
const TOTAL_SUPPLY = 5000;

export default function Mint({ onMintSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const { chainId } = useAppKitNetwork();
  const { t } = useTranslation();

  const { getBatchTokenStatus, getOwnedBeavers } = useContract();

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mintingId, setMintingId] = useState(null);
  const [hasNft, setHasNft] = useState(false);
  const [nick, setNick] = useState("");
  const [page, setPage] = useState(1);

  // Registration gate state
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  const currentUserAddress = user?.address || user?.publicAddress;
  const API_BASE = process.env.REACT_APP_API_BASE ?? "";

  // Check registration status when wallet connects
  useEffect(() => {
    if (!isAuthenticated || !currentUserAddress) {
      setIsRegistered(false);
      setCheckingRegistration(false);
      return;
    }

    const checkRegistration = async () => {
      setCheckingRegistration(true);
      try {
        const res = await fetch(`${API_BASE}/api/status/${currentUserAddress}`);
        if (res.ok) {
          const data = await res.json();
          setIsRegistered(data.registered || false);
        } else {
          setIsRegistered(false);
        }
      } catch (err) {
        console.error("Registration check failed:", err);
        setIsRegistered(false);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [isAuthenticated, currentUserAddress]);

  // Check NFT ownership
  useEffect(() => {
    if (!isAuthenticated || !currentUserAddress || !isRegistered) {
      setHasNft(false);
      return;
    }
    const checkOwnership = async () => {
      try {
        const owned = await getOwnedBeavers();
        setHasNft(owned && owned.length > 0);
      } catch (err) {
        console.error("Ownership check error:", err);
      }
    };
    checkOwnership();
  }, [isAuthenticated, currentUserAddress, isRegistered, getOwnedBeavers]);

  // Fetch NFT availability grid
  const fetchNFTs = async () => {
    setLoading(true);
    try {
      const startId = (page - 1) * ITEMS_PER_PAGE + 1;
      const endId = Math.min(startId + ITEMS_PER_PAGE - 1, TOTAL_SUPPLY);
      const data = await getBatchTokenStatus(startId, endId);
      const formatted = data
        .map((isMinted, index) => ({
          id: startId + index,
          isMinted,
        }));
      setNfts(formatted);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      toast.error(t("toast_mint_failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRegistered) {
      fetchNFTs();
    }
  }, [page, isRegistered]);

  // Mint handler - no whitelist check, just registration
  const handleMint = async (id) => {
    if (!isAuthenticated) return toast.error(t("toast_connect_wallet"));
    if (!nick.trim()) return toast.error(t("toast_enter_nick"));
    if (hasNft) return toast.error(t("toast_already_own"));

    setMintingId(id);
    const toastId = toast.loading(t("toast_minting"));

    try {
      const response = await fetch(`${API_BASE}/api/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: currentUserAddress,
          photoId: id,
          nick: nick,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(t("toast_mint_success"), { id: toastId });
        setHasNft(true);
        fetchNFTs();
        if (onMintSuccess) onMintSuccess();
      } else {
        throw new Error(result.error || "Minting failed");
      }
    } catch (error) {
      console.error("Mint error:", error);
      toast.error(error.message || t("toast_mint_failed"), { id: toastId });
    } finally {
      setMintingId(null);
    }
  };

  // ─── STATE 1: Checking registration ───────────────────────────────────────
  if (checkingRegistration) {
    return (
      <div className="flex flex-col justify-center items-center py-40 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-neon-cyan/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-neon-cyan rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-sm">Sprawdzanie konta...</p>
      </div>
    );
  }

  // ─── STATE 2: Not authenticated - show landing ────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          {/* Glowing orb */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-neon-cyan/20 rounded-full animate-ping opacity-30"></div>
            <div className="absolute inset-2 bg-neon-cyan/10 rounded-full animate-pulse"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <Sparkles size={48} className="text-neon-cyan" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-sans text-white tracking-tight mb-4">
            <Trans i18nKey="mint_title" components={[<span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent" />]} />
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            {t("mint_subtitle")}
          </p>

          <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-8 shadow-xl shadow-neon-cyan/5">
            <p className="text-white font-bold text-xl mb-2">Połącz portfel, aby zacząć</p>
            <p className="text-gray-400 text-sm mb-6">
              Aby uzyskać dostęp do galerii i zmintować swój paszport DAOResorts, musisz połączyć portfel kryptowalutowy.
            </p>
            <div className="inline-flex items-center gap-2 text-neon-cyan border border-neon-cyan/30 bg-neon-cyan/10 px-6 py-3 rounded-full font-bold text-sm">
              <UserPlus size={18} />
              Użyj przycisku "Połącz portfel" w menu
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── STATE 3: Authenticated but NOT registered - show register form ────────
  if (isAuthenticated && !isRegistered) {
    return (
      <div className="w-full pb-20">
        <div className="text-center mb-4 pt-10">
          <h1 className="text-4xl md:text-5xl font-black font-sans text-white tracking-tight mb-3">
            <Trans i18nKey="mint_title" components={[<span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent" />]} />
          </h1>
          <p className="text-gray-400 text-lg">Zarejestruj się, aby uzyskać dostęp do galerii paszportów.</p>
        </div>
        <RegisterUsers onRegisterSuccess={() => setIsRegistered(true)} />
      </div>
    );
  }

  // ─── STATE 4: Authenticated + Registered - show NFT grid ──────────────────
  return (
    <div className="w-full pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-black font-sans text-white tracking-tight mb-4">
          <Trans i18nKey="mint_title" components={[<span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent" />]} />
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          {t("mint_subtitle")}
        </p>

        {/* Nick input */}
        {!hasNft && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 max-w-md mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl p-4 flex gap-3">
              <input
                type="text"
                placeholder={t("mint_input_placeholder")}
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-all"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-40">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-neon-cyan/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-neon-cyan rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {nfts
                .filter(nft => !nft.isMinted) // Pokaż tylko NIE-wymintowane
                .map((nft) => (
                  <motion.div
                    layout
                    key={nft.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -8 }}
                    className="bg-[#0d1117] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-neon-cyan/30 transition-all duration-500 relative"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={`${IPFS_BASE}${nft.id}.webp`}
                        alt={`Beaver #${nft.id}`}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${nft.isMinted ? "grayscale opacity-40" : ""}`}
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
                        #{nft.id.toString().padStart(4, "0")}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col gap-4">
                      <button
                        disabled={nft.isMinted || !!mintingId}
                        onClick={() => handleMint(nft.id)}
                        className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${nft.isMinted
                          ? "bg-white/5 text-gray-500 cursor-not-allowed"
                          : mintingId === nft.id
                            ? "bg-white/10 text-white cursor-wait"
                            : "bg-white text-black hover:bg-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,243,0.4)]"
                          }`}
                      >
                        {nft.isMinted ? (
                          t("mint_btn_unavailable")
                        ) : mintingId === nft.id ? (
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : hasNft ? (
                          <>{t("mint_btn_owned")} <Sparkles size={16} /></>
                        ) : (
                          <>{t("mint_btn_mint")} <Sparkles size={16} /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
            >
              {t("pagination_prev")}
            </button>
            <span className="text-white font-bold px-4">{t("pagination_page")} {page}</span>
            <button
              disabled={page * ITEMS_PER_PAGE >= TOTAL_SUPPLY}
              onClick={() => setPage((p) => p + 1)}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all"
            >
              {t("pagination_next")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
