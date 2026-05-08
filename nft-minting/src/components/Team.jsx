// src/components/Team.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronLeft, ChevronRight, Crown, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStatus } from "../hooks/useUserStatus";

const IPFS_BASE = "https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/";
const API_BASE = process.env.REACT_APP_API_BASE ?? "";

function formatDate(ts) {
    if (!ts) return "-";
    try {
        return new Date(Number(ts)).toLocaleDateString("pl-PL", { month: "short", year: "numeric" });
    } catch { return "-"; }
}

function MemberCard({ member, offset, onClick, isCenter }) {
    // offset: -2 .. 2 (0 = center)
    const absOff = Math.abs(offset);
    const scale = isCenter ? 1.08 : Math.max(0.68, 1 - absOff * 0.14);
    const rotateY = offset * 38;
    const translateX = offset * 58; // % shift
    const zIndex = 10 - absOff;
    const opacity = absOff > 2 ? 0 : Math.max(0.3, 1 - absOff * 0.28);

    // 3-tier logic
    const isActive = member.status === 'active' || member.tokenId <= 10; // Fallback or explicit
    const isReserved = member.status === 'reserved';
    const isPassport = !isActive && !isReserved;

    return (
        <div
            onClick={() => onClick && onClick()}
            style={{
                position: "absolute",
                left: "50%",
                transform: `translateX(calc(-50% + ${translateX}%)) scale(${scale}) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
                cursor: isCenter ? "default" : "pointer",
                width: "220px",
            }}
        >
            <div className={`relative rounded-3xl overflow-hidden border-2 shadow-2xl transition-all duration-500
        ${isActive
                    ? "border-gold-500 shadow-gold-500/30"
                    : isReserved
                        ? "border-gold-500/40 shadow-gold-500/10"
                        : "border-white/10 shadow-black/40"
                }
        bg-[#0d1117]`}
            >
                {/* Active Member Badge (Crown/Diamond) */}
                {isActive && (
                    <div className="absolute top-3 left-3 z-20 bg-gold-500 shadow-lg shadow-gold-500/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1">
                        <Crown size={10} className="text-forest-900" />
                        <span className="text-forest-900 text-[10px] font-black uppercase tracking-tighter">Member</span>
                    </div>
                )}

                {/* Reserved Badge */}
                {isReserved && (
                    <div className="absolute top-3 left-3 z-20 bg-gold-500/20 backdrop-blur-md border border-gold-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="text-gold-500 text-[9px] font-black uppercase tracking-tighter">Reserved</span>
                    </div>
                )}

                {/* Token badge */}
                <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    <span className={`${isActive ? "text-gold-500" : "text-neon-cyan"} font-mono font-bold text-xs`}>#{member.tokenId}</span>
                </div>

                {/* NFT Image */}
                <div className="aspect-square overflow-hidden">
                    <img
                        src={`${IPFS_BASE}${member.photoId}.webp`}
                        alt={member.memberName}
                        className={`w-full h-full object-cover ${isPassport ? "grayscale-[0.4] opacity-80" : ""}`}
                        loading="lazy"
                    />
                </div>

                {/* Info */}
                <div className={`p-4 ${isCenter ? "bg-gradient-to-t from-gold-500/5 to-transparent" : ""}`}>
                    <h3 className="text-white font-black text-lg truncate">{member.memberName || "Member"}</h3>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                            {isActive ? "Founder" : isReserved ? "Reserved" : "Passport"}
                        </span>
                        {isActive && <Star size={12} className="text-gold-500" />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Team({ hasNft: propHasNft, onNavigate }) {
    const navigate = useNavigate();
    const { isState3Member } = useUserStatus();
    const hasNft = propHasNft ?? isState3Member;

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    const handleNavigate = (tab) => {
        if (onNavigate) {
            onNavigate(tab);
        } else {
            // If on standalone /team page, go to main page with tab parameter
            navigate(`/?tab=${tab}`);
        }
    };

    useEffect(() => {
        fetch(`${API_BASE}/api/members/public`)
            .then(r => r.ok ? r.json() : [])
            .then(data => { setMembers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const next = useCallback(() => {
        setActive(a => (a + 1) % Math.max(members.length, 1));
    }, [members.length]);

    const prev = useCallback(() => {
        setActive(a => (a - 1 + Math.max(members.length, 1)) % Math.max(members.length, 1));
    }, [members.length]);

    // Auto-rotate
    useEffect(() => {
        if (members.length <= 1 || isPaused) return;
        intervalRef.current = setInterval(next, 3200);
        return () => clearInterval(intervalRef.current);
    }, [members.length, isPaused, next]);

    const visibleRange = 2; // cards visible each side

    return (
        <div className="w-full min-h-[70vh] py-12 px-4 select-none">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-14"
            >
                <div className="inline-flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/20 px-4 py-2 rounded-full text-neon-cyan text-sm font-bold mb-5">
                    <Users size={15} />
                    {loading ? "Ładowanie..." : `${members.length} Członków Klubu`}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                    Nasi <span className="text-neon-cyan">Klubowicze</span>
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed mb-4">
                    Pierwsi członkowie naszego nowoczesnego resortu wakacyjnego.
                    Każdy paszport to unikalny dostęp do ekskluzywnego klubu Silna.club.
                </p>
                <div className="flex justify-center items-center gap-2 opacity-50 group transition-opacity hover:opacity-100">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">On-chain identity</span>
                    <div className="h-px w-8 bg-gray-700" />
                    <a href="https://polygon.technology/" target="_blank" rel="noreferrer" className="text-[10px] text-neon-cyan/80 hover:text-neon-cyan font-bold uppercase tracking-widest flex items-center gap-1 transition-all">
                         Powered by Polygon
                    </a>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan" />
                </div>
            ) : members.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Brak członków do wyświetlenia</p>
                </div>
            ) : (
                <>
                    {/* 3D Coverflow Stage */}
                    <div
                        className="relative w-full overflow-hidden"
                        style={{ height: "420px", perspective: "1200px" }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {members.map((member, i) => {
                            const offset = i - active;
                            // wrap offset for infinite feel
                            let wrappedOffset = offset;
                            if (offset > members.length / 2) wrappedOffset = offset - members.length;
                            if (offset < -members.length / 2) wrappedOffset = offset + members.length;

                            if (Math.abs(wrappedOffset) > visibleRange) return null;

                            return (
                                <MemberCard
                                    key={member.tokenId}
                                    member={member}
                                    offset={wrappedOffset}
                                    isCenter={wrappedOffset === 0}
                                    onClick={() => wrappedOffset !== 0 && setActive(i)}
                                />
                            );
                        })}

                        {/* Nav Buttons */}
                        <button
                            onClick={prev}
                            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-md"
                        >
                            <ChevronLeft size={22} className="text-white" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full flex items-center justify-center transition-all hover:scale-110 backdrop-blur-md"
                        >
                            <ChevronRight size={22} className="text-white" />
                        </button>

                        {/* Reflection / floor fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-deep-black to-transparent pointer-events-none" />
                    </div>

                    {/* Dot indicators */}
                    <div className="flex justify-center gap-2 mt-8 flex-wrap">
                        {members.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`rounded-full transition-all ${i === active
                                    ? "w-6 h-2 bg-neon-cyan"
                                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Active member spotlight */}
                    <AnimatePresence mode="wait">
                        {members[active] && (
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="text-center mt-8"
                            >
                                <p className="text-2xl font-black text-white">{members[active].memberName}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Paszport NFT #{members[active].tokenId}
                                    {members[active].tokenId <= 10 && (
                                        <span className="ml-2 text-yellow-400 font-bold">⭐ Founding Member</span>
                                    )}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* All Members Grid (below fold) */}
                    <div className="mt-20">
                        {/* CTA Button based on NFT ownership */}
                        <div className="flex flex-col items-center mb-12">
                            <a
                                href="/checkout/stage/0"
                                style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '18px', padding: '16px 40px', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#B8973B'}
                                onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
                                className="flex items-center gap-2"
                            >
                                Zarezerwuj miejsce w projekcie - 2 000 PLN
                            </a>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(245, 240, 232, 0.60)', marginTop: '12px', textAlign: 'center', display: 'block' }}>
                                Rezerwacja w 100% zwrotna. Rezygnujesz kiedy chcesz.
                            </p>
                        </div>

                        <h2 className="text-2xl font-black text-white mb-8 text-center">
                            Wszyscy Członkowie <span className="text-gray-500 font-normal text-lg">({members.length})</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                            {members.map((member, i) => {
                                const isActive = member.status === 'active' || member.tokenId <= 10;
                                const isReserved = member.status === 'reserved';

                                return (
                                    <motion.div
                                        key={member.tokenId}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => setActive(i)}
                                        className={`bg-[#0d1117] border rounded-2xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-lg
                        ${isActive
                                                ? "border-gold-500 shadow-gold-500/10 hover:border-gold-500/80"
                                                : isReserved
                                                    ? "border-gold-500/30 hover:border-gold-500/60"
                                                    : "border-white/10 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="aspect-square overflow-hidden relative">
                                            <img
                                                src={`${IPFS_BASE}${member.photoId}.webp`}
                                                alt={member.memberName}
                                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!isActive && !isReserved ? "grayscale-0 opacity-90" : ""}`}
                                                loading="lazy"
                                            />
                                            {isActive && (
                                                <div className="absolute top-2 left-2 bg-gold-500 rounded-full p-1 shadow-lg">
                                                    <Crown size={8} className="text-forest-900" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="text-white font-bold text-sm truncate">{member.memberName || "Member"}</p>
                                            <p className={`${isActive ? "text-gold-500" : "text-gray-500"} font-mono text-[10px]`}>#{member.tokenId}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
