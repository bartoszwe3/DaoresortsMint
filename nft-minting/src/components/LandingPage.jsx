// src/components/LandingPage.jsx
import React, { useState, useRef, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, MapPin, Check, ArrowRight, Zap, BadgeCheck, Vote, Users, FileText, Pickaxe, Key, Home, Calendar, Wrench, Settings, ShieldCheck, Globe } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import LongTermSavings from "./LongTermSavings";

/* ========================================================
   SVG COMPONENTS
======================================================== */

// B) Booking Flow SVG
const BookingFlowSVG = ({ t }) => (
    <svg viewBox="0 0 600 120" className="w-full h-auto">
        <g transform="translate(50, 60)">
            <circle cx="0" cy="0" r="40" fill="#0d1117" stroke="#C9A84C" strokeWidth="2" opacity="0.8" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{t("booking_flow_14days")}</text>
        </g>
        <path d="M100 60 L190 60" stroke="#C9A84C" strokeWidth="1" strokeDasharray="5,5" markerEnd="url(#arrow)" opacity="0.5" />
        <g transform="translate(240, 60)">
            <rect x="-50" y="-30" width="100" height="60" rx="10" fill="#0d1117" stroke="#C9A84C" strokeWidth="2" opacity="0.8" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{t("booking_flow_draw")}</text>
            <text x="0" y="25" textAnchor="middle" fill="#C9A84C" fontSize="10">{t("booking_flow_high_season")}</text>
        </g>
        <path d="M300 60 L390 60" stroke="#C9A84C" strokeWidth="1" strokeDasharray="5,5" markerEnd="url(#arrow)" opacity="0.5" />
        <g transform="translate(450, 60)">
            <circle cx="0" cy="0" r="40" fill="#C9A84C" opacity="0.2" />
            <circle cx="0" cy="0" r="38" fill="none" stroke="#C9A84C" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{t("booking_flow_stay")}</text>
        </g>
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#C9A84C" />
            </marker>
        </defs>
    </svg>
);

const IPFS_BASE = "https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/";
const API_BASE = process.env.REACT_APP_API_BASE ?? "";

