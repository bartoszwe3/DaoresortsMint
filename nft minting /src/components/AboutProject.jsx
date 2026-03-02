import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowRight, Star, Calendar, Home, Users, Vote } from "lucide-react";

/* ========================================================
   SVG COMPONENTS
======================================================== */

// A) 25 Stars Cabin
const CabinStarsSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto drop-shadow-[0_0_15px_rgba(42,169,255,0.3)]">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Connection Lines (Low opacity) */}
        <path
            d="M50 250 L100 150 L200 50 L300 150 L350 250 Z M100 250 L300 250"
            fill="none"
            stroke="#2AA9FF"
            strokeWidth="1"
            opacity="0.2"
        />

        {/* Stars - 25 points forming cabin shape */}
        {[
            // Roof Left
            [50, 250], [62, 225], [75, 200], [87, 175], [100, 150],
            // Roof Peak Left
            [125, 125], [150, 100], [175, 75], [200, 50],
            // Roof Peak Right
            [225, 75], [250, 100], [275, 125], [300, 150],
            // Roof Right
            [312, 175], [325, 200], [337, 225], [350, 250],
            // Base
            [100, 250], [140, 250], [180, 250], [220, 250], [260, 250], [300, 250],
            // Interior volume hints
            [150, 180], [250, 180], [200, 200]
        ].map((pos, i) => (
            <circle
                key={i}
                cx={pos[0]}
                cy={pos[1]}
                r={i % 5 === 0 ? 3 : 2}
                fill="#2AA9FF"
                className="star transition-all duration-300 hover:r-4 hover:fill-white cursor-pointer"
                filter="url(#glow)"
            />
        ))}
    </svg>
);

// B) Booking Flow SVG
const BookingFlowSVG = () => (
    <svg viewBox="0 0 600 120" className="w-full h-auto">
        {/* Step 1: 14 Days */}
        <g transform="translate(50, 60)">
            <circle cx="0" cy="0" r="40" fill="#0d1117" stroke="#2AA9FF" strokeWidth="2" opacity="0.8" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">14 DNI</text>
        </g>

        <path d="M100 60 L190 60" stroke="#2AA9FF" strokeWidth="1" strokeDasharray="5,5" markerEnd="url(#arrow)" opacity="0.5" />

        {/* Step 2: Lottery */}
        <g transform="translate(240, 60)">
            <rect x="-50" y="-30" width="100" height="60" rx="10" fill="#0d1117" stroke="#2AA9FF" strokeWidth="2" opacity="0.8" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">LOSOWANIE</text>
            <text x="0" y="25" textAnchor="middle" fill="#2AA9FF" fontSize="10">(High Season)</text>
        </g>

        <path d="M300 60 L390 60" stroke="#2AA9FF" strokeWidth="1" strokeDasharray="5,5" markerEnd="url(#arrow)" opacity="0.5" />

        {/* Step 3: Stay */}
        <g transform="translate(450, 60)">
            <circle cx="0" cy="0" r="40" fill="#2AA9FF" opacity="0.2" />
            <circle cx="0" cy="0" r="38" fill="none" stroke="#2AA9FF" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">POBYT</text>
        </g>

        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#2AA9FF" />
            </marker>
        </defs>
    </svg>
);

// C) Resort Layout SVG
const ResortLayoutSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-w-sm mx-auto opacity-90">
        {/* Ground */}
        <ellipse cx="200" cy="150" rx="190" ry="140" fill="#061f33" opacity="0.5" />

        {/* Cabins (6 small) */}
        {[
            [100, 80], [300, 80],
            [60, 150], [340, 150],
            [100, 220], [300, 220]
        ].map((pos, i) => (
            <g key={i} transform={`translate(${pos[0]}, ${pos[1]})`}>
                <rect x="-15" y="-15" width="30" height="30" fill="#0d1117" stroke="#2AA9FF" strokeWidth="2" rx="4" />
                <circle cx="0" cy="0" r="5" fill="#2AA9FF" opacity="0.5" />
            </g>
        ))}

        {/* Community House (Center Big) */}
        <g transform="translate(200, 150)">
            <rect x="-30" y="-30" width="60" height="60" fill="#2AA9FF" opacity="0.1" stroke="#2AA9FF" strokeWidth="2" rx="8" />
            <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">CLUB</text>
        </g>

        {/* Paths */}
        <path d="M200 120 L200 80 M200 180 L200 220 M170 150 L60 150 M230 150 L340 150 M120 90 L180 130 M280 90 L220 130 M120 210 L180 170 M280 210 L220 170"
            stroke="#2AA9FF" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
    </svg>
);


