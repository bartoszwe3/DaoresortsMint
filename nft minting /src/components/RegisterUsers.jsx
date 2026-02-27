// src/components/RegisterUsers.jsx
import React, { useState } from "react";
import { UserPlus, Wallet, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useTranslation, Trans } from "react-i18next";

export default function RegisterUsers({ onRegisterSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const currentUserAddress = user?.address || user?.publicAddress;

  const [email, setEmail] = useState("");
  const [walletInput, setWalletInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fill wallet input when connected
  React.useEffect(() => {
    if (isAuthenticated && currentUserAddress) {
      setWalletInput(currentUserAddress);
    }
  }, [isAuthenticated, currentUserAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !walletInput) {
      toast.error(t("toast_fill_fields"));
      return;
    }

    if (!agreed) {
      toast.error(t("toast_accept_privacy"));
      return;
    }

    if (!walletInput.startsWith("0x") || walletInput.length !== 42) {
      toast.error(t("toast_invalid_wallet"));
      return;
    }

    setLoading(true);

    try {
      const API_BASE = process.env.REACT_APP_API_BASE;
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          wallet: walletInput,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t("toast_registered"));
        setEmail("");
        setWalletInput("");
        setAgreed(false);
        if (onRegisterSuccess) onRegisterSuccess();
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4">
      <h1 className="text-3xl font-bold font-sans text-white">
        <Trans i18nKey="register_title" components={[<span className="text-neon-cyan" />]} />
      </h1>
      <p className="text-gray-400 mt-2 text-center text-sm">{t("register_subtitle")}</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-md bg-[#0d1117] border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-purple-500 to-neon-cyan animate-pulse" />

        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder={t("register_email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <input
            type="text"
            placeholder={t("register_wallet_placeholder")}
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors pr-10"
          />
          <Wallet className="absolute right-3 top-3.5 text-gray-500" size={18} />

          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => toast.error("Please sign in via the menu")}
              className="text-[10px] text-neon-cyan text-right mt-1 hover:underline"
            >
              {t("register_connect_hint")}
            </button>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? "bg-neon-cyan border-neon-cyan text-black" : "border-white/20 bg-transparent group-hover:border-white/40"}`}>
            {agreed && <UserPlus size={14} />}
          </div>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="hidden"
          />
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            <Trans i18nKey="register_privacy" components={[<span className="text-neon-cyan underline decoration-dotted" />]} />
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="relative z-10 font-bold text-black flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            {t("register_btn")}
          </div>
        </button>
      </form>
    </div>
  );
}