function MemberCarousel() {
    const [members, setMembers] = useState([]);

    React.useEffect(() => {
        fetch(`${API_BASE}/api/members/public`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setMembers(data))
            .catch(() => { });
    }, []);

    if (members.length === 0) return null;

    const displayMembers = [...members, ...members, ...members, ...members];

    return (
        <section className="w-full py-14 border-y border-border-default/20 bg-forest-900/40 backdrop-blur-sm overflow-hidden flex flex-col items-center">
            <h3 className="text-text-secondary font-playfair italic mb-8 tracking-wider text-xl">
                Dołącz do {members.length} członków założycieli
            </h3>
            <div className="w-full relative flex whitespace-nowrap overflow-hidden">
                <div className="flex animate-marquee min-w-max gap-8 px-4 items-center">
                    {displayMembers.map((m, i) => (
                        <div key={i} className="flex items-center gap-4 bg-forest-800/80 border border-border-default rounded-full p-2 pr-6 backdrop-blur-md shadow-sm shrink-0 hover:border-gold-500/30 transition-colors">
                            <img src={`${IPFS_BASE}${m.photoId}.webp`} className="w-12 h-12 object-cover rounded-full border border-border-default" alt={m.memberName} />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-text-primary">{m.memberName}</span>
                                <span className="text-xs text-gold-500 font-mono tracking-widest">#{m.tokenId}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none" />
            </div>
        </section>
    );
}

export default function LandingPage({ onConnect, scrollContainer, hasNft, onNavigate }) {
    const { t } = useTranslation();
    const NFT_PRICE = 18900;
    const roadmapRef = useRef(null);
    const contentRef = useRef(null);
    const [scrollRange, setScrollRange] = useState(0);

    const roadmapSteps = [
        {
            date: "2025 Q2",
            title: "South Summit Madrid",
            desc: t("roadmap_step_1_desc"),
            icon: Users,
            image: "/south_summit.webp"
        },
        { date: "2025 Q3", title: "RAK DAO (ZEA)", desc: t("roadmap_step_2_desc"), icon: Shield, image: "/rakdao.webp" },
        { date: "2025 Q3", title: t("roadmap_step_3_title"), desc: t("roadmap_step_3_desc"), icon: MapPin, image: "/kupno.webp", position: "object-[50%_65%]" },
        { date: "2025 Q4", title: t("roadmap_step_4_title"), desc: t("roadmap_step_4_desc"), icon: FileText, image: "/archi.webp" },
        { date: "2026 Q1", title: t("roadmap_step_5_title"), desc: t("roadmap_step_5_desc"), icon: FileText },
        { date: "2026 Q2", title: t("roadmap_step_6_title"), desc: t("roadmap_step_6_desc"), icon: Pickaxe },
        { date: "2026 Q3", title: t("roadmap_step_7_title"), desc: t("roadmap_step_7_desc"), icon: Key }
    ];

    useLayoutEffect(() => {
        if (contentRef.current && roadmapRef.current) {
            const calculateScroll = () => {
                const scrollWidth = contentRef.current.scrollWidth;
                const clientWidth = window.innerWidth;
                setScrollRange(scrollWidth - clientWidth + 100); // +100 padding for safety
            };

            calculateScroll();
            window.addEventListener("resize", calculateScroll);
            return () => window.removeEventListener("resize", calculateScroll);
        }
    }, [t]); // Re-calculate on translation change

    const { scrollYProgress } = useScroll({
        container: scrollContainer,
        target: roadmapRef,
        offset: ["start start", "end end"]
    });
    const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${scrollRange}px`]);

    return (
        <div id="landing-page" className="w-full pb-24 text-white font-sans animate-in fade-in duration-700">

            {/* 1. HERO SECTION */}
            <section id="hero" className="relative flex flex-col items-center justify-center text-center px-4 min-h-screen overflow-hidden pt-[72px]">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        className="w-full h-full object-cover"
                        src="/silnawebvideo.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    {/* Dark gradient overlay as requested */}
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            background: 'linear-gradient(135deg, rgba(14, 18, 8, 0.88) 0%, rgba(14, 18, 8, 0.65) 50%, rgba(14, 18, 8, 0.75) 100%)'
                        }}
                    />
                </div>

                {/* Optional subtle glow for depth, not neon */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none z-10" />

                <div className="z-20 w-full max-w-6xl mx-auto space-y-8 px-4">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">

                        {/* Elegant Tag */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gold-500/40 bg-forest-800/50 backdrop-blur-sm text-xs font-sans font-medium tracking-widest text-gold-500/90 mb-8 shadow-sm"
                            whileHover={{ y: -2 }}
                        >
                            <span>{t("hero_tag")}</span>
                        </motion.div>

                        {/* Quiet Luxury Headline */}
                        <h1 className="text-5xl md:text-7xl font-playfair font-semibold leading-[1.1] text-text-primary mb-8 tracking-tight drop-shadow-lg">
                            {t("hero_title_1")}
                            <br className="hidden md:block" />
                            <span className="text-gold-500 italic font-medium ml-2">{t("hero_title_2")}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10 font-sans font-light">
                            <Trans i18nKey="hero_desc" components={[<span className="text-text-primary font-medium" />, <span className="text-text-primary font-medium" />]} />
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => {
                                    if (hasNft && onNavigate) {
                                        onNavigate("projects");
                                    } else if (onNavigate) {
                                        onNavigate("mint");
                                    } else {
                                        onConnect();
                                    }
                                }}
                                className="px-10 py-4 bg-gold-500 hover:bg-gold-600 text-forest-900 font-sans font-bold uppercase tracking-wider rounded-sm transition-all shadow-btn-primary hover:shadow-btn-primary-hover flex items-center justify-center gap-3 text-sm min-w-[240px]"
                            >
                                {hasNft ? "Zobacz nasz projekt" : t("hero_cta")} <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* MEMBER CAROUSEL */}
            <MemberCarousel />


            {/* 2. PARAMETERS & CLUB MODEL */}
            <section id="model" className="py-24 px-4 mx-4 mb-10 relative">
                <div className="bg-forest-800/30 rounded-2xl border border-border-default shadow-card p-10 md:p-16 max-w-7xl mx-auto backdrop-blur-md">

                    {/* Key Stats - Social Proof Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-b border-border-subtle pb-16">
                        {[{ l: t("stats_houses_label"), v: "6" }, { l: t("stats_passports_label"), v: "150" }, { l: t("stats_members_label"), v: "25" }, { l: t("stats_days_label"), v: "14" }].map((s, i) => (
                            <div key={i} className="flex flex-col items-center justify-center text-center">
                                <div className="text-5xl md:text-6xl font-playfair font-semibold text-text-primary mb-3 drop-shadow-sm">{s.v}</div>
                                <div className="text-xs md:text-sm text-text-secondary uppercase tracking-[0.2em] font-medium font-sans">{s.l}</div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-playfair font-semibold text-text-primary mb-6 tracking-tight">{t("model_title")}</h2>
                        <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed">
                            {t("model_desc")}
                        </p>
                    </div>

                    {/* Process Steps */}
                    <div className="grid md:grid-cols-3 gap-8 md:gap-10">
                        {[
                            { step: "01", title: t("step_1_title"), desc: t("step_1_desc") },
                            { step: "02", title: t("step_2_title"), desc: t("step_2_desc") },
                            { step: "03", title: t("step_3_title"), desc: t("step_3_desc") }
                        ].map((item, i) => (
                            <div key={i} className="bg-forest-900 border border-border-default/50 p-10 rounded-xl relative overflow-hidden group hover:border-gold-500/30 transition-all flex flex-col justify-start shadow-sm">
                                <div className="text-7xl font-sans font-light text-text-muted/10 absolute -top-4 -right-2 transition-transform group-hover:scale-105 select-none">{item.step}</div>
                                <h3 className="text-2xl font-playfair font-medium mb-4 text-text-primary relative z-10">{item.title}</h3>
                                <p className="text-text-secondary font-light leading-relaxed relative z-10">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RESORT SILNA */}
            <section className="py-4 px-4 mb-20 max-w-7xl mx-auto">
                <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden border border-border-subtle group shadow-card-hover">
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/40 to-transparent z-10" />

                    {/* Video */}
                    <video
                        className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                        src="/silnawebvideo.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                    {/* Content pinned to bottom-left */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-500/20 text-text-primary text-xs font-sans font-bold uppercase tracking-widest border border-forest-500/30 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                                {t("resort_status_active") || "Aktywny"}
                            </span>
                            <div className="flex items-center gap-2 text-text-secondary bg-forest-900/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-border-subtle">
                                <span className="text-xs">📍</span>
                                <span className="text-xs font-sans font-semibold uppercase tracking-wide">Silna, Polska</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl md:text-6xl font-playfair font-semibold leading-tight text-white mb-2 drop-shadow-md">
                            DAOResorts — Silna, Lubuskie.
                        </h2>
                    </div>
                </div>
            </section>


            <section id="membership" className="py-24 px-4 max-w-6xl mx-auto mb-20">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-playfair font-semibold mb-8 text-text-primary tracking-tight">{t("membership_title")}</h2>
                        <ul className="space-y-6 text-text-secondary">
                            <li className="flex gap-4 items-start p-6 bg-forest-800/30 rounded-xl border border-border-subtle shadow-sm">
                                <Users className="text-gold-500 shrink-0 mt-1" size={24} />
                                <div>
                                    <strong className="block text-text-primary font-sans font-medium text-lg mb-1">{t("benefit_1_strong")}</strong>
                                    <span className="font-light">{t("benefit_1_text")}</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start p-6 bg-forest-800/30 rounded-xl border border-border-subtle shadow-sm">
                                <Home className="text-gold-500 shrink-0 mt-1" size={24} />
                                <div>
                                    <strong className="block text-text-primary font-sans font-medium text-lg mb-1">{t("benefit_2_strong")}</strong>
                                    <span className="font-light">{t("benefit_2_text")}</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start p-6 bg-forest-800/30 rounded-xl border border-border-subtle shadow-sm">
                                <ArrowRight className="text-gold-500 shrink-0 mt-1" size={24} />
                                <div>
                                    <strong className="block text-text-primary font-sans font-medium text-lg mb-1">{t("benefit_3_strong")}</strong>
                                    <span className="font-light">{t("benefit_3_text")}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#0a0f1c] p-8 rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 text-white text-center">{t("booking_logic_title")}</h3>
                        <BookingFlowSVG t={t} />
                        <div className="mt-8 space-y-4">
                            <div className="pl-4 border-l-2 border-gold-500">
                                <strong className="text-white block mb-1">{t("booking_high_season")}</strong>
                                <p className="text-white/60 text-sm">{t("booking_high_season_desc")}</p>
                            </div>
                            <div className="pl-4 border-l-2 border-white/20">
                                <strong className="text-white block mb-1">{t("booking_off_season")}</strong>
                                <p className="text-white/60 text-sm">{t("booking_off_season_desc")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* 4. DAO GOVERNANCE & MVP SPEC */}
            <section id="governance" className="py-24 px-4 bg-forest-800/30 mb-20 border-y border-border-subtle relative film-grain">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
                    {/* Governance */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-500/10 text-gold-500 text-xs font-sans font-semibold uppercase tracking-widest mb-6 border border-gold-500/20">
                            <Vote size={14} /> {t("gov_tag")}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-text-primary mb-6 tracking-tight">{t("gov_title")}</h2>
                        <p className="text-lg text-text-secondary mb-10 font-light leading-relaxed">
                            {t("gov_desc")}
                        </p>
                        <ul className="space-y-4">
                            {[t("gov_item_1"), t("gov_item_2"), t("gov_item_3")].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-text-primary bg-forest-900/50 p-4 rounded-lg border border-border-subtle">
                                    <Check size={18} className="text-gold-500 shrink-0" /> <span className="font-light">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* MVP Spec */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-500/10 text-gold-500 text-xs font-sans font-semibold uppercase tracking-widest mb-6 border border-gold-500/20">
                            <BadgeCheck size={14} /> {t("mvp_title_tag")}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-text-primary mb-6 tracking-tight">{t("mvp_title")}</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-forest-900 p-6 rounded-xl border border-border-subtle text-center shadow-sm">
                                <Home className="mx-auto text-gold-500 mb-3" size={28} />
                                <div className="font-playfair font-medium text-lg text-text-primary mb-1">{t("mvp_item_1_val")}</div>
                                <div className="text-xs text-text-muted font-light uppercase tracking-wide">{t("mvp_item_1_desc")}</div>
                            </div>
                            <div className="bg-forest-900 p-6 rounded-xl border border-border-subtle text-center shadow-sm">
                                <Users className="mx-auto text-gold-500 mb-3" size={28} />
                                <div className="font-playfair font-medium text-lg text-text-primary mb-1">{t("mvp_item_2_val")}</div>
                                <div className="text-xs text-text-muted font-light uppercase tracking-wide">{t("mvp_item_2_desc")}</div>
                            </div>
                            <div className="bg-forest-900 p-6 rounded-xl border border-border-subtle text-center shadow-sm">
                                <Zap className="mx-auto text-gold-500 mb-3" size={28} />
                                <div className="font-playfair font-medium text-lg text-text-primary mb-1">{t("mvp_item_3_val")}</div>
                                <div className="text-xs text-text-muted font-light uppercase tracking-wide">{t("mvp_item_3_desc")}</div>
                            </div>
                            <div className="bg-forest-900 p-6 rounded-xl border border-border-subtle text-center shadow-sm">
                                <BadgeCheck className="mx-auto text-gold-500 mb-3" size={28} />
                                <div className="font-playfair font-medium text-lg text-text-primary mb-1">{t("mvp_item_4_val")}</div>
                                <div className="text-xs text-text-muted font-light uppercase tracking-wide">{t("mvp_item_4_desc")}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* 5. ECONOMICS */}
            <section id="economics" className="py-24 px-4 flex flex-col items-center">
                <div className="text-center mb-16 space-y-6 w-full max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-playfair font-semibold text-text-primary tracking-tight">{t("eco_title")}</h2>
                    <p className="text-xl text-text-secondary leading-relaxed font-light">
                        {t("eco_desc")}
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="max-w-4xl mx-auto bg-forest-900 border border-border-default/50 rounded-2xl overflow-hidden shadow-card mb-20 w-full">
                    <div className="grid grid-cols-3 bg-forest-800 p-6 font-sans font-medium text-text-primary border-b border-border-default/50 text-sm md:text-base uppercase tracking-wider">
                        <div>{t("table_head_1")}</div>
                        <div className="text-center text-text-muted">{t("table_head_2")}</div>
                        <div className="text-center text-gold-500">{t("table_head_3")}</div>
                    </div>
                    {[
                        { label: t("table_row_1_label"), hotel: t("table_row_1_hotel"), dao: t("table_row_1_dao") },
                        { label: t("table_row_2_label"), hotel: t("table_row_2_hotel"), dao: t("table_row_2_dao") },
                        { label: t("table_row_3_label"), hotel: t("table_row_3_hotel"), dao: t("table_row_3_dao") },
                        { label: t("table_row_4_label"), hotel: t("table_row_4_hotel"), dao: t("table_row_4_dao") }
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-3 p-6 border-b border-border-subtle items-center hover:bg-forest-800/30 transition-colors">
                            <div className="font-playfair font-medium text-lg text-text-primary">{row.label}</div>
                            <div className="text-center text-text-muted text-sm font-light">{row.hotel}</div>
                            <div className="text-center text-gold-500 font-semibold text-sm">{row.dao}</div>
                        </div>
                    ))}
                </div>

                {/* New Advanced Calculator */}
                <div className="w-full mb-20">
                    <LongTermSavings onConnect={onConnect} hasNft={hasNft} onNavigate={onNavigate} />
                </div>

                {/* From Code to Foundations */}
                <div className="text-center w-full max-w-2xl mx-auto mt-20">
                    <h2 className="text-2xl font-playfair font-medium text-text-primary mb-4">{t("footer_title")}</h2>
                    <p className="text-text-secondary font-light">{t("footer_desc")}</p>
                </div>
            </section>


            {/* 6. FUND ALLOCATION */}
            <section className="py-24 px-4 bg-forest-900 border-t border-border-subtle film-grain">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-500/10 border border-forest-500/20 text-gold-500 text-xs font-sans font-semibold uppercase tracking-widest mb-6">
                            <ShieldCheck size={14} /> {t("alloc_tag")}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-playfair font-semibold text-text-primary mb-6 tracking-tight">
                            {t("alloc_title")}
                        </h2>
                        <p className="text-xl text-text-secondary leading-relaxed font-light">
                            {t("alloc_desc")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {/* 80% Construction */}
                        <div className="bg-forest-800 p-8 rounded-2xl border border-border-default/30 relative overflow-hidden group hover:border-gold-500/30 transition-all shadow-sm">
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-gold-500"
                                initial={{ width: 0 }}
                                whileInView={{ width: "70%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-forest-500/10 rounded-xl text-gold-500">
                                    <Home size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-5xl font-sans font-light text-text-primary">70<span className="text-2xl text-text-muted">%</span></div>
                            </div>
                            <h3 className="text-xl font-playfair font-medium text-text-primary mb-3">{t("alloc_1_title")}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm font-light">
                                {t("alloc_1_desc")}
                            </p>
                        </div>

                        {/* 15% Maintenance */}
                        <div className="bg-forest-800 p-8 rounded-2xl border border-border-default/30 relative overflow-hidden group hover:border-forest-400/30 transition-all shadow-sm">
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-forest-400"
                                initial={{ width: 0 }}
                                whileInView={{ width: "15%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-forest-500/10 rounded-xl text-forest-400">
                                    <Wrench size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-5xl font-sans font-light text-text-primary">15<span className="text-2xl text-text-muted">%</span></div>
                            </div>
                            <h3 className="text-xl font-playfair font-medium text-text-primary mb-3">{t("alloc_2_title")}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm font-light">
                                {t("alloc_2_desc")}
                            </p>
                        </div>

                        {/* 15% Ops */}
                        <div className="bg-forest-800 p-8 rounded-2xl border border-border-default/30 relative overflow-hidden group hover:border-text-secondary/30 transition-all shadow-sm">
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-text-secondary"
                                initial={{ width: 0 }}
                                whileInView={{ width: "15%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-forest-500/10 rounded-xl text-text-secondary">
                                    <Settings size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-5xl font-sans font-light text-text-primary">15<span className="text-2xl text-text-muted">%</span></div>
                            </div>
                            <h3 className="text-xl font-playfair font-medium text-text-primary mb-3">{t("alloc_3_title")}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm font-light">
                                {t("alloc_3_desc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* 7. HORIZONTAL ROADMAP */}
            <section id="roadmap" ref={roadmapRef} className="relative h-[800vh]">
                <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-forest-900">
                    <div className="absolute top-10 left-10 z-10">
                        <h2 className="text-4xl md:text-6xl font-playfair font-semibold text-text-primary ml-4 md:ml-12 drop-shadow-md">{t("roadmap_title")}</h2>
                        <p className="text-text-secondary ml-4 md:ml-12 mt-2 font-sans font-light uppercase tracking-widest">{t("roadmap_subtitle")}</p>
                    </div>
                    <motion.div ref={contentRef} style={{ x }} className="flex gap-12 px-12 md:px-24 min-w-max">
                        {roadmapSteps.map((step, i) => (
                            <div key={i} className="relative min-w-[300px] md:min-w-[400px] bg-forest-800 border border-border-subtle p-8 rounded-2xl flex flex-col justify-between min-h-[400px] group hover:border-gold-500/50 transition-colors shadow-sm">
                                <div>
                                    {step.image && (
                                        <div className="w-full h-48 mb-6 rounded-xl overflow-hidden border border-border-subtle">
                                            <img src={step.image} alt={step.title} className={`w-full h-full object-cover ${step.position || "object-center"} transition-transform duration-[1.5s] group-hover:scale-110`} />
                                        </div>
                                    )}
                                    <div className="text-gold-500 font-sans font-semibold text-xs tracking-widest uppercase mb-3">{step.date}</div>
                                    <h3 className="text-2xl font-playfair font-medium text-text-primary mb-4">{step.title}</h3>
                                    <p className="text-text-secondary font-light leading-relaxed">{step.desc}</p>
                                </div>
                                <div className="p-4 bg-forest-500/10 rounded-xl w-fit group-hover:bg-gold-500/10 transition-colors border border-transparent group-hover:border-gold-500/20">
                                    <step.icon size={28} strokeWidth={1.5} className="text-text-primary group-hover:text-gold-500 transition-colors" />
                                </div>
                                {/* Connector Line Visualization */}
                                <div className="absolute -right-12 top-1/2 w-12 h-[1px] bg-border-subtle hidden md:block"></div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