/* ========================================================
   CONTENT DATA
======================================================== */
const faqData = [
    { q: "Czy to inwestycja?", a: "Nie. To członkostwo wakacyjne z realną użytecznością. Nie obiecujemy zysków, dywidend ani wzrostu wartości. Wartością jest dostęp do resortu po kosztach operacyjnych." },
    { q: "Co jeśli nie mogę przyjechać w danym roku?", a: "Twoje dni nie przepadają (w zależności od ustaleń DAO) lub możesz udostępnić swój pobyt rodzinie/znajomym. Nie musisz być osobiście, o ile to Ty dokonujesz rezerwacji." },
    { q: "Jak działa losowanie?", a: "W sezonie wysokim (lipiec-sierpień, święta) chętnych może być więcej niż miejsc. Algorytm losuje pierwszeństwo. Osoby, które wylosowały pobyt w sezonie wysokim w jednym roku, w kolejnym mają niższy priorytet, aby każdy miał szansę." },
    { q: "Czy mogę sprzedać Paszport?", a: "Tak. Paszport jest tokenem NFT na Twoim portfelu. Możesz go odsprzedać na wolnym rynku (np. OpenSea), jeśli zechcesz zrezygnować z członkostwa. DAO może pobierać niewielką opłatę od transakcji na fundusz remontowy." },
    { q: "Co obejmuje „po kosztach”?", a: "Płacisz za media (prąd, woda), sprzątanie po pobycie, podatki od nieruchomości i bieżące utrzymanie części wspólnych. Nie płacisz marży hotelowej, która zwykle stanowi 50-70% ceny." },
    { q: "Jak DAO podejmuje decyzje?", a: "Każdy Paszport to jeden głos. Głosowania odbywają się on-chain (na blockchainie). Decydujemy o budżecie, nowych inwestycjach czy zmianach w regulaminie." },
    { q: "Co z remontami?", a: "Fundusz remontowy budowany jest z części opłat operacyjnych oraz royalty z odsprzedaży Paszportów. Decyzje o większych modernizacjach podejmuje społeczność." },
    { q: "Kiedy start?", a: "Obecnie trwa faza mintowania Paszportów i pozyskiwania gruntu. Budowa planowana jest po sprzedaży min. 80% Paszportów MVP." }
];

