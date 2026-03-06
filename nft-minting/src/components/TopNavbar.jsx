import React, { useState, useEffect } from "react";
import { Menu, X, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useAppKit } from "@reown/appkit/react";
// shortenAddress not needed, using inline shortenAddr.

const shortenAddr = (addr) => (addr ? `${addr.slice(0, 5)}...${addr.slice(-4)}` : "");

export default function TopNavbar({ onNavigate, activeTab, isRegistered, address, isState3Member, isAdmin }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const { isAuthenticated, user, logout } = useAuth();
    const { open } = useAppKit();

    const handleConnect = () => {
        if (!isAuthenticated) open();
        else if (user?.type === "wallet") open({ view: "Account" });
        else logout();
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { id: "home", label: t("nav_home") || "Home" },
        { id: "team", label: t("nav_team") || "Społeczność" },
        { id: "voting", label: t("nav_voting") || "Głosowania" },
        { id: "projects", label: t("nav_projects") || "Nasze Resorty" },
        { id: "faq", label: t("nav_faq") || "FAQ" },
        ...(isAdmin ? [{ id: "admin", label: t("nav_admin") || "Admin" }, { id: "stats", label: t("nav_stats") || "Statystyki" }] : []),
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-100 transition-all duration-300 ${scrolled ? "bg-[rgba(14,18,8,0.85)] backdrop-blur-xl border-b border-border-default/10 shadow-lg" : "bg-transparent"
                    }`}
                style={{ zIndex: 100 }}
            >
                <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
                        <span className="font-playfair font-semibold text-2xl tracking-wide text-text-primary flex items-center">
                            DAOResorts <span className="text-gold-500 ml-[1px]">.</span>club
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => onNavigate(link.id)}
                                className={`text-xs font-sans uppercase font-medium tracking-widest transition-colors relative group focus:outline-none ${activeTab === link.id ? "text-gold-500" : "text-text-secondary hover:text-gold-500"}`}
                            >
                                {link.label}
                                <span className={`absolute -bottom-1 left-0 h-[1px] bg-gold-500 transition-all duration-300 ${activeTab === link.id ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                            </button>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        {/* Language */}
                        <div className="flex items-center gap-2 mr-2">
                            <button onClick={() => i18n.changeLanguage("en")} className={`text-sm opacity-${i18n.language === 'en' ? '100' : '40'}`}>🇬🇧</button>
                            <button onClick={() => i18n.changeLanguage("pl")} className={`text-sm opacity-${i18n.language === 'pl' ? '100' : '40'}`}>🇵🇱</button>
                        </div>

                        {isRegistered ? (
                            <button onClick={() => onNavigate("mynfts")} className="px-6 py-2.5 bg-gold-500 text-forest-900 font-sans text-sm font-bold uppercase tracking-wider rounded-md hover:bg-gold-600 transition-all shadow-btn-primary hover:shadow-btn-primary-hover focus:outline-none focus:ring-2 focus:ring-gold-500/50">
                                {t("nav_mynfts") || "Mój Paszport"}
                            </button>
                        ) : (
                            <button
                                onClick={handleConnect}
                                className="px-6 py-2.5 bg-gold-500 text-forest-900 font-sans text-sm font-bold uppercase tracking-wider rounded-md hover:bg-gold-600 transition-all shadow-btn-primary hover:shadow-btn-primary-hover focus:outline-none focus:ring-2 focus:ring-gold-500/50 flex items-center justify-center min-w-[120px]"
                            >
                                {isAuthenticated ? (
                                    <div className="relative group flex items-center justify-center">
                                        <Wallet size={18} />
                                        <div className="absolute top-8 right-0 bg-forest-900 border border-gold-500/20 text-gold-500 text-xs px-3 py-1.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            {shortenAddr(address)}
                                        </div>
                                    </div>
                                ) : (
                                    t("hero_cta") || "Dołącz do klubu \u2192"
                                )}
                            </button>
                        )}
                    </div>

                    <button className="md:hidden text-text-primary" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={28} />
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 bg-forest-900 z-[110] flex flex-col p-6 border-l border-gold-500/10"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <span className="font-playfair font-semibold text-2xl tracking-wide text-text-primary flex items-center">
                                DAOResorts <span className="text-gold-500 ml-[1px]">.</span>club
                            </span>
                            <button className="text-text-primary" onClick={() => setMobileMenuOpen(false)}>
                                <X size={28} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6 items-start flex-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }}
                                    className="text-xl font-playfair font-medium text-text-primary"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>

                        <div className="flex flex-col gap-4 mt-auto">
                            <div className="flex items-center justify-center gap-6 mb-4">
                                <button onClick={() => i18n.changeLanguage("en")} className={`text-2xl opacity-${i18n.language === 'en' ? '100' : '40'}`}>🇬🇧</button>
                                <button onClick={() => i18n.changeLanguage("pl")} className={`text-2xl opacity-${i18n.language === 'pl' ? '100' : '40'}`}>🇵🇱</button>
                            </div>

                            <button onClick={() => { handleConnect(); setMobileMenuOpen(false); }} className="w-full py-4 bg-gold-500 text-forest-900 font-sans text-sm font-bold uppercase tracking-wider rounded-md text-center">
                                {isAuthenticated ? shortenAddr(address) : (t("hero_cta") || "Dołącz do klubu")}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
