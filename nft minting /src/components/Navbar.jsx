// src/components/Header.jsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppKit } from "@reown/appkit/react";
import { useTranslation } from "react-i18next";
import LoginModal from "./LoginModal";
import toast from "react-hot-toast";

const shortenAddress = (addr) =>
  addr ? `${addr.slice(0, 5)}....${addr.slice(-4)}` : "";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { open } = useAppKit();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleAuthAction = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      // If native wallet is used, open Account modal
      if (user.type === "wallet") {
        open({ view: "Account" });
      } else {
        // If Magic.link is used, just logout for simplicity or custom UI
        logout();
        toast.success("Logged out from Email session");
      }
    }
  };

  const getDisplayAddress = () => {
    if (!user) return t("connect_wallet");
    if (user.type === "wallet") return shortenAddress(user.address);
    if (user.type === "magic") return user.email.split('@')[0] || shortenAddress(user.publicAddress);
  };

  const setLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  // The new simple menu
  const NAV = [
    { label: "nav_mint", route: "/mint" },
    { label: "nav_voting", route: "/voting" },
  ];

  const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
  const currentUserAddress = user?.address || user?.publicAddress;

  // Show Moje Konto only for authenticated users
  if (isAuthenticated) {
    NAV.push({ label: "nav_my_nfts", route: "/my-collection" });
  }

  // Show Admin link only for owner
  if (isAuthenticated && currentUserAddress && OWNER_ADDRESS &&
    currentUserAddress.toLowerCase() === OWNER_ADDRESS.toLowerCase()) {
    NAV.push({ label: "nav_admin", route: "/admin" });
  }

  const goTo = (route) => {
    setMobileOpen(false);
    navigate(route);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <div
            onClick={() => goTo("/")}
            className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition"
          >
            BEAVER DAO
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => goTo(item.route)}
                className="text-sm font-medium text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(6,244,195,0.5)] transition-all"
              >
                {t(item.label)}
              </button>
            ))}

            {/* Language Switchers (Icons) */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang("en")}
                className={`text-2xl transition-transform hover:scale-110 ${i18n.language === "en" ? "opacity-100 scale-110" : "opacity-40 grayscale"
                  }`}
                title="English"
              >
                🇬🇧
              </button>
              <button
                onClick={() => setLang("pl")}
                className={`text-2xl transition-transform hover:scale-110 ${i18n.language === "pl" ? "opacity-100 scale-110" : "opacity-40 grayscale"
                  }`}
                title="Polski"
              >
                🇵🇱
              </button>
            </div>

            <button
              onClick={handleAuthAction}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            >
              {getDisplayAddress()}
            </button>
          </div>

          {/* MOBILE MENU BTN */}
          <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center gap-3 mr-2">
              <button
                onClick={() => setLang("en")}
                className={`text-xl transition-transform ${i18n.language === "en" ? "opacity-100 scale-110" : "opacity-40 grayscale"
                  }`}
              >
                🇬🇧
              </button>
              <button
                onClick={() => setLang("pl")}
                className={`text-xl transition-transform ${i18n.language === "pl" ? "opacity-100 scale-110" : "opacity-40 grayscale"
                  }`}
              >
                🇵🇱
              </button>
            </div>

            <button
              className="text-white p-2"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* MOBILE NAV OVERLAY */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-200">
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <X size={32} />
            </button>

            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => goTo(item.route)}
                className="text-2xl font-bold text-gray-300 hover:text-neon-cyan transition-colors"
              >
                {t(item.label)}
              </button>
            ))}

            <div className="w-16 h-[1px] bg-white/10 my-4" />

            {/* Also show langs in overlay explicitly if needed, but they are visible in header behind overlay usually, 
                though z-index might cover them. Let's add them here too for easy access in menu mode. */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setLang("en")}
                className={`text-4xl transition-transform ${i18n.language === "en" ? "opacity-100 scale-110" : "opacity-30 grayscale"
                  }`}
              >
                🇬🇧
              </button>
              <button
                onClick={() => setLang("pl")}
                className={`text-4xl transition-transform ${i18n.language === "pl" ? "opacity-100 scale-110" : "opacity-30 grayscale"
                  }`}
              >
                🇵🇱
              </button>
            </div>

            <button
              onClick={() => {
                handleAuthAction();
                setMobileOpen(false);
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold text-lg shadow-lg shadow-neon-cyan/20"
            >
              {getDisplayAddress()}
            </button>
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