/* ========================================================
   MAIN COMPONENT
======================================================== */
export default function AboutProject() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

    return (
        <div className="w-full pb-24 text-white font-sans max-w-5xl mx-auto animate-in fade-in duration-700">

            {/* 1. HERO SECTION */}
            <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-12 md:py-20 mb-12">
                <div className="flex-1 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold leading-tight text-white"
                    >
                        Dożywotnie członkostwo. <br />
                        <span className="text-neon-cyan">Wakacje po kosztach.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/90 leading-relaxed"
                    >
                        Zamiast płacić hotelom marżę przez całe życie — współdzielisz dostęp do resortu i korzystasz po kosztach operacyjnych.
                        Resort tworzony i zarządzany przez społeczność.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pt-4"
                    >
                        <button className="px-8 py-3 bg-neon-cyan hover:bg-neon-blue text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(42,169,255,0.4)]">
                            Dołącz do Waitlisty
                        </button>
                    </motion.div>
                </div>

                <div className="flex-1 w-full max-w-sm relative">
                    <CabinStarsSVG />
                    <p className="text-center text-xs text-neon-cyan/60 mt-4 tracking-widest uppercase">25 gwiazd • 1 domek</p>
                </div>
            </section>

            {/* 2. NUMBERS ROW */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10 mb-20 bg-white/5 rounded-2xl p-8">
                {[
                    { label: "Domków (MVP)", val: "6" },
                    { label: "Paszportów na 150 członków", val: "150" },
                    { label: "Członków na domek", val: "25" },
                    { label: "Dni w roku", val: "14" }
                ].map((stat, i) => (
                    <div key={i} className="text-center space-y-1">
                        <div className="text-3xl md:text-4xl font-bold text-white">{stat.val}</div>
                        <div className="text-sm text-white/80 uppercase tracking-wide">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* 3. OVERVIEW & HOW IT WORKS */}
            <section className="mb-24 space-y-16">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl font-bold text-white">Resort Współwłasności</h2>
                    <p className="text-white text-lg">
                        DAOResorts to sieć resortów wakacyjnych współwłasnych przez ich członków.
                        Każdy członek posiada <span className="text-neon-cyan font-semibold">Paszport (NFT)</span>, który daje gwarantowany dostęp do pobytów oraz realny udział w decyzjach o przyszłości miejsca.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { step: "01", title: "Dołączasz", desc: "Kupujesz Paszport (NFT), który staje się Twoją cyfrową kartą członkowską." },
                        { step: "02", title: "Otrzymujesz Dni", desc: "Co roku masz zagwarantowane 14 dni pobytu w dowolnym domku." },
                        { step: "03", title: "Rezerwujesz", desc: "Wybierasz termin i płacisz tylko koszt sprzątania i mediów." }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#0d1117] border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-neon-cyan/30 transition-all">
                            <div className="text-6xl font-black text-white/5 absolute -top-4 -right-4 transition-transform group-hover:scale-110">{item.step}</div>
                            <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                            <p className="text-base text-white/90 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* RESORT SILNA — active project card */}
            <section className="mb-24">
                <div className="relative rounded-[2.5rem] overflow-hidden border border-neon-cyan/20 bg-[#0a0f1c] shadow-[0_0_80px_rgba(0,255,255,0.05)]">
                    {/* Top glow strip */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

                    <div className="p-8 md:p-12">
                        {/* Header row */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Aktywny
                            </span>
                            <span className="text-gray-500 text-sm font-medium">📍 Silna, Polska</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 items-start">
                            {/* Left: Text */}
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                                    Resort <span className="text-neon-cyan">Silna</span>
                                </h2>
                                <p className="text-white/70 text-base leading-relaxed mb-8">
                                    Ekskluzywny resort wakacyjny w malowniczej wsi Silna. Luksus w naturze z prywatnym dostępem do jeziora i zapierającymi dech widokami.
                                </p>

                                {/* Stat tiles */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {[
                                        { val: "6", label: "Domków 70m²" },
                                        { val: "150", label: "Paszportów na 150 członków" },
                                        { val: "14", label: "Nocy / rok" },
                                        { val: "3200m²", label: "Działka" },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
                                            <div className="text-2xl font-black text-white">{s.val}</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{s.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Feature list */}
                                <ul className="space-y-2">
                                    {[
                                        "Prywatne jacuzzi i ogrzewanie podłogowe w każdym domku",
                                        "Club House — wspólna restauracja i spotkania DAO",
                                        "Gęste lasy i bezpośrednia bliskość jeziora",
                                        "Energia: PV + Pompy ciepła (standard Premium 5★)",
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                                            <span className="mt-1 w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                            </span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right: NFT Tier cards */}
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Model Paszportów</p>
                                <div className="bg-gradient-to-br from-neon-cyan/10 to-transparent border border-neon-cyan/20 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-neon-cyan font-black text-base">Jeden standard — Member NFT</span>
                                        <span className="text-neon-cyan/70 text-xs font-bold bg-neon-cyan/10 px-2 py-1 rounded-full">150 szt.</span>
                                    </div>
                                    <p className="text-white/70 text-sm">Dożywotnie pobyty po kosztach, prawo głosu</p>
                                </div>
                                <div className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center">
                                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Standard</p>
                                    <p className="text-white font-bold">Premium ⭐⭐⭐⭐⭐</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="grid md:grid-cols-2 gap-12 items-center mb-24 bg-[#0a0f1c] rounded-[3rem] p-8 md:p-12 border border-white/5">
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-white">Model Członkostwa</h2>
                    <ul className="space-y-4 text-white">
                        <li className="flex gap-3 items-start"><Users className="text-neon-cyan shrink-0" size={20} /> 25 osób współdzieli jeden domek, co drastycznie obniża koszty wejścia.</li>
                        <li className="flex gap-3 items-start"><Home className="text-neon-cyan shrink-0" size={20} /> Nie jesteś przypisany do jednego domku — rezerwujesz dowolny dostępny w resorcie.</li>
                        <li className="flex gap-3 items-start"><ArrowRight className="text-neon-cyan shrink-0" size={20} /> Paszport możesz w każdej chwili sprzedać lub przekazać rodzinie.</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-12 mb-6 text-white">Logika Rezerwacji</h2>
                    <p className="text-base text-white/80 mb-4">
                        System zaprojektowany pod uczciwość — nie „kto pierwszy, ten lepszy”.
                    </p>
                    <ul className="space-y-3 text-white text-sm">
                        <li className="pl-4 border-l-2 border-neon-cyan">
                            <strong className="text-white block mb-1">Sezon Wysoki (Losowanie)</strong>
                            Terminy są przydzielane przez algorytm. Jeśli byłeś w lipcu w tym roku, w przyszłym masz niższy priorytet, by inni też skorzystali.
                        </li>
                        <li className="pl-4 border-l-2 border-white/20">
                            <strong className="text-white block mb-1">Poza Sezonem (Free Booking)</strong>
                            Swobodna rezerwacja dostępnych terminów (First Come, First Served).
                        </li>
                    </ul>
                </div>
                <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                    <BookingFlowSVG />
                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-xs text-gray-500 uppercase mb-2">Struktura MVP</p>
                        <ResortLayoutSVG />
                        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-cyan"></span> 6 Domków</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-neon-cyan/20 border border-neon-cyan"></span> Club House</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. DAO & MVP */}
            <section className="mb-24 grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-[#0d1117] to-black border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                        <Vote className="text-neon-purple" /> DAO Governance
                    </h3>
                    <p className="text-white/90 mb-6 text-base">
                        To nie jest zwykły timeshare. Tutaj społeczność ma głos.
                    </p>
                    <ul className="space-y-2 text-base text-white">
                        <li>• Decyzje o zakupie kolejnych działek</li>
                        <li>• Standard wykończenia i wyposażenia (np. sauna vs jacuzzi)</li>
                        <li>• Zasady rezerwacji i regulamin</li>
                    </ul>
                    <div className="mt-6 inline-block px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg text-xs font-bold border border-neon-purple/20">
                        1 Paszport = 1 Głos
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#0d1117] to-black border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-white">
                        <Home className="text-neon-cyan" /> MVP Resort Spec
                    </h3>
                    <ul className="space-y-3 text-base text-white">
                        <li className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span>Liczba domków</span>
                            <span className="text-white font-mono">6</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span>Community House</span>
                            <span className="text-white font-mono">1 (Bufet/Cowork)</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span>Standard</span>
                            <span className="text-white font-mono">Premium + Jacuzzi</span>
                        </li>
                        <li className="flex items-center justify-between pb-2">
                            <span>Śniadania</span>
                            <span className="text-white font-mono">Po kosztach ("at cost")</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="max-w-3xl mx-auto mb-20">
                <h2 className="text-3xl font-bold text-center mb-10 text-white">Częste Pytania</h2>
                <div className="space-y-4">
                    {faqData.map((item, i) => (
                        <div key={i} className="border border-white/10 rounded-2xl bg-[#0a0f1c] overflow-hidden">
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-semibold text-white text-lg">{item.q}</span>
                                {openFaq === i ? <ChevronUp className="text-neon-cyan" /> : <ChevronDown className="text-white" />}
                            </button>
                            {openFaq === i && (
                                <div className="px-6 pb-6 text-white/90 text-base leading-relaxed border-t border-white/5 pt-4">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. CTA & DISCLAIMER */}
            <div className="text-center space-y-8">
                <h2 className="text-4xl font-bold text-white">Rozpocznij swoje wakacje.</h2>
                <div className="flex justify-center gap-4">
                    <button className="px-8 py-4 bg-neon-cyan text-black font-bold rounded-xl transition-transform hover:scale-105 shadow-lg shadow-neon-cyan/20">
                        Kup Paszport
                    </button>
                    <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                        Join Discord
                    </button>
                </div>

                <div className="mt-16 pt-12 border-t border-white/10 max-w-2xl mx-auto">
                    <p className="text-xs text-white/60 leading-relaxed uppercase tracking-wide">
                        DISCLAIMER
                    </p>
                    <p className="text-xs text-white/80 mt-2">
                        To nie jest produkt inwestycyjny ani obietnica zysku.
                        To członkostwo z realną użytecznością (dostęp do pobytu) oraz udziałem w decyzjach społeczności.
                        Wartość Paszportu wynika z użyteczności, a nie spekulacji.
                    </p>
                </div>
            </div>

        </div>
    );
}
