import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, Share2, Check, Shield, Vote, Key, Calendar, Users, Home, ArrowRight, ChevronRight, Minus, Plus } from "lucide-react";

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
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration, startOnView, isInView]);

    return count;
}

/* ================================================================
   SECTION WRAPPER - fade-in on scroll
   ================================================================ */
function Section({ id, children, className = "" }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div
            id={id}
            ref={ref}
            className={`relative scroll-mt-20 block ${className}`}
        >
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

/* ================================================================
   DOT NAV - fixed vertical progress dots (left side)
   ================================================================ */
const SECTIONS = [
    { id: "s1", label: "Hook" },
    { id: "s2", label: "Problem" },
    { id: "s3", label: "Rozwiązanie" },
    { id: "s4", label: "Matematyka" },
    { id: "s5", label: "Resort" },
    { id: "s6", label: "Jak to działa" },
    { id: "s7", label: "Zaufanie" },
    { id: "s8", label: "Założyciel" },
    { id: "s9", label: "Roadmapa" },
    { id: "s10", label: "Tokenomika" },
    { id: "s11", label: "FAQ" },
    { id: "s12", label: "Dołącz" },
];

function DotNav({ activeId }) {
    return (
        <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
            {SECTIONS.map((s) => (
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

/* ================================================================
   SHARE BUTTON - copies link to clipboard
   ================================================================ */
function ShareButton() {
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
            {copied ? "Skopiowano" : "Udostępnij"}
        </button>
    );
}

/* ================================================================
   COUNTER CARD - animated number on scroll
   ================================================================ */
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

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function Prezentacja() {
    const [activeSection, setActiveSection] = useState("s1");

    /* Scroll Listener for dot-nav */
    useEffect(() => {
        const handleScroll = () => {
            const sections = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
            let current = activeSection;

            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                // If the top of the section is above 40% of the viewport height, consider it active
                if (rect.top <= window.innerHeight * 0.45) {
                    current = section.id;
                }
            }

            if (current !== activeSection) {
                setActiveSection(current);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeSection]);

    /* ============================================================
       SECTION 1 - HOOK
       ============================================================ */
    const S1 = () => (
        <div id="s1" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            {/* Background video */}
            <video
                src="/silnawebvideo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0E1208]/70 via-[#0E1208]/50 to-[#0E1208]" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F0E8] leading-tight mb-6"
                >
                    Hotele zarabiają na Tobie.{" "}
                    <span className="text-[#C9A84C]">Czas to zmienić.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-lg md:text-xl text-[#F5F0E8]/80 mb-10 max-w-2xl mx-auto"
                >
                    Jeden token. 14 nocy rocznie. Dożywotnio po kosztach.
                </motion.p>

                {/* Two hero numbers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12"
                >
                    <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl px-8 py-5">
                        <div className="font-playfair text-2xl md:text-3xl text-[#C9A84C] font-bold">2 000 PLN</div>
                        <div className="text-[#F5F0E8]/70 text-sm mt-1">rezerwacja miejsca</div>
                    </div>
                    <div className="bg-[#1C2614]/80 border border-[#2D5A3D]/40 rounded-xl px-8 py-5">
                        <div className="font-playfair text-2xl md:text-3xl text-[#F5F0E8] font-bold">~316 000 PLN</div>
                        <div className="text-[#8A9E8A] text-sm mt-1">oszczędności przez 20 lat</div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <ChevronDown size={28} className="text-[#C9A84C]/60" />
            </motion.div>
        </div>
    );

    /* ============================================================
       SECTION 2 - PROBLEM
       ============================================================ */
    const S2 = () => (
        <Section id="s2" className="py-20 md:py-32 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">
                        Problem
                    </p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] mb-4">
                        Ile naprawdę kosztują Twoje wakacje?
                    </h2>
                    <p className="text-[#8A9E8A] text-base md:text-lg max-w-2xl mx-auto">
                        Hotel premium z jacuzzi: 5 600 PLN za tydzień, czyli 11 200 PLN za 14 nocy rocznie przez 20 lat. Policz sam.
                    </p>
                </div>

                {/* Counter cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                    <CounterCard
                        value={224000}
                        suffix=" PLN"
                        label="Koszty hotelowe"
                        sublabel="11 200 PLN/rok × 20 lat"
                    />
                    <CounterCard
                        value={146000}
                        prefix="+"
                        suffix=" PLN"
                        label="Inflacja hotelowa"
                        sublabel="5% wzrostu cen rocznie"
                    />
                    <CounterCard
                        value={370000}
                        suffix=" PLN"
                        label="Łączny wydatek"
                        sublabel="Twoje 20 lat wakacji premium"
                        accent
                    />
                </div>

                {/* What you get for that money */}
                <div className="bg-[#0E1208] border border-[#2D5A3D]/30 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left - what you pay */}
                        <div>
                            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">Co płacisz</p>
                            <div className="font-playfair text-4xl text-[#F5F0E8] font-bold mb-2">375 000 PLN</div>
                            <p className="text-[#8A9E8A] text-sm">przez 20 lat na hotele premium</p>
                        </div>
                        {/* Right - what you get */}
                        <div>
                            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">Co dostajesz</p>
                            <ul className="space-y-3">
                                {[
                                    "Zero własności",
                                    "Zero wpływu na jakość",
                                    "Zero kontroli nad ceną",
                                    "Zdjęcia na Instagramie"
                                ].map((item, i) => (
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

    /* ============================================================
       SECTION 3 - ROZWIĄZANIE
       ============================================================ */
    const S3 = () => (
        <Section id="s3" className="py-20 md:py-32 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Rozwiązanie</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] mb-4">
                        Płacisz raz. Korzystasz <span className="text-[#C9A84C]">dożywotnio.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Key size={28} className="text-[#C9A84C]" />,
                            title: "Płacisz raz",
                            desc: "19 990 PLN jednorazowo. Żadnych rocznych opłat członkowskich. Żadnych ukrytych kosztów wejścia.",
                        },
                        {
                            icon: <Home size={28} className="text-[#C9A84C]" />,
                            title: "Korzystasz po kosztach",
                            desc: "~692 PLN za tydzień zamiast 5 600 PLN w hotelu. Płacisz tylko realne koszty mediów i sprzątania.",
                        },
                        {
                            icon: <Shield size={28} className="text-[#C9A84C]" />,
                            title: "Jesteś właścicielem",
                            desc: "Token to Twój cyfrowy akt prawa do korzystania. Możesz go sprzedać, przekazać rodzinie lub zachować na zawsze.",
                        },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-8 hover:border-[#C9A84C]/30 transition-colors"
                        >
                            <div className="mb-5">{card.icon}</div>
                            <h3 className="font-playfair text-xl text-[#F5F0E8] font-semibold mb-3">{card.title}</h3>
                            <p className="text-[#8A9E8A] text-sm leading-relaxed text-left">{card.desc}</p>
                        </div>
                    ))}
                </div>

                <p className="text-center text-[#8A9E8A] text-sm mt-10 max-w-xl mx-auto">
                    Unikamy słowa „inwestycja" - bo to nie jest inwestycja. To członkostwo z realną użytecznością i fizycznym resortem.
                </p>
            </div>
        </Section>
    );

    /* ============================================================
       SECTION 4 - MATEMATYKA
       ============================================================ */
    const S4 = () => (
        <Section id="s4" className="py-20 md:py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Matematyka</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                        Liczby mówią same za siebie.
                    </h2>
                </div>

                {/* Comparison table */}
                <div className="overflow-x-auto mb-10">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-[#2D5A3D]/40">
                                <th className="py-4 px-4 text-[#8A9E8A] uppercase tracking-widest text-xs font-normal">Przez 20 lat</th>
                                <th className="py-4 px-4 text-[#8A9E8A] uppercase tracking-widest text-xs font-normal text-right">Hotel premium</th>
                                <th className="py-4 px-4 text-[#C9A84C] uppercase tracking-widest text-xs font-normal text-right">DAOResorts</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#F5F0E8]">
                            {[
                                ["Koszt jednorazowy", "0 PLN", "19 990 PLN"],
                                ["Koszt rocznie (dziś)", "11 200 PLN", "1 384 PLN"],
                                ["Łącznie 20 lat z inflacją", "~370 000 PLN", "~53 590 PLN"],
                            ].map(([label, hotel, dao], i) => (
                                <tr key={i} className="border-b border-[#2D5A3D]/20">
                                    <td className="py-4 px-4 text-[#8A9E8A]">{label}</td>
                                    <td className="py-4 px-4 text-right">{hotel}</td>
                                    <td className="py-4 px-4 text-right text-[#C9A84C] font-medium">{dao}</td>
                                </tr>
                            ))}
                            <tr className="border-b border-[#C9A84C]/30">
                                <td className="py-4 px-4 text-[#F5F0E8] font-semibold">Oszczędność</td>
                                <td className="py-4 px-4 text-right text-[#8A9E8A]">-</td>
                                <td className="py-4 px-4 text-right text-[#C9A84C] font-bold text-lg">~316 000 PLN</td>
                            </tr>
                            <tr className="border-b border-[#2D5A3D]/20">
                                <td className="py-4 px-4 text-[#8A9E8A]">Własność</td>
                                <td className="py-4 px-4 text-right text-red-400">✕</td>
                                <td className="py-4 px-4 text-right text-green-400">✓</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4 text-[#8A9E8A]">Prawo głosu</td>
                                <td className="py-4 px-4 text-right text-red-400">✕</td>
                                <td className="py-4 px-4 text-right text-green-400">✓</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-6 text-center">
                    <p className="text-[#F5F0E8] text-base md:text-lg">
                        Token zwraca się po <span className="text-[#C9A84C] font-bold">1.3 sezonie</span>. Reszta to czyste oszczędności.
                    </p>
                </div>
            </div>
        </Section>
    );

    /* ============================================================
       SECTION 5 - RESORT
       ============================================================ */
    const S5 = () => (
        <Section id="s5" className="py-20 md:py-32 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Resort</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                        Silna, Lubuskie
                    </h2>
                    <p className="text-[#8A9E8A] text-base mt-4 max-w-2xl mx-auto">
                        Działka 2 530 m² w lesie przy jeziorze Pszczewskim. 6 domków premium z prywatnym jacuzzi. 7. budynek operacyjny z salą kinową, pokojem gier i pralnią.
                    </p>
                </div>

                {/* Video / visual block */}
                <div className="relative rounded-3xl overflow-hidden mb-10 aspect-video border border-[#2D5A3D]/30">
                    <video
                        src="/silnawebvideo.mp4"
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1208]/80 to-transparent" />
                </div>

                {/* Quote */}
                <blockquote className="text-center max-w-2xl mx-auto mb-14">
                    <p className="font-playfair text-2xl md:text-3xl text-[#F5F0E8] italic leading-relaxed">
                        „6 domków. 150 rodzin. Las. Jacuzzi. <span className="text-[#C9A84C]">Twoje.</span>"
                    </p>
                </blockquote>

                {/* Feature grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { val: "70 m²", label: "Powierzchnia domku" },
                        { val: "2", label: "Sypialnie w domku" },
                        { val: "Jacuzzi", label: "Na tarasie każdego domku" },
                        { val: "200A", label: "Przyłącze trójfazowe" },
                    ].map((f, i) => (
                        <div key={i} className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-xl p-5 text-center">
                            <div className="font-playfair text-xl text-[#C9A84C] font-bold">{f.val}</div>
                            <div className="text-[#8A9E8A] text-xs mt-1 uppercase tracking-wide">{f.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );

    /* ============================================================
       SECTION 6 - JAK TO DZIAŁA
       ============================================================ */
    const S6 = () => (
        <Section id="s6" className="py-20 md:py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Mechanizm</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                        4 kroki do Twoich wakacji
                    </h2>
                </div>

                <div className="space-y-0 text-left">
                    {[
                        {
                            step: "01",
                            icon: <Users size={24} />,
                            title: "Odbierz darmowy Paszport",
                            desc: "Rejestracja emailem. Zero portfela krypto - logowanie przez Magic Link jak w każdej nowoczesnej aplikacji.",
                        },
                        {
                            step: "02",
                            icon: <Key size={24} />,
                            title: "Zarezerwuj członkostwo",
                            desc: "2000 PLN wpisowego. Zabezpieczasz swoje miejsce w pierwszym etapie. Kolejne wpłaty wraz z postępem budowy.",
                        },
                        {
                            step: "03",
                            icon: <Calendar size={24} />,
                            title: "Rezerwuj domek",
                            desc: "Przez aplikację DAOResorts. 14 nocy rocznie w dowolnym dostępnym terminie. Płacisz tylko koszty operacyjne.",
                        },
                        {
                            step: "04",
                            icon: <Vote size={24} />,
                            title: "Głosuj i współdecyduj",
                            desc: "Każdy token = 1 głos. Decyduj o budżecie, modernizacjach i zasadach. To Twój resort.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-6 md:gap-8">
                            {/* Timeline line */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
                                    {item.icon}
                                </div>
                                {i < 3 && <div className="w-px flex-1 bg-[#2D5A3D]/40 my-2 min-h-[40px]" />}
                            </div>
                            {/* Content */}
                            <div className="pb-10">
                                <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">Krok {item.step}</p>
                                <h3 className="font-playfair text-xl text-[#F5F0E8] font-semibold mb-2">{item.title}</h3>
                                <p className="text-[#8A9E8A] text-sm leading-relaxed max-w-lg">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-[#8A9E8A] text-sm mt-6 border-t border-[#2D5A3D]/20 pt-8 max-w-lg mx-auto">
                    Nie musisz znać się na kryptowalutach. My zadbaliśmy o resztę.
                </p>
            </div>
        </Section>
    );

    /* ============================================================
       SECTION 7 - TRUST
       ============================================================ */
    const S7 = () => (
        <Section id="s7" className="py-20 md:py-32 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Zaufanie</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                        Transparentność to nie slogan.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left - hard facts */}
                    <div className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-8 text-left">
                        <h3 className="text-[#F5F0E8] font-semibold text-lg mb-6">Fakty i dowody</h3>
                        <ul className="space-y-4">
                            {[
                                "Działka kupiona - Silna, Lubuskie",
                                "Spółka zarejestrowana - KRS 0001188626",
                                "Architekci podpisani - projekt w toku",
                                "Aplikacja działa - daoresorts.club",
                                "Smart Contract na Polygon - publiczny i weryfikowalny",
                            ].map((fact, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-[#8A9E8A]">
                                    <span className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check size={12} className="text-green-400" />
                                    </span>
                                    {fact}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right - guarantees */}
                    <div className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-8 text-left">
                        <h3 className="text-[#F5F0E8] font-semibold text-lg mb-6">Zabezpieczenia Membera</h3>
                        <ul className="space-y-4">
                            {[
                                "100% zwrot jeśli budowa nie dojdzie do skutku",
                                "Budowa startuje po sprzedaży 50% tokenów (75 szt.)",
                                "Każda złotówka widoczna w panelu DAO",
                                "Token transferowalny - możesz sprzedać na rynku wtórnym",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-[#8A9E8A]">
                                    <span className="w-5 h-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center shrink-0 mt-0.5">
                                        <Shield size={12} className="text-[#C9A84C]" />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Section>
    );

    /* ============================================================
       SECTION 8 - FOUNDER
       ============================================================ */
    const S8 = () => (
        <Section id="s8" className="py-20 md:py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Założyciel</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                        Człowiek za projektem
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 bg-[#1C2614]/30 border border-[#2D5A3D]/30 rounded-2xl p-8 md:p-10">
                    <img
                        src="/Bartoszzdjecie.jpeg"
                        alt="Bartosz Zniszczoł"
                        className="w-40 h-40 md:w-52 md:h-52 rounded-2xl object-cover border border-[#2D5A3D] shrink-0"
                    />
                    <div className="text-left">
                        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">Założyciel DAOResorts</p>
                        <h3 className="font-playfair text-2xl md:text-3xl text-[#F5F0E8] mb-2">Bartosz Zniszczoł</h3>
                        <p className="text-[#8A9E8A] text-xs mb-4">WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</p>

                        <blockquote className="border-l-4 border-[#C9A84C] pl-4 mb-5">
                            <p className="font-playfair text-lg text-[#F5F0E8] italic">
                                „Szukałem miejsca gdzie mógłbym wypoczywać bez przepłacania hotelom. Bez wydawania 500 tys pln na dom wakacyjny, Nie znalazłem, więc postanowiłem je zbudować”
                            </p>
                        </blockquote>

                        <p className="text-[#8A9E8A] text-sm leading-relaxed mb-5">
                            Buduję transparentną i elitarną społeczność wokół pierwszej w Polsce wioski turystycznej zaprojektowanej pod nowoczesne standardy.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer"
                                className="border border-[#C9A84C] text-[#C9A84C] px-4 py-2 rounded-md text-xs hover:bg-[#C9A84C] hover:text-[#0E1208] transition-all">
                                LinkedIn
                            </a>
                            <a href="https://twitter.com/" target="_blank" rel="noreferrer"
                                className="border border-[#2D5A3D] text-[#8A9E8A] px-4 py-2 rounded-md text-xs hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
                                X / Twitter
                            </a>
                            <a href="mailto:bartosz@daoresorts.club"
                                className="border border-[#2D5A3D] text-[#8A9E8A] px-4 py-2 rounded-md text-xs hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
                                bartosz@daoresorts.club
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );

    /* ============================================================
       SECTION 9 - ROADMAPA
       ============================================================ */
    const S9 = () => {
        const stages = [
            { label: "Działka kupiona", status: "done", desc: "2 530 m², Silna, Lubuskie" },
            { label: "Spółka zarejestrowana", status: "done", desc: "KRS 0001188626, sierpień 2025" },
            { label: "Aplikacja uruchomiona", status: "done", desc: "Mint, głosowania, paszporty" },
            { label: "Projekt architektoniczny", status: "active", desc: "Architekci podpisani, projekt w toku" },
            { label: "Sprzedaż 75 tokenów (50%)", status: "pending", desc: "Start budowy resortu" },
            { label: "Otwarcie Resortu", status: "pending", desc: "Po zakończeniu budowy" },
        ];

        const statusColors = {
            done: "bg-green-500/15 border-green-500/30 text-green-400",
            active: "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]",
            pending: "bg-[#1C2614]/40 border-[#2D5A3D]/30 text-[#8A9E8A]",
        };
        const statusIcons = { done: "✓", active: "◉", pending: "○" };

        return (
            <Section id="s9" className="py-20 md:py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Roadmapa</p>
                        <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                            Gdzie jesteśmy i co dalej
                        </h2>
                    </div>

                    <div className="space-y-0 text-left">
                        {stages.map((s, i) => (
                            <div key={i} className="flex gap-5 md:gap-8">
                                <div className="flex flex-col items-center shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border text-sm font-bold ${statusColors[s.status]}`}>
                                        {statusIcons[s.status]}
                                    </div>
                                    {i < stages.length - 1 && (
                                        <div className={`w-px flex-1 my-1 min-h-[32px] ${s.status === "done" ? "bg-green-500/30" : "bg-[#2D5A3D]/30"}`} />
                                    )}
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

    /* ============================================================
       SECTION 10 - TOKENOMIKA
       ============================================================ */
    const S10 = () => (
        <Section id="s10" className="py-20 md:py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Tokenomika</p>
                    <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                        Gdzie idą Twoje wpłaty
                    </h2>
                </div>

                {/* Allocation bars (simpler than pie chart, more elegant) */}
                <div className="space-y-6 mb-14 text-left">
                    {[
                        { pct: 70, amount: "~13 993 PLN", label: "Budowa resortu", desc: "Materiały budowlane, robocizna, infrastruktura", color: "bg-[#C9A84C]" },
                        { pct: 15, amount: "~2 999 PLN", label: "Fundusz remontowy DAO", desc: "Twoje pieniądze na przyszłość resortu", color: "bg-green-500" },
                        { pct: 15, amount: "~2 999 PLN", label: "Development i obsługa", desc: "Prawnik, marketing, wynagrodzenie foundera", color: "bg-[#2D5A3D]" },
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

                {/* Token cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-[#1C2614]/40 border border-[#2D5A3D]/30 rounded-2xl p-6">
                        <p className="text-[#8A9E8A] text-xs uppercase tracking-widest mb-3">Paszport NFT</p>
                        <div className="font-playfair text-2xl text-[#F5F0E8] font-bold mb-1">Darmowy</div>
                        <p className="text-[#8A9E8A] text-sm mb-3">5 000 sztuk</p>
                        <p className="text-[#8A9E8A] text-xs">Profil w społeczności. Dostęp do głosowań i informacji o projekcie.</p>
                    </div>
                    <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6">
                        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Token Członkowski</p>
                        <div className="font-playfair text-2xl text-[#C9A84C] font-bold mb-1">19 990 PLN</div>
                        <p className="text-[#F5F0E8] text-sm mb-1">150 sztuk · Płatność w 5 etapach</p>
                        <p className="text-[#8A9E8A] text-xs">Zaczynasz od 2000 PLN wpisowego (zwrotnego). Dożywotnie prawo do 14 nocy rocznie + głos w DAO.</p>
                    </div>
                </div>
            </div>
        </Section>
    );

    /* ============================================================
       SECTION 11 - FAQ OBIEKCJI
       ============================================================ */
    const S11 = () => {
        const [openIdx, setOpenIdx] = useState(null);
        const faqs = [
            {
                q: `„To jest scam NFT jak wszystkie inne”`,
                a: "Rozumiemy sceptycyzm. Dlatego: spółka z KRS, działka w księdze wieczystej, 100% zwrot jeśli nie budujemy. Sprawdź numer KRS 0001188626 w rejestrze KRS online - to publiczna informacja.",
            },
            {
                q: `„Co jeśli spółka zbankrutuje?”`,
                a: "Token jest Twój - zapisany na blockchain niezależnie od spółki. Działka jest zabezpieczeniem. Przy nieosiągnięciu progu budowy (75 tokenów) - 100% zwrot środków.",
            },
            {
                q: `„Nie znam się na kryptowalutach”`,
                a: "Nie musisz. Logowanie emailem, płatność kartą lub przelewem. Token to Twój cyfrowy dokument prawa do korzystania - jak akt notarialny, tylko nowocześniejszy i niezmienny.",
            },
            {
                q: `„14 nocy to mało”`,
                a: `14 nocy × 6 osób = 84 osobodoby rocznie. Przy cenie hotelu 800 PLN/noc to 67 200 PLN wartości. Ty płacisz ~692 PLN za tydzień. To nie „mało” - to matematyka.`,
            },
            {
                q: `„A co jeśli chcę sprzedać?”`,
                a: "Token jest transferowalny. Możesz sprzedać na rynku wtórnym (OpenSea i inne platformy). 10% od wtórnej sprzedaży trafia do funduszu DAO. Wartość po otwarciu resortu - rynek decyduje.",
            },
        ];

        return (
            <Section id="s11" className="py-20 md:py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[#C9A84C] text-xs uppercase tracking-[0.25em] mb-4">Obiekcje</p>
                        <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8]">
                            Odpowiedzi zanim zapytasz
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-[#2D5A3D]/30 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1C2614]/30 transition-colors"
                                >
                                    <span className="text-[#F5F0E8] text-sm md:text-base font-medium pr-4">{faq.q}</span>
                                    {openIdx === i ? <Minus size={18} className="text-[#C9A84C] shrink-0" /> : <Plus size={18} className="text-[#8A9E8A] shrink-0" />}
                                </button>
                                {openIdx === i && (
                                    <div className="px-5 pb-5 text-[#8A9E8A] text-sm leading-relaxed border-t border-[#2D5A3D]/20 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        );
    };

    /* ============================================================
       SECTION 12 - CTA
       ============================================================ */
    const activeMembers = 0; // Will be fetched from contract in the future

    const S12 = () => (
        <Section id="s12" className="py-20 md:py-32 px-6">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] mb-4">
                    Zostało <span className="text-[#C9A84C]">{150 - activeMembers}</span> z 150 miejsc założycielskich.
                </h2>
                <p className="text-[#8A9E8A] text-base mb-8">
                    Cena w Etapie 2 będzie wyższa. Founder price tylko teraz.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-[#1C2614] rounded-full h-3 mb-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/70 rounded-full transition-all duration-1000"
                        style={{ width: `${(activeMembers / 150) * 100}%` }}
                    />
                </div>
                <p className="text-[#8A9E8A] text-xs mb-10">
                    {activeMembers} / 150 zajętych
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <a
                        href="/"
                        className="bg-[#C9A84C] text-[#0E1208] font-bold px-8 py-4 rounded-xl transition-transform hover:scale-105 shadow-[0_0_20px_rgba(201,168,76,0.2)] flex items-center justify-center gap-2"
                    >
                        Odbierz darmowy Paszport <ArrowRight size={18} />
                    </a>
                    <a
                        href="/checkout/stage/0"
                        className="border border-[#C9A84C] text-[#C9A84C] font-bold px-8 py-4 rounded-xl hover:bg-[#C9A84C] hover:text-[#0E1208] transition-all flex items-center justify-center"
                    >
                        Zarezerwuj członkostwo - 2000 PLN
                    </a>
                </div>

                <p className="text-[#8A9E8A] text-xs">
                    Masz pytania?{" "}
                    <a href="mailto:bartosz@daoresorts.club" className="text-[#C9A84C] hover:underline">
                        bartosz@daoresorts.club
                    </a>
                </p>
            </div>
        </Section>
    );

    /* ============================================================
       RENDER
       ============================================================ */
    return (
        <main className="bg-[#0E1208] min-h-screen text-[#8A9E8A] text-center">
            <DotNav activeId={activeSection} />
            <ShareButton />

            <S1 />
            <S2 />
            <S3 />
            <S4 />
            <S5 />
            <S6 />
            <S7 />
            <S8 />
            <S9 />
            <S10 />
            <S11 />
            <S12 />

            {/* Footer spacer */}
            <div className="h-20" />
        </main>
    );
}
