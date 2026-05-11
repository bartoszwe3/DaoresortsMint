// src/components/LandingPage.jsx
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Check, ArrowRight, Zap, BadgeCheck, Vote, Users, FileText, Pickaxe, Key, Home, Calendar, Wrench, Settings, ShieldCheck, TrendingDown, Infinity, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import LongTermSavings from "./LongTermSavings";
import MembershipProgress from "./MembershipProgress";
import { FounderTeaser } from "./FounderTeaser";
import FAQ from "./FAQ";
import MemberCarousel from "./MemberCarousel";
import HeroHeadline from "./HeroHeadline";

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



export default function LandingPage({ onConnect, scrollContainer, hasNft, onNavigate }) {
    const { t } = useTranslation();
    const [activeRoadmapIndex, setActiveRoadmapIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [showSticky, setShowSticky] = useState(false);
    const { scrollY } = useScroll();
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const id = location.hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    const yOffset = -80; // Account for fixed TopNavbar height
                    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                }
            }, 100); // 100ms prevents race conditions rendering the DOM
        }
    }, [location.hash]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        const unsubsScroll = scrollY.on("change", (latest) => {
            setShowSticky(latest > window.innerHeight * 0.5);
        });

        return () => {
            window.removeEventListener('resize', checkMobile);
            unsubsScroll();
        };
    }, [scrollY]);

    // NFT_PRICE is replaced by MEMBERSHIP_TOTAL below
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



    return (
        <div id="landing-page" className="w-full max-w-[100vw] overflow-x-hidden pb-24 text-white font-sans animate-in fade-in duration-700">

            {/* 1. HERO SECTION */}
            <section id="hero" className="relative flex flex-col justify-center text-left md:text-center px-4 sm:px-6 w-full max-w-full min-h-screen overflow-hidden pt-[72px]">
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

                <div className="z-20 w-full max-w-full md:max-w-6xl mx-auto space-y-8 px-4 sm:px-6">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center text-center w-full">

                        {/* Elegant Tag */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gold-500/40 bg-forest-800/50 backdrop-blur-sm text-xs font-sans font-medium tracking-widest text-gold-500/90 mb-8 shadow-sm"
                            whileHover={{ y: -2 }}
                        >
                            <span>{t("prezentacja_hero_tag", "Prywatny Klub Wakacyjny")}</span>
                        </motion.div>

                        {/* Quiet Luxury Headline */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl text-center font-playfair font-semibold leading-[1.1] text-text-primary mb-8 tracking-tight drop-shadow-lg break-words w-full">
                            <HeroHeadline text1={t("prezentacja_hero_title1", "Hotele zarabiają na Tobie. ").trim()} text2={t("prezentacja_hero_title2", "Czas to zmienić.")} />
                        </h1>

                        <p className="text-base md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10 font-sans font-light break-words w-full px-4 md:px-0 text-center">
                            {t("prezentacja_hero_desc", "Jedno członkostwo. 14 nocy rocznie. Dożywotnio po kosztach.")}
                        </p>

                        <div className="flex flex-col items-center w-full px-4 md:px-0">
                            <a
                                href="/kontakt"
                                style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '18px', padding: '16px 40px', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#B8973B'}
                                onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
                                className="flex items-center justify-center text-center w-full sm:w-auto min-w-[280px]"
                            >
                                Zarezerwuj miejsce w projekcie - 2 000 PLN
                            </a>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(245, 240, 232, 0.60)', marginTop: '12px', textAlign: 'center', display: 'block' }}>
                                Rezerwacja w 100% zwrotna. Rezygnujesz kiedy chcesz.
                            </p>
                        </div>

                        <div className="mt-12 w-full max-w-full overflow-hidden">
                            <MembershipProgress passportCount={189} reservedCount={47} activeCount={25} />
                        </div>
                    </motion.div>
                </div>
            </section>



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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Home,
                                title: "Prywatne jacuzzi",
                                desc: "Każdy domek ma własne jacuzzi na tarasie. Tylko Twoja rodzina."
                            },
                            {
                                icon: TrendingDown,
                                title: "Po kosztach operacyjnych",
                                desc: "~692 PLN za tydzień zamiast 5 600 PLN w hotelu premium."
                            },
                            {
                                icon: Vote,
                                title: "Głosujesz nad resortem",
                                desc: "Każdy Token = 1 głos. Ty i 149 innych memberów decydujecie."
                            },
                            {
                                icon: Infinity,
                                title: "Dożywotnio",
                                desc: "Płacisz raz etapami budowy. Zero opłat rocznych. Na zawsze."
                            }
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-5 flex flex-col items-start text-left shadow-sm hover:border-[#C9A84C]/50 transition-all">
                                <stat.icon className="text-[#C9A84C] mb-3" size={24} />
                                <h3 className="text-[#F5F0E8] font-semibold text-base mb-2">{stat.title}</h3>
                                <p className="text-[#8A9E8A] text-sm leading-relaxed">{stat.desc}</p>
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
                                <span className="text-xs font-sans font-semibold uppercase tracking-wide">Pszczew, Polska</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl md:text-6xl font-playfair font-semibold leading-tight text-white mb-2 drop-shadow-md">
                            Silna.club - Silna, Lubuskie.
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
                        <p className="text-[#8A9E8A] text-sm italic mt-6">
                            "Działka kupiona z własnych środków foundera przed uruchomieniem sprzedaży tokenów."
                        </p>
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
                <div id="kalkulator" className="w-full mb-20">
                    <LongTermSavings onConnect={onConnect} hasNft={hasNft} onNavigate={onNavigate} />
                </div>

                {/* From Code to Foundations */}
                <div className="text-center w-full max-w-2xl mx-auto mt-20">
                    <h2 className="text-2xl font-playfair font-medium text-text-primary mb-4">{t("footer_title")}</h2>
                    <p className="text-text-secondary font-light">{t("footer_desc")}</p>
                </div>
            </section>


            {/* NEW: PHASED PAYMENTS SECTION */}
            <section id="phased-payments" className="py-24 px-4 bg-[#0E1208] text-white overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[#C9A84C] text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-3 block">
                            Model płatności
                        </span>
                        <h2 className="text-4xl md:text-6xl font-playfair font-semibold mb-8 tracking-tight">
                            Płacisz razem z budową
                        </h2>
                        <p className="text-lg md:text-xl text-[#8A9E8A] font-light leading-relaxed max-w-2xl mx-auto">
                            Nie płacisz 25 900 PLN z góry. Każda wpłata
                            jest powiązana z konkretnym etapem budowy -
                            widzisz za co płacisz.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Payment Stages mapped for mobile-friendly compact stack */}
                        {[
                            { id: 0, name: 'Etap 0 — Rezerwacja', trigger: 'Teraz', amount: 2000, refundable: true, active: true },
                            { id: 1, name: 'Etap 1 — Stan surowy zamknięty', trigger: 'Po wylaniu fundamentów', amount: 12000, refundable: false, active: false },
                            { id: 2, name: 'Etap 2 — Stan deweloperski', trigger: 'Po stanie surowym zamkniętym', amount: 8900, refundable: false, active: false },
                            { id: 3, name: 'Etap 3 — Aktywacja członkostwa', trigger: 'Po otwarciu resortu', amount: 3000, refundable: false, active: false }
                        ].map(stage => (
                            <div key={stage.id}
                                className={`flex items-center justify-between bg-[#1C2614] border ${stage.active ? 'border-[#C9A84C]' : 'border-[#2D5A3D]/40 opacity-70'} rounded-xl p-4 mb-3 hover:bg-[#1C2614]/80 transition-all`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${stage.active ? 'bg-[#C9A84C] text-[#0E1208] shadow-lg shadow-[#C9A84C]/20' : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'}`}>
                                        {stage.id}
                                    </div>
                                    <div>
                                        <p className={`font-medium text-sm ${stage.active ? 'text-white font-bold' : 'text-white/90'}`}>
                                            {stage.name}
                                        </p>
                                        <p className="text-[#8A9E8A] text-xs flex items-center gap-2">
                                            <span>{stage.trigger}</span>
                                            {stage.refundable && (
                                                <span className="bg-green-500/10 text-green-400 text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-green-500/20">
                                                    zwrotne
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <p className={`${stage.active ? 'text-[#C9A84C]' : 'text-[#C9A84C]/60'} font-bold text-base font-sans`}>
                                        {stage.amount.toLocaleString('pl-PL')} PLN
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Sum Line */}
                        <div className="border-t border-[#C9A84C]/50 mt-8 pt-6 flex justify-between items-center px-2">
                            <span className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-[#8A9E8A]">ŁĄCZNIE</span>
                            <span className="text-2xl md:text-3xl font-bold font-sans text-white tracking-tight">25 900 PLN</span>
                        </div>
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-[#8A9E8A] text-base mb-10 max-w-lg mx-auto leading-relaxed font-light">
                            Nie możesz kontynuować? Token jest transferowalny -
                            możesz sprzedać swoje miejsce innemu memberowi.
                        </p>

                        <div className="flex flex-col items-center">
                            <a
                                href="/kontakt"
                                style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '18px', padding: '16px 40px', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#B8973B'}
                                onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
                                className="flex items-center justify-center text-center min-w-[320px]"
                            >
                                Zarezerwuj miejsce w projekcie - 2 000 PLN
                            </a>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(245, 240, 232, 0.60)', marginTop: '12px', textAlign: 'center', display: 'block' }}>
                                Rezerwacja w 100% zwrotna. Rezygnujesz kiedy chcesz.
                            </p>
                        </div>
                    </div>
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
                        {/* 70% Construction */}
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

                        {/* 10% Maintenance */}
                        <div className="bg-forest-800 p-8 rounded-2xl border border-border-default/30 relative overflow-hidden group hover:border-gold-500/30 transition-all shadow-sm">
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-gold-500"
                                initial={{ width: 0 }}
                                whileInView={{ width: "10%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-forest-500/10 rounded-xl text-gold-500">
                                    <Wrench size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-5xl font-sans font-light text-text-primary">10<span className="text-2xl text-text-muted">%</span></div>
                            </div>
                            <h3 className="text-xl font-playfair font-medium text-text-primary mb-3">{t("alloc_2_title")}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm font-light">
                                {t("alloc_2_desc")}
                            </p>
                        </div>

                        {/* 20% Ops */}
                        <div className="bg-forest-800 p-8 rounded-2xl border border-border-default/30 relative overflow-hidden group hover:border-text-secondary/30 transition-all shadow-sm">
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-text-secondary"
                                initial={{ width: 0 }}
                                whileInView={{ width: "20%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-forest-500/10 rounded-xl text-text-secondary">
                                    <Settings size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-5xl font-sans font-light text-text-primary">20<span className="text-2xl text-text-muted">%</span></div>
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
            {/* 7. HORIZONTAL ROADMAP */}
            <section
                id="roadmap"
                ref={roadmapRef}
                className="relative py-20 bg-forest-900 overflow-hidden"
            >
                <div className="w-full overflow-x-auto flex items-stretch gap-6 px-6 md:px-12 lg:px-24 pb-10 pt-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`
                        #roadmap ::-webkit-scrollbar { display: none; }
                    `}</style>
                    <div className="min-w-[85vw] sm:min-w-[400px] flex-shrink-0 snap-center pr-8 flex flex-col justify-center">
                        <h2 className="text-4xl md:text-6xl font-playfair font-semibold text-text-primary drop-shadow-md">{t("roadmap_title")}</h2>
                        <p className="text-text-secondary mt-4 font-sans font-light uppercase tracking-widest leading-relaxed text-xs md:text-sm">{t("roadmap_subtitle")}</p>
                    </div>
                    {roadmapSteps.map((step, i) => (
                        <div key={i} className="min-w-[85vw] sm:min-w-[400px] snap-center bg-forest-800 border border-border-subtle p-8 rounded-2xl flex flex-col justify-between group flex-shrink-0 shadow-sm transition-colors hover:border-gold-500/50">
                            <div>
                                {step.image && (
                                    <div className="w-full h-48 mb-6 rounded-xl overflow-hidden border border-border-subtle relative group-hover:border-gold-500/30 transition-colors">
                                        <img src={step.image} alt={step.title} className={`w-full h-full object-cover ${step.position || "object-center"} transition-transform duration-[1.5s] group-hover:scale-110`} />
                                    </div>
                                )}
                                <div className="text-gold-500 font-sans font-semibold text-xs tracking-widest uppercase mb-3">{step.date}</div>
                                <h3 className="text-2xl font-playfair font-medium text-text-primary mb-4">{step.title}</h3>
                                <p className="text-text-secondary font-light leading-relaxed">{step.desc}</p>
                            </div>
                            <div className="p-4 bg-forest-500/10 rounded-xl w-fit group-hover:bg-gold-500/10 transition-colors border border-transparent group-hover:border-gold-500/20 mt-6 md:mt-10">
                                <step.icon size={28} strokeWidth={1.5} className="text-text-primary group-hover:text-gold-500 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <div id="faq">
                <FAQ />
            </div>

            {/* FOUNDER TEASER */}
            <FounderTeaser />

            {/* STICKY CTA na Mobile */}
            <AnimatePresence>
                {isMobile && showSticky && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 w-full z-[100] bg-forest-900/95 backdrop-blur-lg border-t border-gold-500/20 p-4 pointer-events-none"
                    >
                        <div className="flex flex-col items-center w-full pointer-events-auto">
                            <a
                                href="/kontakt"
                                style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '18px', padding: '16px 40px', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em', textDecoration: 'none' }}
                                className="w-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                            >
                                Zarezerwuj miejsce w projekcie - 2 000 PLN
                            </a>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(245, 240, 232, 0.60)', marginTop: '12px', textAlign: 'center', display: 'block' }}>
                                Rezerwacja w 100% zwrotna. Rezygnujesz kiedy chcesz.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
