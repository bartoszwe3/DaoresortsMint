"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Menu, X, Wallet, Users, Users2, Shield, Image as ImageIcon, Vote, BarChart3, Building2, Info, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RegisterUsers from "./RegisterUsers";
import AdminWhitelist from "./AdminWhitelist";
import Mint from "./Mint";
import NftVoting from "./NftVoting";
import NftVotingStats from "./NftVotingStats";
import MyNfts from "./MyNfts";
import AboutProject from "./AboutProject";
import ProjectsShowcase from "./ProjectsShowcase";
import LandingPage from "./LandingPage";
import LoginModal from "./LoginModal";
import Team from "./Team";
import FAQ from "./FAQ";
import TopNavbar from "./TopNavbar";
import { useAppKit, useAppKitNetwork } from "@reown/appkit/react";
import { HelpCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useContract from "../hooks/useContract";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

/* =======================
   ENV (Vite compatible)
======================= */
const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS?.toLowerCase();
const REQUIRED_CHAIN_ID = 80002; // Polygon Amoy

/* =======================
   Helpers
======================= */
const shortenAddress = (addr) =>
  addr ? `${addr.slice(0, 5)}....${addr.slice(-4)}` : "";

const IPFS_BASE = "https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/";

export default function MainPage() {
  const [selected, setSelected] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarNft, setSidebarNft] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { open } = useAppKit();
  const { user, isAuthenticated, logout } = useAuth();
  const { chainId, switchNetwork } = useAppKitNetwork();
  const { getOwnedBeavers } = useContract();
  const { t, i18n } = useTranslation();

  const address = user?.address || user?.publicAddress;
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRecord, setUserRecord] = useState(null);

  // Check registration status
  useEffect(() => {
    const checkReg = async () => {
      if (!isAuthenticated || !address) { setIsRegistered(false); return; }
      try {
        const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5003";
        const res = await fetch(`${API_BASE}/api/status/${address}`);
        if (res.ok) {
          const data = await res.json();
          setIsRegistered(data.registered || false);
          setUserRecord(data);
        } else {
          setIsRegistered(false);
          setUserRecord(null);
        }
      } catch {
        setIsRegistered(false);
        setUserRecord(null);
      }
    };
    checkReg();
  }, [isAuthenticated, address]);

  const setLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Check if we are on the wrong network
  const isWrongNetwork = isAuthenticated && user?.type === 'wallet' && chainId !== REQUIRED_CHAIN_ID;

  const scrollContainerRef = useRef(null);

  const refreshSidebarNft = useCallback(async () => {
    if (!address || !isAuthenticated) {
      setSidebarNft(null);
      return;
    }
    try {
      const owned = await getOwnedBeavers();
      if (owned && owned.length > 0) {
        // Take the first one
        const nft = owned[0];
        setSidebarNft({
          id: Number(nft.photoId),
          tokenId: nft.tokenId?.toString(),
          name: nft.memberName || t("nav_mynfts") // Fallback name
        });
      }
    } catch (err) {
      console.error("Sidebar NFT fetch error:", err);
    }
  }, [isAuthenticated, address, getOwnedBeavers, t]);

  useEffect(() => {
    refreshSidebarNft();
  }, [refreshSidebarNft]);

  /* =======================
     Admin Check
  ======================= */
  const isAdmin = useMemo(() => {
    if (!isAuthenticated || !address || !OWNER_ADDRESS) return false;
    return address.toLowerCase() === OWNER_ADDRESS.toLowerCase();
  }, [isAuthenticated, address]);

  const isState3Member = !!userRecord?.membershipTokenId || isAdmin;

  const connectWallet = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      if (user?.type === "wallet") {
        open({ view: "Account" });
      } else {
        logout();
        toast.success("Logged out from Email session");
      }
    }
  };

  const menuItems = [
    { id: "home", label: t("nav_home"), icon: Home, isAnchor: true, target: "hero" },
    { id: "team", label: t("nav_team"), icon: Users2 },

    // App Routes — register only shown when NOT yet registered
    ...(!isRegistered ? [{ id: "register", label: t("nav_register"), icon: Users }] : []),
    ...(isAdmin ? [{ id: "admin", label: t("nav_admin"), icon: Shield }] : []),
    ...(!sidebarNft ? [{ id: "mint", label: t("nav_mint"), icon: ImageIcon }] : []),
    ...(isAuthenticated ? [{ id: "mynfts", label: t("nav_mynfts"), icon: Wallet }] : []),
    { id: "voting", label: t("nav_voting"), icon: Vote },
    { id: "projects", label: t("nav_projects"), icon: Building2 },
    { id: "faq", label: t("nav_faq", "Q&A"), icon: HelpCircle },
    ...(isAdmin ? [{ id: "stats", label: t("nav_stats"), icon: BarChart3 }] : []),
  ];

  return (
    <div className="w-full h-screen flex bg-deep-black text-white overflow-hidden relative selection:bg-neon-cyan selection:text-black">

      {/* Background Glows */}
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-forest-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* =======================
          TOP NAVBAR (UNIFIED FOR ALL STATES)
      ======================= */}
      <TopNavbar
        onNavigate={setSelected}
        activeTab={selected}
        isRegistered={isRegistered}
        address={address}
        isState3Member={isState3Member}
        isAdmin={isAdmin}
      />

      {/* =======================
          SIDEBAR REMOVED
      ======================= */}

      {/* Content Area uses pt-[72px] for all states to account for TopNavbar */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden isolate pt-[72px]">

        {/* Network Warning */}
        <AnimatePresence>
          {isWrongNetwork && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 border-b border-red-500/20 backdrop-blur-sm"
            >
              <div className="max-w-7xl mx-auto py-2 px-4 flex items-center justify-center gap-4">
                <span className="text-red-400 font-medium text-sm">⚠ Wrong Network Detected</span>
                <button
                  onClick={() => switchNetwork(Number(REQUIRED_CHAIN_ID))}
                  className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-full transition shadow-lg shadow-red-500/20"
                >
                  Switch to Polygon Amoy
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="w-full max-w-6xl mx-auto">
            {selected === "home" && <LandingPage onConnect={connectWallet} scrollContainer={scrollContainerRef} hasNft={!!sidebarNft} onNavigate={setSelected} />}
            {selected === "register" && <RegisterUsers />}
            {selected === "admin" && isAdmin && <AdminWhitelist />}
            {selected === "about" && <AboutProject />}
            {selected === "mint" && <Mint onMintSuccess={refreshSidebarNft} />}
            {selected === "mynfts" && <MyNfts />}
            {selected === "projects" && <ProjectsShowcase />}
            {selected === "voting" && <NftVoting isState3Member={isState3Member} />}
            {selected === "team" && <Team hasNft={!!sidebarNft} onNavigate={setSelected} />}
            {selected === "faq" && <FAQ />}
            {selected === "stats" && isAdmin && <NftVotingStats />}
          </div>
        </div>
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
