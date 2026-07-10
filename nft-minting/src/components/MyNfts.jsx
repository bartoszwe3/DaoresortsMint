// src/components/MyNfts.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useContract from "../hooks/useContract";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Hash, User, Shield, Image as ImageIcon, Lock, Crown, CheckCircle, Clock, AlertCircle, Edit3 } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import toast from "react-hot-toast";
import { PAYMENT_STAGES } from "../constants/tokenomics";

const IPFS_BASE = "https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/";
const API_BASE = process.env.REACT_APP_API_BASE ?? "";

// ─── KYC Badge ──────────────────────────────────────────────────────────────
function KycBadge({ status, large = false }) {
  const configs = {
    approved: {
      label: "✅ KYC Zweryfikowany - Pełny dostęp",
      className: "bg-green-500/15 text-green-400 border-green-500/30",
    },
    pending: {
      label: "⏳ KYC w trakcie weryfikacji",
      className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
    rejected: {
      label: "❌ KYC Odrzucony - Spróbuj ponownie",
      className: "bg-red-500/15 text-red-400 border-red-500/30",
    },
    not_started: {
      label: "❌ KYC Wymagany",
      className: "bg-red-500/15 text-red-400 border-red-500/30",
    },
  };
  const c = configs[status] || configs.not_started;
  return (
    <span className={`inline-flex items-center border font-bold rounded-full ${large ? "px-5 py-2 text-sm" : "px-3 py-1 text-xs"} ${c.className}`}>
      {c.label}
    </span>
  );
}

// ─── Stage Progress Bar ──────────────────────────────────────────────────────
function StageProgressBar({ stages = {}, currentStage = 0, onPayNext }) {
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 mb-8">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <Clock size={18} className="text-gold-500" />
        Status Członkostwa ({PAYMENT_STAGES.length} Etapów)
      </h3>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-white/5 -z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-gold-500 transition-all duration-500 -z-0"
          style={{ width: `${(Math.min(currentStage, PAYMENT_STAGES.length - 1) / (PAYMENT_STAGES.length - 1)) * 100}%` }}
        />

        <div className="flex justify-between relative z-10">
          {PAYMENT_STAGES.map((s, idx) => {
            const stageData = (stages || {})[s.id];
            const isConfirmed = stageData?.status === 'confirmed';
            const isPending = stageData?.status === 'awaiting' || stageData?.status === 'verification';
            const isCurrent = s.id === currentStage;

            return (
              <div key={idx} className="flex flex-col items-center group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isConfirmed ? "bg-gold-500 border-gold-500 text-forest-900" :
                  isPending ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 animate-pulse" :
                    isCurrent ? "bg-white/10 border-gold-500 text-gold-500 scale-110" :
                      "bg-black border-white/10 text-gray-600"
                  }`}>
                  {isConfirmed ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{s.id}</span>}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? "text-gold-500" : "text-gray-500"}`}>
                    {s.label_pl}
                  </p>
                  <p className="text-[9px] text-gray-600 hidden md:block max-w-[80px] leading-tight mt-0.5">
                    {s.amount.toLocaleString()} PLN
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentStage < PAYMENT_STAGES.length && !Object.values(stages || {}).some(s => s.status === 'awaiting' || s.status === 'verification') && (
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-bold text-sm">
              Następny krok: {PAYMENT_STAGES[currentStage]?.label_pl}
            </p>
            <p className="text-gray-400 text-xs">
              {PAYMENT_STAGES[currentStage]?.desc_pl} - {PAYMENT_STAGES[currentStage]?.amount.toLocaleString()} PLN
            </p>
          </div>
          <button
            onClick={() => onPayNext(currentStage)}
            className="w-full md:w-auto bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold px-6 py-2 rounded-xl transition-all hover:scale-105 shadow-lg shadow-gold-500/20"
          >
            Opłać etap {currentStage} →
          </button>
        </div>
      )}
    </div>
  );
}

export default function MyNfts() {
  const { user, isAuthenticated } = useAuth();
  const { getOwnedBeavers } = useContract();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Redirect unauthenticated
  useEffect(() => {
    if (!isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNft, setSelectedNft] = useState(null);
  const [kycStatus, setKycStatus] = useState("not_started");
  const [kycData, setKycData] = useState(null);
  const [kycVerifiedAt, setKycVerifiedAt] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [userRecord, setUserRecord] = useState(null); // full record from /api/status
  const [payment, setPayment] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Name Beaver modal
  const [showNameModal, setShowNameModal] = useState(false);
  const [beaverName, setBeaverName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Email capture modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const currentUserAddress = user?.address || user?.publicAddress;

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!domain) return email;
    return `${name.charAt(0)}***@${domain}`;
  };

  // Fetch NFTs - convert ethers Result (BigNumber proxy) to plain JS objects immediately
  useEffect(() => {
    const fetchMyNfts = async () => {
      if (!isAuthenticated || !currentUserAddress) { setNfts([]); return; }
      setLoading(true);
      try {
        const owned = await getOwnedBeavers();
        // Safely convert ethers Result/BigNumber to plain serializable strings
        const plain = (owned || []).map((nft) => ({
          tokenId: String(nft.tokenId ?? nft[0] ?? ""),
          photoId: String(nft.photoId ?? nft[1] ?? ""),
          mintTimestamp: String(nft.mintTimestamp ?? nft[2] ?? "0"),
          memberName: String(nft.memberName ?? nft[3] ?? ""),
          nick: String(nft.nick ?? nft[4] ?? ""),
        }));
        setNfts(plain);
      } catch (e) {
        console.error("NFT fetch error:", e);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyNfts();
  }, [isAuthenticated, currentUserAddress, getOwnedBeavers]);

  // Fetch registration status - full record including minted/tokenId/photoId
  useEffect(() => {
    if (!isAuthenticated || !currentUserAddress) return;
    fetch(`${API_BASE}/api/status/${currentUserAddress}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        setUserRecord(d);
        const email = d.email || user?.email || null;
        setRegisteredEmail(email);
        setEmailLoaded(true);
        // Pre-fill KYC status from DB (faster than waiting for /api/kyc/status poll)
        if (d.kycStatus && d.kycStatus !== "not_started") {
          setKycStatus(d.kycStatus);
          setKycVerifiedAt(d.kycVerifiedAt || null);
        }
        if (d.registered && !email) {
          setShowEmailModal(true);
        }
      })
      .catch(() => { setEmailLoaded(true); });
  }, [isAuthenticated, currentUserAddress]);

  // KYC Polling
  useEffect(() => {
    if (!isAuthenticated || !currentUserAddress) return;
    let interval;
    let timeout;
    const fetchKyc = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/kyc/status/${currentUserAddress}`);
        if (!res.ok) return;
        const data = await res.json();
        setKycStatus(data.status || "not_started");
        setKycData(data.kycData || null);
        setKycVerifiedAt(data.verifiedAt || null);
        if (data.status === "approved") {
          const payRes = await fetch(`${API_BASE}/api/payments/my/${currentUserAddress}`);
          if (payRes.ok) setPayment(await payRes.json());
          clearInterval(interval);
          clearTimeout(timeout);
        }
        if (data.status === "rejected") { clearInterval(interval); clearTimeout(timeout); }
      } catch (e) { console.error("KYC poll error:", e); }
    };
    fetchKyc();
    interval = setInterval(fetchKyc, 3000);
    timeout = setTimeout(() => { clearInterval(interval); }, 900000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [isAuthenticated, currentUserAddress]);

  const handleStartVerification = () => {
    const WORKFLOW_URL = "https://verify.didit.me/u/vdqpdFYlTz-UhJHbIbcn1Q";
    const popup = window.open(
      `${WORKFLOW_URL}?external_id=${currentUserAddress}&email=${user?.email || ""}`,
      "DidIt_KYC",
      `width=600,height=800,top=${(window.innerHeight - 800) / 2},left=${(window.innerWidth - 600) / 2},scrollbars=yes`
    );
    if (!popup) { toast.error("Zezwól na pop-upy dla tej strony"); return; }
    setKycStatus("pending");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Użyj PDF, JPG lub PNG"); return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error("Maks. 5MB"); return; }
    setProofFile(file);
  };

  const uploadProof = async () => {
    if (!proofFile || !payment) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("proof", proofFile);
      form.append("paymentId", payment.id || payment.orderId);
      form.append("walletAddress", currentUserAddress);
      const res = await fetch(`${API_BASE}/api/payments/upload-proof`, { method: "POST", body: form });
      if (!res.ok) throw new Error();
      toast.success("Potwierdzenie wysłane!");
      setProofFile(null);
      setPayment(prev => ({ ...prev, status: "verification" }));
    } catch { toast.error("Błąd wysyłania"); } finally { setUploading(false); }
  };

  const handleSaveEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.trim() || !emailRegex.test(emailInput.trim())) {
      toast.error("Podaj prawidłowy adres email"); return;
    }
    setSavingEmail(true);
    try {
      const res = await fetch(`${API_BASE}/api/update-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: currentUserAddress, email: emailInput.trim() }),
      });
      if (res.ok) {
        setRegisteredEmail(emailInput.trim());
        setShowEmailModal(false);
        toast.success("Email zapisany! ✅");
      } else {
        toast.error("Błąd zapisu emaila");
      }
    } catch { toast.error("Błąd połączenia"); } finally { setSavingEmail(false); }
  };

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); toast.success("Skopiowano!"); }
    catch { toast.error("Nie udało się skopiować"); }
  };

  const formatDate = (ts) => {
    if (!ts) return "-";
    try {
      // Handle ethers BigNumber, BigInt, string or plain number
      const ms = (typeof ts === "object" && ts.toNumber ? ts.toNumber() : Number(ts.toString())) * 1000;
      return new Date(ms).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "-";
    }
  };

  const handleSaveName = async () => {
    if (!beaverName.trim()) { toast.error("Podaj imię bobra"); return; }
    setSavingName(true);
    try {
      const res = await fetch(`${API_BASE}/api/update-beaver-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: currentUserAddress, name: beaverName.trim() }),
      });
      if (res.ok) {
        toast.success("Imię zapisane!");
        setShowNameModal(false);
        // Refresh NFTs
        const owned = await getOwnedBeavers();
        setNfts(owned);
      } else {
        toast.error("Błąd zapisu");
      }
    } catch { toast.error("Błąd połączenia"); } finally { setSavingName(false); }
  };

  // Derived helpers - use blockchain NFTs first, fall back to API record
  const firstNft = nfts[0];
  // Use photoId from blockchain NFT, or from users.json record
  const avatarPhotoId = firstNft?.photoId || userRecord?.photoId;
  const displayTokenId = firstNft?.tokenId || (userRecord?.membershipTokenId != null ? String(userRecord.membershipTokenId) : null);
  // Name: blockchain first (non-empty), then users.json, then nothing
  const displayName = (firstNft?.memberName && firstNft.memberName !== "undefined" && firstNft.memberName)
    || firstNft?.nick
    || userRecord?.memberName
    || "";
  const isApproved = kycStatus === "approved";
  const isReserved = userRecord?.status === 'reserved' || (userRecord?.paymentStages?.[0]?.status === 'confirmed');

  // Calculate current stage (first one that isn't confirmed)
  const currentStage = (() => {
    if (!userRecord?.paymentStages) return 0;
    for (let i = 0; i <= 4; i++) {
      if (!userRecord.paymentStages[i] || userRecord.paymentStages[i].status !== 'confirmed') return i;
    }
    return 5; // All confirmed
  })();

  const isState3Member = !!(firstNft?.tokenId || userRecord?.membershipTokenId) ||
    (currentUserAddress && process.env.REACT_APP_OWNER_ADDRESS && currentUserAddress.toLowerCase() === process.env.REACT_APP_OWNER_ADDRESS.toLowerCase()) ||
    (userRecord?.paymentStages?.[4]?.status === 'confirmed');

  // Build a synthetic NFT row from API data when blockchain is unavailable
  const apiNftRow = userRecord?.minted && userRecord?.membershipTokenId != null ? {
    tokenId: String(userRecord.membershipTokenId),
    photoId: String(userRecord.photoId || ""),
    mintTimestamp: userRecord.registeredAt ? String(Math.floor(userRecord.registeredAt / 1000)) : "0",
    memberName: userRecord.memberName || "",
    nick: "",
  } : null;
  // Display list: blockchain first, fall back to users.json record
  const displayNfts = nfts.length > 0 ? nfts : (apiNftRow ? [apiNftRow] : []);

  return (
    <div className="w-full min-h-[60vh] py-10 px-4 max-w-4xl mx-auto">
      {isAuthenticated ? (
        <>
          {/* ──────────────────────────────────────
              1. HEADER - Profil użytkownika
          ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1117] border border-[#2D5A3D] rounded-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl shadow-black/30"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-lg ${userRecord?.status === 'reserved' ? "border-4 border-gold-500 shadow-gold-500/20" : "border-2 border-neon-cyan/40 shadow-neon-cyan/10"}`}>
                {avatarPhotoId ? (
                  <img
                    src={`${IPFS_BASE}${avatarPhotoId}.webp`}
                    alt="Beaver avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neon-cyan/10 flex items-center justify-center">
                    <User size={40} className="text-neon-cyan/50" />
                  </div>
                )}
              </div>
              {(isApproved || userRecord?.status === 'reserved') && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0d1117]">
                  <CheckCircle size={14} className="text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {displayName ? (
                    displayName
                  ) : (
                    <button
                      onClick={() => setShowNameModal(true)}
                      className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors group"
                    >
                      <Edit3 size={18} className="group-hover:scale-110 transition-transform" />
                      Ustaw nazwę paszportu
                    </button>
                  )}
                </h1>
                {firstNft && (
                  <span className="inline-block bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 px-3 py-1 rounded-full text-sm font-bold font-mono">
                    #{firstNft.tokenId?.toString()}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {registeredEmail ? maskEmail(registeredEmail) : user?.email ? maskEmail(user?.email) : (
                  <span className="text-gray-600 italic">Brak adresu email</span>
                )}
              </p>
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                <KycBadge status={kycStatus} />
                {userRecord?.status === 'reserved' && (
                  <span className="bg-gold-500/15 text-gold-500 border border-gold-500/30 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                    ⭐ ZAREZERWOWANE #{userRecord?.tokenNumber || "47"}
                  </span>
                )}
                {userRecord?.status === 'pending_payment' && (
                  <span className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider animate-pulse">
                    ⏳ Oczekiwanie na wpłatę
                  </span>
                )}
              </div>
            </div>

            {/* KYC action if not started */}
            {!isApproved && kycStatus !== "pending" && (
              <div className="shrink-0">
                <button
                  onClick={handleStartVerification}
                  className="bg-gold-500 hover:bg-gold-600 text-forest-900 font-bold px-6 py-3 rounded-2xl hover:scale-105 transition-all shadow-btn-primary hover:shadow-btn-primary-hover text-sm whitespace-nowrap"
                >
                  {kycStatus === "rejected" ? "Spróbuj ponownie" : "Zweryfikuj KYC →"}
                </button>
              </div>
            )}
            {kycStatus === "pending" && (
              <div className="shrink-0 flex items-center gap-2 text-yellow-400 font-bold">
                <Clock size={20} className="animate-pulse" />
                Weryfikacja...
              </div>
            )}
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan" />
            </div>
          ) : (
            <div className="flex flex-col gap-8">

              {/* 5-Stage Progress Bar */}
              {(isReserved || (userRecord?.paymentStages && Object.keys(userRecord.paymentStages).length > 0)) && (
                <StageProgressBar
                  stages={userRecord?.paymentStages || {}}
                  currentStage={currentStage}
                  onPayNext={(s) => navigate(`/checkout/stage/${s}`)}
                />
              )}

              {/* ──────────────────────────────────────
                  3. Tabela Szczegółów Konta
              ────────────────────────────────────── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-2">
                  <User size={18} className="text-neon-cyan" />
                  <h2 className="text-lg font-bold text-white">Szczegóły Konta</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/40 text-gray-400 text-xs uppercase tracking-widest">
                        <th className="p-4 md:p-5 font-medium">Numer Miejsca</th>
                        <th className="p-4 md:p-5 font-medium">Data Dołączenia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {displayNfts.length > 0 ? displayNfts.map((nft) => (
                        <tr key={nft.tokenId} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 md:p-5">
                            <span className="text-neon-cyan font-mono font-bold text-lg">#{nft.tokenId?.toString()}</span>
                          </td>
                          <td className="p-4 md:p-5 text-gray-300 text-sm">{formatDate(nft.mintTimestamp)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={2} className="p-8 text-center text-gray-500">
                            <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                            Brak aktywnych paszportów
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* ──────────────────────────────────────
                 {/* 4. Komunikat po rezerwacji / PNB */}
              {userRecord?.status === 'reserved' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-[#1C2614] to-[#0d1117] border border-gold-500/30 rounded-2xl p-6 md:p-8 shadow-lg shadow-gold-500/5 relative overflow-hidden"
                >
                  {/* Background element */}
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Crown size={120} className="text-gold-500" />
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center shrink-0">
                      <Clock size={32} className="text-gold-500" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-black text-white mb-2">
                        ✨ Masz zarezerwowane miejsce #{userRecord?.tokenNumber || "47"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <p className="text-gray-400 text-xs uppercase">Pozostało do zapłaty</p>
                          <p className="text-[#F5F0E8] font-bold text-lg">23 900 PLN</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <p className="text-gray-400 text-xs uppercase">Termin dopłaty</p>
                          <p className="text-gold-500 font-bold text-lg">30 dni od uzyskania PNB</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                        Twoje miejsce jest bezpieczne. Poinformujemy Cię niezwłocznie po uzyskaniu pozwolenia na budowę (PNB), abyś mógł aktywować pełne członkostwo.
                      </p>
                    </div>
                    <div className="shrink-0">
                      {userRecord?.pnbObtained ? (
                        <button
                          onClick={() => navigate("/checkout/activate")}
                          className="bg-gold-500 hover:bg-gold-600 text-forest-900 font-black px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-gold-500/25 text-lg whitespace-nowrap"
                        >
                          Aktywuj Członkostwo →
                        </button>
                      ) : (
                        <div className="text-center">
                          <span className="text-[#8A9E8A] text-xs block mb-2">Dostępne po PNB</span>
                          <button disabled className="bg-gray-800 text-gray-500 font-black px-8 py-4 rounded-2xl cursor-not-allowed opacity-50 text-lg whitespace-nowrap">
                            Aktywuj Członkostwo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Original Full Member logic if they have tokenId (Stage 3) */}
              {isState3Member && !isReserved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-green-950/60 to-[#0d1117] border border-green-500/30 rounded-2xl p-6 md:p-8 shadow-lg shadow-green-500/5"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center shrink-0">
                      <CheckCircle size={32} className="text-green-400" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-black text-white mb-2">
                        Witaj w społeczności Silna.club.
                      </h3>
                      <div className="text-green-300/80 text-sm leading-relaxed space-y-3">
                        <p>Twój darmowy Paszport jest aktywny.</p>
                        <p>
                          Obserwujesz budowę resortu w czasie rzeczywistym.<br />
                          Gdy będziesz gotowy - Twoje miejsce czeka.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ──────────────────────────────────────
                  5. Private Club
              ────────────────────────────────────── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
                {isApproved ? (
                  <div className="bg-gradient-to-br from-yellow-950/50 to-[#0d1117] border border-yellow-500/30 rounded-2xl p-6 md:p-8 shadow-lg shadow-yellow-500/5">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center shrink-0">
                        <Crown size={32} className="text-yellow-400" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-black text-white mb-1">🏆 Private Club</h3>
                        <span className="inline-block bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full mb-2">
                          Masz dostęp do Private Club
                        </span>
                        <p className="text-gray-400 text-sm">
                          Ekskluzywne oferty, wcześniejszy dostęp do rezerwacji i specjalne zniżki dla członków.
                        </p>
                      </div>
                      <button className="shrink-0 border border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold px-6 py-3 rounded-2xl transition-colors whitespace-nowrap">
                        Wejdź do klubu →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 md:p-8 opacity-70 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
                      <div className="text-center">
                        <Lock size={40} className="text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-300 font-bold">Dostępne po rezerwacji miejsca</p>
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => navigate('/checkout/stage/0')}
                            className="mt-4 bg-transparent hover:bg-gold-500/10 border border-gold-500 text-gold-500 font-bold px-5 py-2 rounded-full text-sm transition-colors shadow-sm"
                          >
                            Zarezerwuj miejsce w projekcie - 2 000 PLN
                          </button>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(245, 240, 232, 0.60)', marginTop: '8px', textAlign: 'center', display: 'block' }}>
                              Rezerwacja w 100% zwrotna. Rezygnujesz kiedy chcesz.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 opacity-30 pointer-events-none select-none">
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                        <Crown size={32} className="text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">🏆 Private Club</h3>
                        <p className="text-gray-400 text-sm">Ekskluzywne oferty i zniżki dla członków</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* ──────────────────────────────────────
                  Payment Section (for approved KYC)
              ────────────────────────────────────── */}
              {isApproved && (
                <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg">
                  {!payment && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl text-center">
                      <h4 className="text-lg font-bold text-blue-400 mb-2">🔔 Płatność w przygotowaniu</h4>
                      <p className="text-gray-300 text-sm">
                        Oczekujemy na wygenerowanie szczegółów płatności przez administratora.
                        Otrzymasz email z instrukcjami.
                      </p>
                    </div>
                  )}

                  {payment && payment.status === "awaiting" && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">💳 Instrukcje Płatności</h3>
                      <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-xl mb-6">
                        <span className="text-yellow-400 font-bold">Oczekuje na płatność</span>
                        <span className="text-gray-400 text-sm">Termin: {new Date(payment.expiresAt).toLocaleDateString("pl-PL")}</span>
                      </div>
                      <div className="space-y-3 mb-6">
                        {[
                          { label: "Kwota", value: payment.bankDetails?.amount || "27 000,00 PLN", copy: "27000" },
                          { label: "Numer konta", value: payment.bankDetails?.accountNumber, copy: payment.bankDetails?.accountNumber },
                          { label: "Odbiorca", value: payment.bankDetails?.recipientName },
                        ].map(({ label, value, copy }) => (
                          <div key={label} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                            <label className="text-gray-400 text-sm">{label}:</label>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-mono">{value}</span>
                              {copy && <button onClick={() => copyToClipboard(copy)} className="text-gray-500 hover:text-white">📋</button>}
                            </div>
                          </div>
                        ))}
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-red-400 font-bold text-sm">⚠️ Tytuł przelewu (KONIECZNIE!):</label>
                            <div className="flex items-center gap-2">
                              <code className="text-red-400 font-mono font-bold">{payment.orderId}</code>
                              <button onClick={() => copyToClipboard(payment.orderId)} className="text-red-400 hover:text-white">📋</button>
                            </div>
                          </div>
                          <p className="text-red-400/70 text-xs">Dokładnie skopiuj ten tytuł przelewu!</p>
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-6">
                        <p className="text-gray-400 text-sm mb-4">Po wykonaniu przelewu prześlij potwierdzenie (screenshot lub PDF):</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input type="file" id="proof-file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFileSelect} className="hidden" />
                          <label htmlFor="proof-file" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-5 rounded-xl cursor-pointer transition-colors text-center text-sm truncate">
                            {proofFile ? `📎 ${proofFile.name}` : "📁 Wybierz plik"}
                          </label>
                          {proofFile && (
                            <button onClick={uploadProof} disabled={uploading}
                              className="bg-neon-cyan hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 text-sm">
                              {uploading ? "Wysyłanie..." : "Wyślij potwierdzenie"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {payment?.status === "verification" && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl text-center">
                      <h4 className="text-lg font-bold text-blue-400 mb-2">⏳ Weryfikacja płatności</h4>
                      <p className="text-gray-300 text-sm">Otrzymaliśmy Twoje potwierdzenie. Sprawdzamy przelew (24-48h).</p>
                    </div>
                  )}

                  {payment?.status === "confirmed" && (
                    <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-xl text-center">
                      <h4 className="text-lg font-bold text-green-400 mb-2">✅ Płatność potwierdzona!</h4>
                      <p className="text-gray-300 text-sm">Twój NFT Membership jest tworzony. Otrzymasz email po zakończeniu.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────────────────────────────
                  6. Grid NFT Paszportów
              ────────────────────────────────────── */}
              {displayNfts.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <ImageIcon size={20} className="text-neon-cyan" /> Twoje Paszporty
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayNfts.map((nft) => {
                      const name = nft.memberName || nft.nick;
                      return (
                        <motion.div
                          key={nft.tokenId}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -5 }}
                          className="bg-[#0d1117] border border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-neon-cyan/50 transition-all shadow-lg hover:shadow-neon-cyan/10"
                          onClick={() => setSelectedNft(nft)}
                        >
                          <div className="aspect-square relative overflow-hidden">
                            <img src={`${IPFS_BASE}${nft.photoId}.webp`} alt={`Beaver`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                              <span className="text-neon-cyan font-mono font-bold text-sm">#{nft.tokenId?.toString()}</span>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-lg font-bold text-white truncate">
                                {name || (
                                  <button onClick={(e) => { e.stopPropagation(); setShowNameModal(true); }}
                                    className="text-gray-400 hover:text-neon-cyan text-sm flex items-center gap-1 transition-colors">
                                    <Edit3 size={13} /> Nazwij bobra
                                  </button>
                                )}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Foto #{nft.photoId?.toString()}</p>
                            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-colors">
                              Szczegóły
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!loading && displayNfts.length === 0 && (
                <div className="text-center py-16 bg-[#0d1117] rounded-3xl border border-white/5">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon size={40} className="text-gray-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{t("mynfts_no_nft_title")}</h2>
                  <p className="text-gray-400 mb-6">{t("mynfts_no_nft_desc")}</p>
                </div>
              )}
            </div>
          )}

        </>
      ) : null}

      {/* ──────────────────────────────────────
          NFT Details Modal
      ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedNft && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedNft(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d1117] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
              <button onClick={() => setSelectedNft(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md border border-white/10">
                <X size={20} />
              </button>
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-black">
                <img src={`${IPFS_BASE}${selectedNft.photoId}.webp`} alt="Beaver" className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-1/2 p-8 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6">Passport Details</h2>
                <div className="space-y-5 flex-1">
                  {[
                    { icon: <Hash size={18} className="text-neon-cyan" />, bg: "bg-neon-cyan/10", label: t("mynfts_serial"), value: `#${selectedNft.tokenId?.toString()}` },
                    { icon: <ImageIcon size={18} className="text-neon-purple" />, bg: "bg-neon-purple/10", label: t("mynfts_photo_id"), value: selectedNft.photoId?.toString() },
                    { icon: <User size={18} className="text-blue-400" />, bg: "bg-blue-500/10", label: t("mynfts_member_name"), value: selectedNft.memberName || selectedNft.nick || "-" },
                    { icon: <Calendar size={18} className="text-green-400" />, bg: "bg-green-500/10", label: t("mynfts_mint_date"), value: formatDate(selectedNft.mintTimestamp) },
                  ].map(({ icon, bg, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
                      <div><p className="text-xs text-gray-400">{label}</p><p className="text-lg font-bold text-white">{value}</p></div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/5">
                    <span className="text-gray-400 text-sm">Status</span>
                    <KycBadge status={kycStatus} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────
          Name Beaver Modal
      ────────────────────────────────────── */}
      <AnimatePresence>
        {showNameModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowNameModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0d1117] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <button onClick={() => setShowNameModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
              <h3 className="text-xl font-black text-white mb-2">🪪 Ustaw nazwę paszportu</h3>
              <p className="text-gray-400 text-sm mb-6">Podaj unikalną nazwę dla swojego Pashportu</p>
              <input
                type="text"
                value={beaverName}
                onChange={e => setBeaverName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSaveName()}
                placeholder="np. Golden Pass, First Member..."
                maxLength={30}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowNameModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-colors">
                  Anuluj
                </button>
                <button onClick={handleSaveName} disabled={savingName}
                  className="flex-1 bg-neon-cyan hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                  {savingName ? "Zapisywanie..." : "Zapisz nazwę"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d1117] border border-neon-cyan/30 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-neon-cyan/10 relative overflow-hidden">
              <div className="absolute -inset-px bg-gradient-to-br from-neon-cyan/10 to-transparent rounded-3xl pointer-events-none" />
              <div className="relative">
                <div className="w-14 h-14 bg-neon-cyan/10 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                  <span className="text-3xl">✉️</span>
                </div>
                <h3 className="text-2xl font-black text-white text-center mb-2">Podaj adres email</h3>
                <p className="text-gray-400 text-sm text-center mb-6">
                  Aby być na bieżąco z nowościami i kolejnymi etapami budowy pierwszego web3 resortu w Europie.
                </p>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveEmail()}
                  placeholder="twoj@email.com"
                  autoFocus
                  className="w-full bg-white/5 border border-white/15 focus:border-neon-cyan rounded-xl px-4 py-3 text-white focus:outline-none transition-colors mb-5 text-center text-lg"
                />
                <button onClick={handleSaveEmail} disabled={savingEmail}
                  className="w-full bg-gradient-to-r from-neon-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black py-4 rounded-2xl transition-all hover:scale-105 disabled:opacity-50 text-lg shadow-lg shadow-neon-cyan/20">
                  {savingEmail ? "Zapisywanie..." : "Zapisz email →"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
