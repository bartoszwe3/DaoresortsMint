import React, { useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAuth } from "../../context/AuthContext";

export default function StepWalletConnect({ goNext, userEmail, setUserEmail, sendOTP, loading, error, setError }) {
    const { open } = useAppKit();
    const { isAuthenticated, user } = useAuth();

    const handleConnectWallet = () => {
        open();
    };

    // Skip this step if already authenticated with wallet
    useEffect(() => {
        if (isAuthenticated && user?.type === "wallet") {
            goNext();
        }
    }, [isAuthenticated, user, goNext]);

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in-right">
            <div className="text-center md:text-left mb-2">
                <h1 className="font-playfair text-3xl font-bold text-[#F5F0E8] mb-2">
                    Połącz portfel
                </h1>
                <p className="font-sans text-sm text-[#8A9E8A]">
                    Wybierz opcję połączenia przez aplikację AppKit.
                </p>
            </div>

            <button
                onClick={handleConnectWallet}
                className="w-full border border-[#2D5A3D] bg-[#1C2614] flex items-center gap-4 px-5 py-4 rounded-xl hover:border-gold-500 hover:bg-[#2D5A3D]/20 transition-all active:scale-[0.98] group"
            >
                <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    {/* Fallback icon for WalletConnect/AppKit */}
                    <img src="https://registry.walletconnect.com/v2/logo/sm/walletconnect.jpeg" alt="WalletConnect" className="w-full h-full rounded-full" />
                </div>
                <span className="font-semibold text-white text-lg">AppKit Wallet</span>
                <span className="ml-auto text-[#8A9E8A] text-xs font-medium uppercase tracking-wider">Rekomendowany</span>
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
    );
}
