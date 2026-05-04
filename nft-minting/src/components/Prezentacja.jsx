import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useScroll } from "framer-motion";
import { ChevronDown, Share2, Check, Shield, Vote, Key, Calendar, Users, Home, ArrowRight, ChevronRight, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import HeroHeadline from "./HeroHeadline";
import MemberCarousel from "./MemberCarousel";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

/* ================================================================
   UTILITY - Animated counter hook
   ================================================================ */
function useCounter(end, duration = 2000, startOnView = false, isInView = true) {
    const [count, setCount] = useState(0);
    const hasRun = useRef(false);

    useEffect(() => {
        if (startOnView && !isInView) return;
        if (hasRun.current) return;
        hasRun.current = true;

        const startTime = performance.now();
        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration, startOnView, isInView]);

    return count;
}

/* ================================================================
   SECTION WRAPPER
   ================================================================ */
function Section({ id, children, className = "" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div id={id} ref={ref} className={`relative scroll-mt-20 block ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
}

const getSections = (t) => [
    { id: "s1", label: t("prezentacja_s1_nav", "Hook") },
    { id: "s2", label: t("prezentacja_s2_tag", "Problem") },
    { id: "s3", label: t("prezentacja_s3_tag", "Rozwiązanie") },
    { id: "s8", label: t("prezentacja_s8_tag", "Założyciel") },
    { id: "s4", label: t("prezentacja_s4_tag", "Matematyka") },
    { id: "s5", label: t("prezentacja_s5_tag", "Resort") },
    { id: "s6", label: t("prezentacja_s6_tag", "Jak to działa") },
    { id: "s7", label: t("prezentacja_s7_tag", "Zaufanie") },
    { id: "s9", label: t("prezentacja_s9_tag", "Roadmapa") },
    { id: "s10", label: t("prezentacja_s10_tag", "Alokacja") },
    { id: "s11", label: t("prezentacja_s11_tag", "FAQ") },
    { id: "s12", label: t("prezentacja_s12_nav", "Dołącz") },
];

function DotNav({ activeId, sections }) {
    return (
        <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
            {sections.map((s) => (
                <a
                    key={s.id}
                    href={`#${s.id}`}
                    title={s.label}
                    className="group flex items-center gap-3"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    <span
                        className={`block rounded-full transition-all duration-300 ${activeId === s.id
                            ? "w-3 h-3 bg-[#C9A84C] shadow-[0_0_8px_rgba(201,168,76,0.5)]"
                            : "w-2 h-2 bg-[#2D5A3D] group-hover:bg-[#C9A84C]/60"
                            }`}
                    />
                    <span
                        className={`text-[10px] uppercase tracking-widest transition-opacity duration-300 ${activeId === s.id ? "opacity-100 text-[#C9A84C]" : "opacity-0 group-hover:opacity-100 text-[#8A9E8A]"
                            }`}
                    >
                        {s.label}
                    </span>
                </a>
            ))}
        </nav>
    );
}

function ShareButton({ t }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(window.location.origin + "/prezentacja").then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, []);

    return (
        <button
            onClick={handleCopy}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#0E1208]/80 backdrop-blur-md border border-[#2D5A3D] text-[#8A9E8A] hover:text-[#C9A84C] hover:border-[#C9A84C]/40 px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all"
        >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? t("prezentacja_copied", "Skopiowano") : t("prezentacja_share", "Udostępnij")}
        </button>
    );
}

function StickyCTA({ onClick, t }) {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            setVisible(latest > window.innerHeight * 0.4);
        });
    }, [scrollY]);

    if (!visible) return null;

    return (
        <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={onClick}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 md:px-8 py-3 md:py-4 bg-[#C9A84C] hover:bg-[#b09342] text-[#0E1208] font-sans font-bold shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:shadow-[0_4px_30px_rgba(201,168,76,0.5)] transition-all whitespace-normal md:whitespace-nowrap text-center max-w-[90vw] md:max-w-none text-xs md:text-sm lg:text-base border-none outline-none ring-0 focus:outline-none"
        >
            {t("prezentacja_sticky_cta", "Dołącz za darmo i odbierz Paszport")}
        </motion.button>
    );
}

function CounterCard({ value, prefix = "", suffix = "", label, sublabel, accent = false }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const count = useCounter(value, 2200, true, isInView);

    return (
        <div
            ref={ref}
            className={`rounded-2xl p-6 md:p-8 text-center border transition-all ${accent
                ? "bg-[#C9A84C]/10 border-[#C9A84C]/30"
                : "bg-[#1C2614]/60 border-[#2D5A3D]/40"
                }`}
        >
            <div className={`font-playfair text-3xl md:text-4xl font-bold mb-2 ${accent ? "text-[#C9A84C]" : "text-[#F5F0E8]"}`}>
                {prefix}{count.toLocaleString("pl-PL")}{suffix}
            </div>
            <div className="text-[#F5F0E8] text-sm font-medium mb-1">{label}</div>
            {sublabel && <div className="text-[#8A9E8A] text-xs">{sublabel}</div>}
        </div>
    );
}

