// src/components/ProjectsShowcase.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Layout, Image as ImageIcon, Sparkles, Building2, Trees, Utensils, Zap, Wifi, waves } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

export default function ProjectsShowcase() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("overview");
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let rewindInterval;

        const handleEnded = () => {
            // Manual rewind since playbackRate = -1 is not supported everywhere
            if (rewindInterval) clearInterval(rewindInterval);

            rewindInterval = setInterval(() => {
                if (video.currentTime > 0.1) {
                    video.currentTime -= 0.05; // Adjust rewind speed (approx 2x speed)
                } else {
                    clearInterval(rewindInterval);
                    video.play();
                }
            }, 30); // ~33fps
        };

        // Ensure video plays immediately
        video.play().catch(e => console.log("Autoplay prevented:", e));

        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("ended", handleEnded);
            if (rewindInterval) clearInterval(rewindInterval);
        };
    }, []);

    const PROJECT_DATA = {
        id: "resort-silna",
        name: "Resort Silna",
        location: t("project_silna_location"),
        status: t("project_silna_status"),
        description: t("project_silna_desc"),
        features: [
            t("project_feature_1"),
            t("project_feature_2"),
            t("project_feature_3"),
            t("project_feature_4")
        ],
        technical_specs: [
            { label: "Powierzchnia Działki", value: "3200 m²" },
            { label: "Liczba Domków", value: "6 x 70m²" },
            { label: "Standard", value: "Premium (5★)" },
            { label: "Energia", value: "PV + Pompy Ciepła" }
        ],
        nft_logic: [
            { title: "Jeden standard — Member NFT", quantity: 150, perks: "Dożywotnie pobyty po kosztach, prawo głosu" }
        ]
    };

    const TAB_LABELS = {
        overview: t("tab_overview"),
        gallery: t("tab_gallery"),
        features: t("tab_features")
    };

    return (
        <div className="w-full text-white font-sans">
            {/* HERO SECTION OF PROJECT */}
            <div className="relative w-full h-[60vh] rounded-[3rem] overflow-hidden mb-12 border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <video
                    ref={videoRef}
                    src="/silna.mp4"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    autoPlay
                    muted
                    playsInline
                // Loop handled manually
                />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className="px-4 py-1.5 rounded-full bg-neon-cyan/20 text-neon-cyan text-xs font-bold uppercase tracking-widest border border-neon-cyan/20 backdrop-blur-md">
                                {PROJECT_DATA.status}
                            </span>
                            <div className="flex items-center gap-2 text-gray-300 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                <MapPin size={14} className="text-neon-purple" />
                                <span className="text-xs font-bold uppercase tracking-wide">{PROJECT_DATA.location}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black leading-tight font-sans">
                            <motion.span
                                className="bg-gradient-to-r from-[#89CFF0] via-[#A020F0] to-[#89CFF0] bg-clip-text text-transparent bg-[length:200%_auto] inline-block"
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            >
                                {PROJECT_DATA.name}
                            </motion.span>
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                    { label: t("project_tile_1_label"), value: t("project_tile_1_value"), icon: Building2 }, // 150 Members
                    { label: t("project_tile_2_label"), value: t("project_tile_2_value"), icon: Layout }, // 6 Premium Houses
                    { label: t("project_tile_3_label"), value: t("project_tile_3_value"), icon: Utensils }, // Club House
                    { label: t("project_tile_4_label"), value: t("project_tile_4_value"), icon: Sparkles } // 2 Weeks Lifetime
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0d1117] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group">
                        <stat.icon size={24} className="text-gray-500 mb-2 group-hover:text-neon-cyan transition-colors" />
                        <div className="text-xl md:text-2xl font-bold text-white font-mono break-words w-full">{stat.value}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* TABS NAVIGATION */}
            <div className="flex justify-center mb-12">
                <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    {Object.keys(TAB_LABELS).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${activeTab === tab ? "text-black" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-neon-cyan rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{TAB_LABELS[tab]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="min-h-[400px]"
                >
                    {activeTab === "overview" && (
                        <div className="grid md:grid-cols-2 gap-16">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6 leading-snug">
                                    {PROJECT_DATA.description}
                                </h2>
                                <p className="text-gray-400 leading-relaxed mb-8">
                                    Luksus to nie tylko złote klamki. To wolność, natura i brak trosk o eksploatację.
                                    Nasz model zakłada pełną automatyzację zarządzania obiektem.
                                </p>
                                <button className="px-8 py-4 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                    {t("project_presentation_btn")} <ArrowRight size={18} />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold mb-6 text-neon-cyan">{t("project_features_title")}</h3>
                                <ul className="space-y-4">
                                    {PROJECT_DATA.features.map((feature, i) => (
                                        <li key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-neon-purple/30 transition-colors">
                                            <div className="w-1.5 bg-gradient-to-b from-neon-cyan to-neon-purple rounded-full shrink-0" />
                                            <span className="text-gray-300 leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === "gallery" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Temporary Placeholders using unsplash as specific renders might not exist in public folder context yet or hard to verify */}
                            <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=2600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Interior" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Exterior" />
                            </div>
                            <div className="col-span-1 md:col-span-2 aspect-[21/9] bg-gray-800 rounded-2xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Landscape" />
                            </div>
                        </div>
                    )}

                    {activeTab === "features" && (
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-6 text-neon-cyan">{t("project_specs_title")}</h3>
                                <div className="space-y-4">
                                    {PROJECT_DATA.technical_specs.map((spec, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-[#0d1117] border border-white/10 rounded-xl">
                                            <span className="text-gray-400">{spec.label}</span>
                                            <span className="font-bold text-white">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-6 text-neon-cyan">{t("project_logic_title")}</h3>
                                <div className="space-y-4">
                                    {PROJECT_DATA.nft_logic.map((tier, i) => (
                                        <div key={i} className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-lg text-white">{tier.title}</h4>
                                                <span className="text-xs font-mono text-neon-cyan px-2 py-1 bg-neon-cyan/10 rounded">{tier.quantity} szt.</span>
                                            </div>
                                            <p className="text-sm text-gray-400">{tier.perks}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
