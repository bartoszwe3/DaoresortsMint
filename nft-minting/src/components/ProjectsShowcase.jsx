// src/components/ProjectsShowcase.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Layout, Sparkles, Building2, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

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
        name: "Silna.club - Silna, Lubuskie.",
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
            { label: "Powierzchnia Działki", value: "2533 m²" },
            { label: "Liczba Domków", value: "6 x 70m²" },
            { label: "Standard", value: "Premium (5★)" },
            { label: "Energia", value: "PV + Pompy Ciepła" }
        ],
        nft_logic: [
            { title: "Jeden standard - Member NFT", quantity: 150, perks: "Dożywotnie pobyty po kosztach, prawo głosu" }
        ]
    };

    const TAB_LABELS = {
        overview: t("tab_overview"),
        features: t("tab_features")
    };

    return (
        <div className="w-full text-white font-sans">
            {/* HERO SECTION OF PROJECT */}
            <div className="relative w-full h-[60vh] rounded-none overflow-hidden mb-12 border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <video
                    ref={videoRef}
                    src="/silnawebvideo.mp4"
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
                            <span className="px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-500 text-xs font-bold uppercase tracking-widest border border-gold-500/20 backdrop-blur-md">
                                {PROJECT_DATA.status}
                            </span>
                            <div className="flex items-center gap-2 text-gray-300 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                <MapPin size={14} className="text-gold-500" />
                                <span className="text-xs font-bold uppercase tracking-wide">{PROJECT_DATA.location}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black leading-tight font-sans">
                            <motion.span
                                className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-clip-text text-transparent bg-[length:200%_auto] inline-block"
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            >
                                {PROJECT_DATA.name}
                            </motion.span>
                        </h1>
                    </motion.div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 pb-24">
                {/* STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[
                        { label: t("project_tile_1_label"), value: t("project_tile_1_value"), icon: Building2 }, // 150 Members
                        { label: t("project_tile_2_label"), value: t("project_tile_2_value"), icon: Layout }, // 6 Premium Houses
                        { label: t("project_tile_3_label"), value: t("project_tile_3_value"), icon: Flame }, // Grill
                        { label: t("project_tile_4_label"), value: t("project_tile_4_value"), icon: Sparkles } // 2 Weeks Lifetime
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#161C10] border border-[#2D5A3D]/30 p-6 flex flex-col items-center justify-center text-center hover:bg-[#1C2614] transition-all group shadow-lg">
                            <stat.icon size={24} className="text-[#8A9E8A] mb-2 group-hover:text-[#C9A84C] transition-colors" />
                            <div className="text-xl md:text-2xl font-bold text-[#F5F0E8] font-sans break-words w-full">{stat.value}</div>
                            <div className="text-[10px] text-[#8A9E8A] uppercase tracking-widest mt-1 font-semibold">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* CTA BUTTON */}
                <div className="flex justify-center mb-20">
                    <a href="/checkout/stage/0" className="px-12 py-5 bg-[#C9A84C] text-[#0E1208] font-sans font-bold uppercase tracking-widest transition-all hover:bg-[#D4B96A] shadow-2xl hover:shadow-[#C9A84C]/30 scale-100 hover:scale-[1.02]">
                        zarezerwuj członkostwo - 2000 PLN
                    </a>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex justify-center mb-16">
                    <div className="flex bg-[#161C10] p-2 rounded-none border border-[#2D5A3D]/30 backdrop-blur-md shadow-xl">
                        {Object.keys(TAB_LABELS).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 rounded-none text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 relative ${activeTab === tab ? "text-[#0E1208]" : "text-[#8A9E8A] hover:text-[#F5F0E8]"
                                    }`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#C9A84C] shadow-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{TAB_LABELS[tab]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* TAB CONTENT */}
                < AnimatePresence mode="wait" >
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
                                <div className="flex flex-col justify-start">
                                    <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-white mb-8 leading-[1.4] tracking-tight">
                                        {PROJECT_DATA.description}
                                    </h2>
                                    <p className="text-[#8A9E8A] text-lg leading-relaxed mb-10 font-light">
                                        Łączymy bogatą historię z nowoczesnym luksusem. Odkryj miejsce, gdzie tradycja spotyka się z komfortem w najbardziej autentycznym, naturalnym wydaniu.
                                    </p>
                                    <a href="/prezentacja" className="group px-8 py-4 bg-[#C9A84C] text-[#0E1208] font-sans font-bold uppercase tracking-widest transition-all hover:bg-[#D4B96A] shadow-xl hover:shadow-[#C9A84C]/20 flex items-center justify-center gap-3 w-fit">
                                        {t("project_presentation_btn")} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                                <div className="lg:pl-10">
                                    <h3 className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] font-bold mb-8">{t("project_features_title")}</h3>
                                    <ul className="space-y-5">
                                        {PROJECT_DATA.features.map((feature, i) => (
                                            <li key={i} className="group flex gap-5 p-6 bg-[#161C10] border border-[#2D5A3D]/30 hover:border-[#C9A84C]/40 transition-all duration-300 shadow-lg">
                                                <div className="w-1 bg-[#C9A84C] h-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-[#8A9E8A] leading-relaxed font-light">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}


                        {activeTab === "features" && (
                            <div className="grid md:grid-cols-2 gap-16">
                                <div>
                                    <h3 className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] font-bold mb-8">{t("project_specs_title")}</h3>
                                    <div className="space-y-4">
                                        {PROJECT_DATA.technical_specs.map((spec, i) => (
                                            <div key={i} className="flex justify-between items-center p-6 bg-[#161C10] border border-[#2D5A3D]/30 shadow-lg">
                                                <span className="text-[#8A9E8A] font-light">{spec.label}</span>
                                                <span className="font-semibold text-[#F5F0E8] font-sans">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] font-bold mb-8">{t("project_logic_title")}</h3>
                                    <div className="space-y-4">
                                        {PROJECT_DATA.nft_logic.map((tier, i) => (
                                            <div key={i} className="p-8 bg-gradient-to-br from-[#161C10] to-[#0E1208] border border-[#2D5A3D]/30 shadow-xl">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-playfair font-semibold text-xl text-[#F5F0E8]">{tier.title}</h4>
                                                    <span className="text-[10px] font-bold tracking-widest text-[#C9A84C] px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/20 uppercase">{tier.quantity}0 szt.</span>
                                                </div>
                                                <p className="text-[#8A9E8A] leading-relaxed font-light text-sm">{tier.perks}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence >
            </div>
        </div >
    );
}