/* ============================================================
   SECTIONS S1 - S12 (TOP-LEVEL)
   ============================================================ */

const S1 = ({ onConnect, t }) => (
    <div id="s1" className="relative w-full h-[calc(100vh-72px)] md:h-screen flex flex-col items-center justify-center overflow-visible bg-[#0E1208] isolate">
        <video src="/silnawebvideo.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E1208]/70 via-[#0E1208]/40 to-[#0E1208] z-[1]" />
        <div className="relative z-[20] w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            <HeroHeadline text1={t("prezentacja_hero_title1", "Hotele zarabiają na Tobie. ")} text2={t("prezentacja_hero_title2", "Czas to zmienić.")} />
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl px-4">
                {t("prezentacja_hero_desc", "Jedno członkostwo. 14 nocy rocznie. Dożywotnio po kosztach.")}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8 w-full max-w-lg mx-auto px-4">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 md:px-8 py-5 backdrop-blur-sm">
                    <div className="font-playfair text-2xl md:text-3xl text-gold-500 font-bold">{t("prezentacja_hero_stat1_val", "2 000 PLN")}</div>
                    <div className="text-white/70 text-sm mt-1">{t("prezentacja_hero_stat1_label", "rezerwacja miejsca")}</div>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 md:px-8 py-5 backdrop-blur-sm">
                    <div className="font-playfair text-2xl md:text-3xl text-white font-bold">{t("prezentacja_hero_stat2_val", "~316 000 PLN")}</div>
                    <div className="text-[#8A9E8A] text-sm mt-1">{t("prezentacja_hero_stat2_label", "oszczędności przez 20 lat")}</div>
                </div>
            </motion.div>
            {onConnect && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col items-center gap-2 w-full max-w-sm mx-auto mb-12 px-4">
                    <button onClick={() => onConnect(false)} className="px-6 py-4 w-full bg-gold-500 hover:bg-[#b09342] text-black font-sans font-bold rounded-none transition-all shadow-btn-primary hover:shadow-btn-primary-hover flex items-center justify-center gap-3 text-sm">
                        {t("prezentacja_hero_cta_join", "Dołącz za darmo")}
                    </button>
                    <button onClick={() => onConnect(true)} className="text-[#8A9E8A] text-xs text-center w-full mt-2 hover:text-gold-500 transition-colors">
                        {t("prezentacja_hero_cta_login", "Masz już konto? Zaloguj się")}
                    </button>
                </motion.div>
            )}
        </div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[20] hidden md:block" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <ChevronDown size={28} className="text-gold-500/60" />
        </motion.div>
    </div>
);

const S2 = ({ t }) => (
    <Section id="s2" className="py-12 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s2_tag", "Problem")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] mb-4">{t("prezentacja_s2_title", "Ile naprawdę kosztują Twoje wakacje?")}</h2>
                <p className="text-[#8A9E8A] text-base md:text-lg max-w-2xl mx-auto">{t("prezentacja_s2_desc", "Hotel premium z jacuzzi: 5 600 PLN za tydzień, czyli 11 200 PLN za 14 nocy rocznie przez 20 lat. Policz sam.")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                <CounterCard value={224000} suffix=" PLN" label={t("prezentacja_s2_stat1_label", "Koszty hotelowe")} sublabel={t("prezentacja_s2_stat1_sub", "11 200 PLN/rok × 20 lat")} />
                <CounterCard value={146000} prefix="+" suffix=" PLN" label={t("prezentacja_s2_stat2_label", "Inflacja hotelowa")} sublabel={t("prezentacja_s2_stat2_sub", "5% wzrostu cen rocznie")} />
                <CounterCard value={370000} suffix=" PLN" label={t("prezentacja_s2_stat3_label", "Łączny wydatek")} sublabel={t("prezentacja_s2_stat3_sub", "Twoje 20 lat wakacji premium")} accent />
            </div>
            <div className="bg-[#0E1208] border border-[#2D5A3D]/30 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">{t("prezentacja_s2_card_title1", "Co płacisz")}</p>
                        <div className="font-playfair text-4xl text-[#F5F0E8] font-bold mb-2">375 000 PLN</div>
                        <p className="text-[#8A9E8A] text-sm">{t("prezentacja_s2_card_desc1", "przez 20 lat na hotele premium")}</p>
                    </div>
                    <div>
                        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">{t("prezentacja_s2_card_title2", "Co dostajesz")}</p>
                        <ul className="space-y-3">
                            {[t("prezentacja_s2_list_item1", "Zero własności"), t("prezentacja_s2_list_item2", "Zero wpływu na jakość"), t("prezentacja_s2_list_item3", "Zero wpływu na cenę"), t("prezentacja_s2_list_item4", "Zdjęcia na Instagramie")].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[#F5F0E8]/80 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                                        <span className="text-red-400 text-xs">✕</span>
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </Section>
);

const S3 = ({ t }) => (
    <Section id="s3" className="py-12 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s3_tag", "Rozwiązanie")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] mb-4">{t("prezentacja_s3_title", "Płacisz raz. Korzystasz dożywotnio.")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: <Key size={28} className="text-[#C9A84C]" />, title: t("prezentacja_s3_card1_title", "Płacisz raz"), desc: t("prezentacja_s3_card1_desc", "25 900 PLN jednorazowo. Żadnych rocznych opłat członkowskich. Żadnych ukrytych kosztów wejścia.") },
                    { icon: <Home size={28} className="text-[#C9A84C]" />, title: t("prezentacja_s3_card2_title", "Korzystasz po kosztach"), desc: t("prezentacja_s3_card2_desc", "~692 PLN za tydzień zamiast 5 600 PLN w hotelu. Płacisz tylko realne koszty mediów i sprzątania.") },
                    { icon: <Shield size={28} className="text-[#C9A84C]" />, title: t("prezentacja_s3_card3_title", "Jesteś klubowiczem"), desc: t("prezentacja_s3_card3_desc", "Karta Członkowska to Twój prawny dokument prawa do korzystania. Możesz ją sprzedać, przekazać rodzinie lub zachować na zawsze.") }
                ].map((card, i) => (
                    <div key={i} className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-8 hover:border-[#C9A84C]/30 transition-colors text-left">
                        <div className="mb-5">{card.icon}</div>
                        <h3 className="font-playfair text-xl text-[#F5F0E8] font-semibold mb-3">{card.title}</h3>
                        <p className="text-[#8A9E8A] text-sm leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>
            <p className="text-center text-[#8A9E8A] text-sm mt-10 max-w-xl mx-auto">
                {t("prezentacja_s3_footer", "Unikamy słowa „inwestycja\" - bo to nie jest inwestycja. To członkostwo z realną użytecznością i fizycznym resortem.")}
            </p>
        </div>
    </Section>
);

const S8 = ({ leadForm, setLeadForm, leadConsent, setLeadConsent, leadStatus, handleLeadSubmit, t }) => (
    <Section id="s8" className="py-12 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s8_tag", "Założyciel")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s8_title", "Człowiek za projektem")}</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-[#1C2614]/30 border border-[#2D5A3D]/30 rounded-2xl p-8 md:p-10 text-left">
                <img src="/Bartoszzdjecie.jpeg" alt="Bartosz Zniszczoł" className="w-40 h-40 md:w-52 md:h-52 rounded-2xl object-cover border border-[#2D5A3D] shrink-0" />
                <div className="flex-1">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">{t("prezentacja_s8_role", "Założyciel Silna.club")}</p>
                    <h3 className="font-playfair text-2xl md:text-3xl text-[#F5F0E8] mb-2">Bartosz Zniszczoł</h3>
                    <p className="text-[#8A9E8A] text-xs mb-4">WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</p>
                    <blockquote className="border-l-4 border-[#C9A84C] pl-4 mb-5">
                        <p className="font-playfair text-lg text-[#F5F0E8] italic">{t("prezentacja_s8_quote", "„Kupiłem tę ziemię za własne pieniądze zanim sprzedałem pierwsze członkostwo. Nie możesz mi zaufać bardziej niż ja zaufałem tej idei.”")}</p>
                    </blockquote>
                    <p className="text-[#8A9E8A] text-sm leading-relaxed mb-5">{t("prezentacja_s8_desc", "Buduję transparentną i elitarną społeczność wokół pierwszej w Polsce wioski turystycznej zaprojektowanej pod nowoczesne standardy.")}</p>
                    <div className="flex flex-wrap gap-3 mb-8">
                        <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" className="border border-[#C9A84C] text-[#C9A84C] px-4 py-2 rounded-md text-xs hover:bg-[#C9A84C] hover:text-[#0E1208] transition-all">LinkedIn</a>
                        <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="border border-[#2D5A3D] text-[#8A9E8A] px-4 py-2 rounded-md text-xs hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">X / Twitter</a>
                        <a href="mailto:bartosz@silna.club" className="border border-[#2D5A3D] text-[#8A9E8A] px-4 py-2 rounded-md text-xs hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">bartosz@silna.club</a>
                    </div>
                    <div className="pt-8 border-t border-[#2D5A3D]/30 min-h-[160px]">
                        <p className="text-[#F5F0E8] text-sm mb-4 font-medium italic">{t("prezentacja_s8_lead_title", "Masz pytania? Zostaw numer - oddzwonię osobiście.")}</p>
                        {leadStatus === 'success' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 p-4 rounded-xl text-[#C9A84C] text-sm font-medium">{t("prezentacja_s8_lead_success", "Oddzwonię wkrótce. - Bartosz")}</motion.div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input type="text" placeholder={t("prezentacja_s8_placeholder_name", "Imię")} required className="bg-[#0E1208] border border-[#2D5A3D] rounded-none px-4 py-2.5 text-sm text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-colors flex-1" value={leadForm.imie} onChange={(e) => setLeadForm({...leadForm, imie: e.target.value})} />
                                    <input type="tel" placeholder={t("prezentacja_s8_placeholder_phone", "Numer telefonu")} required className="bg-[#0E1208] border border-[#2D5A3D] rounded-none px-4 py-2.5 text-sm text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-colors flex-1" value={leadForm.telefon} onChange={(e) => setLeadForm({...leadForm, telefon: e.target.value})} />
                                    <button
                                        type="button"
                                        onClick={handleLeadSubmit}
                                        disabled={leadStatus === 'submitting' || !leadConsent}
                                        className="bg-[#C9A84C] hover:bg-[#b09342] text-[#0E1208] font-bold px-6 py-2.5 rounded-none transition-all shadow-btn-primary flex items-center justify-center gap-2 text-sm whitespace-nowrap disabled:opacity-50"
                                    >
                                        {leadStatus === 'submitting' ? t("prezentacja_s8_btn_sending", "Wysyłanie...") : t("prezentacja_s8_btn_call", "Zadzwoń do mnie →")}
                                    </button>
                                </div>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={leadConsent}
                                        onChange={(e) => setLeadConsent(e.target.checked)}
                                        className="mt-1 w-4 h-4 accent-[#C9A84C] shrink-0"
                                    />
                                    <span className="text-[#8A9E8A] text-[10px] leading-relaxed">
                                        Akceptuję <a href="/regulamin" className="text-[#C9A84C] hover:underline">Regulamin</a> oraz <a href="/polityka-prywatnosci" className="text-[#C9A84C] hover:underline">Politykę Prywatności</a> i wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji połączenia telefonicznego.
                                    </span>
                                </label>
                            </div>
                        )}
                        {leadStatus === 'error' && <p className="text-red-400 text-xs mt-2">{t("prezentacja_s8_lead_error", "Coś poszło nie tak. Spróbuj ponownie lub napisz maila.")}</p>}
                    </div>
                </div>
            </div>
        </div>
    </Section>
);

const S4 = ({ t }) => (
    <Section id="s4" className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s4_tag", "Matematyka")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s4_title", "Liczby mówią same za siebie.")}</h2>
            </div>
            <div className="overflow-x-auto mb-10">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-[#2D5A3D]/40">
                            <th className="py-4 px-4 text-[#8A9E8A] uppercase tracking-widest text-xs font-normal">{t("prezentacja_s4_th1", "Przez 20 lat")}</th>
                            <th className="py-4 px-4 text-[#8A9E8A] uppercase tracking-widest text-xs font-normal text-right">{t("prezentacja_s4_th2", "Hotel premium")}</th>
                            <th className="py-4 px-4 text-[#C9A84C] uppercase tracking-widest text-xs font-normal text-right">{t("prezentacja_s4_th3", "Silna.club")}</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#F5F0E8]">
                        {[
                            [t("prezentacja_s4_row1", "Koszt jednorazowy"), "0 PLN", "25 900 PLN"],
                            [t("prezentacja_s4_row2", "Koszt rocznie (dziś)"), "11 200 PLN", "1 384 PLN"],
                            [t("prezentacja_s4_row3", "Łącznie 20 lat z inflacją"), "~370 000 PLN", "~59 500 PLN"]
                        ].map(([label, hotel, dao], i) => (
                            <tr key={i} className="border-b border-[#2D5A3D]/20">
                                <td className="py-4 px-4 text-[#8A9E8A]">{label}</td>
                                <td className="py-4 px-4 text-right">{hotel}</td>
                                <td className="py-4 px-4 text-right text-[#C9A84C] font-medium">{dao}</td>
                            </tr>
                        ))}
                        <tr className="border-b border-[#C9A84C]/30 text-lg">
                            <td className="py-4 px-4 text-[#F5F0E8] font-semibold">{t("prezentacja_s4_saving", "Oszczędność")}</td>
                            <td className="py-4 px-4 text-right text-[#8A9E8A]">-</td>
                            <td className="py-4 px-4 text-right text-[#C9A84C] font-bold">~310 500 PLN</td>
                        </tr>
                        <tr className="border-b border-[#2D5A3D]/20">
                            <td className="py-4 px-4 text-[#8A9E8A]">{t("prezentacja_s4_ownership", "Własność")}</td>
                            <td className="py-4 px-4 text-right text-red-400">✕</td>
                            <td className="py-4 px-4 text-right text-green-400">✓</td>
                        </tr>
                        <tr>
                            <td className="py-4 px-4 text-[#8A9E8A]">{t("prezentacja_s4_voting", "Prawo głosu")}</td>
                            <td className="py-4 px-4 text-right text-red-400">✕</td>
                            <td className="py-4 px-4 text-right text-green-400">✓</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-6 text-center">
                <p className="text-[#F5F0E8] text-base md:text-lg">{t("prezentacja_s4_footer", "Członkostwo zwraca się po 1.3 sezonie. Reszta to czyste oszczędności.")}</p>
            </div>
        </div>
    </Section>
);

const S5 = ({ t }) => (
    <Section id="s5" className="py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
            <div className="mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s5_tag", "Resort")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s5_title", "Silna, Lubuskie")}</h2>
                <p className="text-[#8A9E8A] text-base mt-4 max-w-2xl mx-auto">{t("prezentacja_s5_desc", "Działka 2 530 m² in the forest by Lake Pszczewskie. 6 premium houses with private jacuzzi. 7th operational building with cinema room, game room, and laundry.")}</p>
            </div>
            <div className="relative rounded-3xl overflow-hidden mb-10 aspect-video border border-[#2D5A3D]/30">
                <video src="/silnawebvideo.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1208]/80 to-transparent" />
            </div>
            <blockquote className="max-w-2xl mx-auto mb-14">
                <p className="font-playfair text-2xl md:text-3xl text-[#F5F0E8] italic leading-relaxed">{t("prezentacja_s5_quote", "„6 domków. 150 rodzin. Las. Jacuzzi. Twoje.”")}</p>
            </blockquote>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { val: "70 m²", label: t("prezentacja_s5_stat1_label", "Powierzchnia domku") },
                    { val: "2", label: t("prezentacja_s5_stat2_label", "Sypialnie w domku") },
                    { val: "Jacuzzi", label: t("prezentacja_s5_stat3_label", "Na tarasie każdego domku") },
                    { val: "200A", label: t("prezentacja_s5_stat4_label", "Przyłącze trójfazowe") }
                ].map((f, i) => (
                    <div key={i} className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-xl p-5">
                        <div className="font-playfair text-xl text-[#C9A84C] font-bold">{f.val}</div>
                        <div className="text-[#8A9E8A] text-xs mt-1 uppercase tracking-wide">{f.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </Section>
);

const S6 = ({ t }) => (
    <Section id="s6" className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s6_tag", "Mechanizm")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s6_title", "4 kroki do Twoich wakacji")}</h2>
            </div>
            <div className="space-y-0 text-left">
                {[
                    { step: "01", icon: <Users size={24} />, title: t("prezentacja_s6_step1_title", "Odbierz darmowy Paszport"), desc: t("prezentacja_s6_step1_desc", "Rejestracja emailem. Zero skomplikowanych rejestracji — logujesz się przez link wysłany na Twój email.") },
                    { step: "02", icon: <Key size={24} />, title: t("prezentacja_s6_step2_title", "Zarezerwuj członkostwo"), desc: t("prezentacja_s6_step2_desc", "2000 PLN wpisowego. Zabezpieczasz swoje miejsce w pierwszym etapie. Kolejne wpłaty wraz z postępem budowy.") },
                    { step: "03", icon: <Calendar size={24} />, title: t("prezentacja_s6_step3_title", "Rezerwuj domek"), desc: t("prezentacja_s6_step3_desc", "Przez aplikację Silna.club. 14 nocy rocznie w dowolnym dostępnym terminie. Płacisz tylko koszty operacyjne.") },
                    { step: "04", icon: <Vote size={24} />, title: t("prezentacja_s6_step4_title", "Głosuj i współdecyduj"), desc: t("prezentacja_s6_step4_desc", "Każdy członek ma 1 głos. Decydujesz o budżecie, modernizacjach i zasadach. To Twój resort.") }
                ].map((item, i) => (
                    <div key={i} className="flex gap-6 md:gap-8">
                        <div className="flex flex-col items-center shrink-0">
                            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">{item.icon}</div>
                            {i < 3 && <div className="w-px flex-1 bg-[#2D5A3D]/40 my-2 min-h-[40px]" />}
                        </div>
                        <div className="pb-10 flex-1">
                            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">{t("prezentacja_s6_step_label", "Krok")} {item.step}</p>
                            <h3 className="font-playfair text-xl text-[#F5F0E8] font-semibold mb-2">{item.title}</h3>
                            <p className="text-[#8A9E8A] text-sm leading-relaxed max-w-lg">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[#8A9E8A] text-sm mt-6 border-t border-[#2D5A3D]/20 pt-8 max-w-lg mx-auto">{t("prezentacja_s6_footer", "Płacisz zwykłym przelewem bankowym. My zadbaliśmy o resztę.")}</p>
        </div>
    </Section>
);

const S7 = ({ t }) => (
    <Section id="s7" className="py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
            <div className="mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s7_tag", "Zaufanie")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s7_title", "Transparentność to nie slogan.")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-8">
                    <h3 className="text-[#F5F0E8] font-semibold text-lg mb-6">{t("prezentacja_s7_card1_title", "Fakty i dowody")}</h3>
                    <ul className="space-y-4">
                        {[
                            t("prezentacja_s7_fact1", "Działka kupiona - Silna, Lubuskie"),
                            t("prezentacja_s7_fact2", "Spółka zarejestrowana - KRS 0001188626"),
                            t("prezentacja_s7_fact3", "Architekci podpisani - projekt w toku"),
                            t("prezentacja_s7_fact4", "Aplikacja działa - silna.club"),
                            t("prezentacja_s7_fact5", "Umowa w publicznym rejestrze cyfrowym — każda złotówka widoczna")
                        ].map((fact, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-[#8A9E8A]">
                                <span className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-green-400" /></span>
                                {fact}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-8">
                    <h3 className="text-[#F5F0E8] font-semibold text-lg mb-6">{t("prezentacja_s7_card2_title", "Zabezpieczenia Membera")}</h3>
                    <ul className="space-y-4">
                        {[
                            t("prezentacja_s7_safe1", "100% zwrot jeśli budowa nie dojdzie do skutku"),
                            t("prezentacja_s7_safe2", "Budowa startuje po potwierdzeniu 75 miejsc członkowskich (50%)"),
                            t("prezentacja_s7_safe3", "Każda złotówka widoczna w panelu społeczności"),
                            t("prezentacja_s7_safe4", "Karta Członkowska zbywalna — możesz sprzedać innemu kupującemu")
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-[#8A9E8A]">
                                <span className="w-5 h-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center shrink-0 mt-0.5"><Shield size={12} className="text-[#C9A84C]" /></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </Section>
);

const S9 = ({ t }) => {
    const stages = [
        { label: t("prezentacja_s9_stage1", "Działka kupiona"), status: "done", desc: t("prezentacja_s9_desc1", "2 530 m², Silna, Lubuskie") },
        { label: t("prezentacja_s9_stage2", "Spółka zarejestrowana"), status: "done", desc: t("prezentacja_s9_desc2", "KRS 0001188626, sierpień 2025") },
        { label: t("prezentacja_s9_stage3", "Aplikacja uruchomiona"), status: "done", desc: t("prezentacja_s9_desc3", "Mint, głosowania, paszporty") },
        { label: t("prezentacja_s9_stage4", "Projekt architektoniczny"), status: "active", desc: t("prezentacja_s9_desc4", "Architekci podpisani, projekt w toku") },
        { label: t("prezentacja_s9_stage5", "75 potwierdzonych członków (50%)"), status: "pending", desc: t("prezentacja_s9_desc5", "Start budowy resortu") },
        { label: t("prezentacja_s9_stage6", "Otwarcie Resortu"), status: "pending", desc: t("prezentacja_s9_desc6", "Po zakończeniu budowy") }
    ];
    const statusColors = { done: "bg-green-500/15 border-green-500/30 text-green-400", active: "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]", pending: "bg-[#1C2614]/40 border-[#2D5A3D]/30 text-[#8A9E8A]" };
    const statusIcons = { done: "✓", active: "◉", pending: "○" };

    return (
        <Section id="s9" className="py-20 md:py-32 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s9_tag", "Roadmapa")}</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s9_title", "Gdzie jesteśmy i co dalej")}</h2>
                </div>
                <div className="space-y-0 text-left max-w-lg mx-auto">
                    {stages.map((s, i) => (
                        <div key={i} className="flex gap-5 md:gap-8">
                            <div className="flex flex-col items-center shrink-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-bold ${statusColors[s.status]}`}>{statusIcons[s.status]}</div>
                                {i < stages.length - 1 && <div className={`w-px flex-1 my-1 min-h-[32px] ${s.status === "done" ? "bg-green-500/30" : "bg-[#2D5A3D]/30"}`} />}
                            </div>
                            <div className="pb-8">
                                <h3 className="text-[#F5F0E8] font-semibold mb-1">{s.label}</h3>
                                <p className="text-[#8A9E8A] text-sm">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

const S10 = ({ t }) => (
    <Section id="s10" className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mb-16">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s10_tag", "Alokacja")}</p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s10_title", "Gdzie idą Twoje wpłaty")}</h2>
            </div>
            <div className="space-y-6 mb-14 text-left">
                {[
                    { pct: 76, amount: "~19 684 PLN", label: t("prezentacja_s10_row1_label", "Budowa resortu"), desc: t("prezentacja_s10_row1_desc", "Materiały budowlane, robocizna, infrastruktura"), color: "bg-[#C9A84C]" },
                    { pct: 5, amount: "~1 295 PLN", label: t("prezentacja_s10_row2_label", "Fundusz remontowy wspólnoty"), desc: t("prezentacja_s10_row2_desc", "Twoje pieniądze na przyszłość resortu"), color: "bg-green-500" },
                    { pct: 19, amount: "~4 921 PLN", label: t("prezentacja_s10_row3_label", "Development i obsługa"), desc: t("prezentacja_s10_row3_desc", "Prawnik, marketing, wynagrodzenie foundera"), color: "bg-[#2D5A3D]" }
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-[#F5F0E8] text-sm font-medium">{item.label}</span>
                            <span className="text-[#C9A84C] text-xs font-bold">{item.pct}% · {item.amount}</span>
                        </div>
                        <div className="w-full h-2 bg-[#1C2614] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                        <p className="text-[#8A9E8A] text-xs mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-6">
                    <p className="text-[#8A9E8A] text-xs uppercase tracking-widest mb-3">{t("prezentacja_s10_card1_tag", "Profil Gościa (bezpłatny)")}</p>
                    <div className="font-playfair text-2xl text-[#F5F0E8] font-bold mb-1">{t("prezentacja_s10_card1_price", "Darmowy")}</div>
                    <p className="text-[#8A9E8A] text-sm mb-3">{t("prezentacja_s10_card1_count", "5 000 sztuk")}</p>
                    <p className="text-[#8A9E8A] text-xs">{t("prezentacja_s10_card1_desc", "Profil w społeczności. Dostęp do głosowań i informacji o projekcie.")}</p>
                </div>
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">{t("prezentacja_s10_card2_tag", "Karta Członkowska")}</p>
                    <div className="font-playfair text-2xl text-[#C9A84C] font-bold mb-1">25 900 PLN</div>
                    <p className="text-[#F5F0E8] text-sm mb-1">{t("prezentacja_s10_card2_count", "150 sztuk · Płatność w 5 etapach")}</p>
                    <p className="text-[#8A9E8A] text-xs">{t("prezentacja_s10_card2_desc", "Zaczynasz od 2000 PLN wpisowego (zwrotnego). Dożywotnie prawo do 14 nocy rocznie + głos w społeczności.")}</p>
                </div>
            </div>
        </div>
    </Section>
);

const S11 = ({ t }) => {
    const [openIdx, setOpenIdx] = useState(null);
    const faqs = [
        { q: t("prezentacja_s11_q1", "„Kiedy faktycznie powstanie resort i skąd mam wiedzieć, że nie za 10 lat?”"), a: t("prezentacja_s11_a1", "Mamy działkę, podpisanych architektów i wkrótce składamy wniosek o pozwolenie na budowę. Budowa startuje po spełnieniu dwóch warunków: pozwolenie na budowę + 100 podpisanych umów rezerwacyjnych. Termin graniczny to 30 października 2026 - jeśli do tego czasu oba warunki nie są spełnione, dostajesz zwrot 2 000 PLN bez żadnych potrąceń. Postęp projektu widzisz na bieżąco w aplikacji projektu, liczba rezerwacji i status pozwolenia aktualizowane co 30 dni.") },
        { q: t("prezentacja_s11_q2", "„Co się dzieje z moimi pieniędzmi jeśli nie zbierze się 150 osób?”"), a: t("prezentacja_s11_a2", "Etap 0 to 2 000 PLN i jest w 100% zwrotny. Zwrot następuje automatycznie w ciągu 14 dni roboczych jeśli do 30 września 2026 nie mamy 100 rezerwacji lub pozwolenia na budowę. Bez wniosków, bez tłumaczenia się, bez potrąceń. Etapy 1–4 startują gdy budowa rusza, bo płatność powiązana jest z konkretnymi etapami prac.") },
        { q: t("prezentacja_s11_q3", "„Ile realnie zapłacę przez 10/20 lat?”"), a: t("prezentacja_s11_a3", "Wejście płatne jednorazowo. Pobyt: ~567 PLN za tydzień dla 4 osób - tyle płacisz za prąd, wodę, jacuzzi i sprzątanie. Zero wysokich opłat rocznych gdy nie przyjeżdżasz. Przez 20 lat przy 2 tygodniach rocznie: 25 900 PLN + 26 680 PLN kosztów operacyjnych = ~52 580 PLN łącznie. Ten sam standard w hotelu: 5 600–8 000 PLN za tydzień × 40 tygodni = 224 000–320 000 PLN. Różnica: ~270 000 PLN zostaje w Twojej kieszeni. W hotelu pewnie wydasz jeszcze więcej bo inflacja.") },
        { q: t("prezentacja_s11_q4", "„Kto podejmuje decyzje i czy mój głos cokolwiek zmienia?”"), a: t("prezentacja_s11_a4", "Spółka zarządza operacyjnie - codzienne decyzje, dostawcy do 50 000 PLN, personel. Społeczność głosuje nad wszystkim co dotyczy Twoich pieniędzy i komfortu: zmiany kosztów operacyjnych, fundusz remontowy, zakup nowych działek, zmiany regulaminu. Działka nie może być sprzedana bez zgody 90% memberów. Każda transakcja z funduszu widoczna publicznie w panelu aplikacji. Głosowania mają charakter konsultacyjny - zarząd uwzględnia wynik, ale odpowiada prawnie za decyzje.") },
        { q: t("prezentacja_s11_q5", "„Co się dzieje z moim miejscem jeśli nie pojadę w danym roku?”"), a: t("prezentacja_s11_a5", "Masz trzy opcje. Pierwsza: rezerwujesz termin i jedziesz. Druga: udostępniasz swój termin Członkowi swojej rodziny. Trzecia: nie robisz nic -limit 14 nocy nie przenosi się na kolejny rok, ale też nic nie tracisz finansowo. Płacisz za pobyt tylko gdy faktycznie korzystasz.") }
    ];
    return (
        <Section id="s11" className="py-20 md:py-32 px-6">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">{t("prezentacja_s11_tag", "Obiekcje")}</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">{t("prezentacja_s11_title", "Odpowiedzi zanim zapytasz")}</h2>
                </div>
                <div className="space-y-3 text-left">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-[#2D5A3D]/30 rounded-xl overflow-hidden">
                            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1C2614]/30 transition-colors">
                                <span className="text-[#F5F0E8] text-sm md:text-base font-medium pr-4">{faq.q}</span>
                                {openIdx === i ? <Minus size={18} className="text-[#C9A84C] shrink-0" /> : <Plus size={18} className="text-[#8A9E8A] shrink-0" />}
                            </button>
                            {openIdx === i && <div className="px-5 pb-5 text-[#8A9E8A] text-sm leading-relaxed border-t border-[#2D5A3D]/20 pt-4">{faq.a}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

const S12 = ({ onConnect, t }) => {
    const activeMembers = 22;
    return (
        <Section id="s12" className="py-20 md:py-32 px-6">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] mb-4">
                    {t("prezentacja_s12_title", "Zostało {{left}} z 150 miejsc założycielskich.", { left: 150 - activeMembers })}
                </h2>
                <div className="w-full bg-[#1C2614] rounded-full h-3 mb-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/70 rounded-full transition-all duration-1000" style={{ width: `${(activeMembers / 150) * 100}%` }} />
                </div>
                <p className="text-[#8A9E8A] text-xs mb-10">{t("prezentacja_s12_stats", "{{active}} / 150 zajętych", { active: activeMembers })}</p>
                {onConnect && (
                    <div className="flex flex-col items-center gap-2 w-full px-4 md:px-0 mb-8 max-w-sm mx-auto">
                        <button onClick={() => onConnect(false)} className="px-6 py-4 w-full bg-[#C9A84C] hover:bg-[#b09342] text-[#0E1208] font-sans font-bold transition-all shadow-btn-primary flex items-center justify-center gap-2">
                            {t("prezentacja_hero_cta_join", "Dołącz za darmo")}
                        </button>
                        <button onClick={() => onConnect(true)} className="text-[#8A9E8A] text-xs text-center w-full mt-2 hover:text-[#C9A84C] transition-colors">
                            {t("prezentacja_hero_cta_login", "Masz już konto? Zaloguj się")}
                        </button>
                    </div>
                )}
                <p className="text-[#8A9E8A] text-xs">{t("prezentacja_s12_footer_contact", "Masz pytania?")} <a href="mailto:bartosz@silna.club" className="text-[#C9A84C] hover:underline">bartosz@silna.club</a></p>
            </div>
        </Section>
    );
};


/* ============================================================
   PREZENTACJA (MAIN COMPONENT)
   ============================================================ */
export default function Prezentacja({ onConnect }) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const sections = getSections(t);
    const [activeSection, setActiveSection] = useState("s1");
    const [leadForm, setLeadForm] = useState({ imie: "", telefon: "" });
    const [leadConsent, setLeadConsent] = useState(false);
    const [leadStatus, setLeadStatus] = useState(null);

    const handleLeadSubmit = async () => {
        if (!leadForm.imie || !leadForm.telefon || !leadConsent) return;

        // Walidacja numeru telefonu (9-12 cyfr, po oczyszczeniu ze spacji/znaków)
        const cleanedPhone = leadForm.telefon.replace(/\D/g, '');
        if (cleanedPhone.length < 9 || cleanedPhone.length > 12) {
            setLeadStatus('error');
            return;
        }

        setLeadStatus('submitting');
        try {
            const response = await fetch(`${API_BASE}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...leadForm, zrodlo: 'founder_section' })
            });
            setLeadStatus(response.ok ? 'success' : 'error');
        } catch (err) {
            console.error(err);
            setLeadStatus('error');
        }
    };

    useEffect(() => {
        let lastScrollTime = 0;
        const handleScroll = () => {
            const now = Date.now();
            if (now - lastScrollTime < 100) return; // Throttle to ~10fps for performance
            lastScrollTime = now;

            const sectionElements = sections.map(s => document.getElementById(s.id)).filter(Boolean);
            let current = activeSection;
            for (const section of sectionElements) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.45) current = section.id;
            }
            if (current !== activeSection) setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeSection]);

    return (
        <div className="bg-[#0E1208] min-h-screen text-[#F5F0E8] font-sans selection:bg-[#C9A84C]/30 relative">
            <title>Silna.club | {t("prezentacja_title", "Luksusowe Wakacje na Własność")}</title>
            <DotNav activeId={activeSection} sections={sections} />
            {onConnect && <StickyCTA onClick={() => onConnect(false)} t={t} />}

            <S1 onConnect={onConnect} t={t} />
            <S2 t={t} />
            <S3 t={t} />
            <S8 leadForm={leadForm} setLeadForm={setLeadForm} leadConsent={leadConsent} setLeadConsent={setLeadConsent} leadStatus={leadStatus} handleLeadSubmit={handleLeadSubmit} t={t} />
            <S4 t={t} />

            <S5 t={t} />
            <S6 t={t} />
            <S7 t={t} />
            <S9 t={t} />
            <S10 t={t} />
            <S11 t={t} />
            <S12 onConnect={onConnect} t={t} />
        </div>
    );
}
