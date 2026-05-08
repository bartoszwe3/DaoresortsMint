import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ExternalLink } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export default function StepPassportGallery({ firstName }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/members/public`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMembers(data);
                }
            } catch (e) {
                console.error("Failed to fetch members", e);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const totalSeats = 150;
    const takenSeats = Math.max(members.length, 1); // Pretend 1 is taken for the new user if empty
    const progressPercent = (takenSeats / totalSeats) * 100;

    return (
        <div className="w-full flex flex-col gap-6 animate-[fade-in-up_0.5s_ease-out]">
            <div className="text-center md:text-left mb-2">
                <h1 className="font-playfair text-3xl font-bold text-[#F5F0E8] mb-2">
                    Witaj w społeczności, {firstName || "Klubowiczu"}! 🦫
                </h1>
                <p className="font-sans text-sm text-[#8A9E8A]">
                    Pomyślnie odebrano darmowy Paszport. Twój profil został utworzony.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-2">
                {/* User's Passport Card */}
                <div className="w-full md:w-5/12 mx-auto shrink-0">
                    <div className="border border-[#2D5A3D] rounded-xl bg-[#1C2614] p-6">
                        {/* Bober avatar + imię + numer paszportu */}
                        <img
                            src="https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/0.webp"
                            alt="Passport"
                            className="w-24 h-24 rounded-full border-2 border-[#2D5A3D] mx-auto object-cover grayscale opacity-80"
                        />
                        <span className="bg-[#2D5A3D] text-[#8A9E8A] text-xs px-3 py-1 rounded-full mt-3 block w-fit mx-auto">
                            Paszport Członkowski
                        </span>
                        <h2 className="font-playfair text-2xl text-center mt-2 text-[#F5F0E8]">
                            {firstName || "Nowy Użytkownik"}
                        </h2>
                        <p className="text-[#8A9E8A] text-center text-xs mt-1">
                            Paszport #Oczekujący · Bez aktywnego Członkostwa
                        </p>

                        {/* Separator */}
                        <div className="border-t border-[#2D5A3D] my-4" />

                        {/* CTA Rezerwacja */}
                        <p className="text-[#8A9E8A] text-sm text-center mb-3">
                            Gotowy na wakacje na własność?
                        </p>
                        <div className="flex flex-col items-center">
                            <a href="/checkout/stage/0" style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '16px', padding: '14px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em', textDecoration: 'none' }} className="block text-center w-full">
                                Zarezerwuj miejsce w projekcie - 2 000 PLN
                            </a>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(245, 240, 232, 0.60)', marginTop: '12px', textAlign: 'center', display: 'block' }}>
                                Rezerwacja w 100% zwrotna. Rezygnujesz kiedy chcesz.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Community Gallery */}
                <div className="w-full md:w-7/12 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-white font-semibold">
                            <Users size={18} className="text-gold-500" />
                            Galeria Odkrywców
                        </div>
                        <span className="text-xs text-[#8A9E8A] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {takenSeats}/{totalSeats} miejsc
                        </span>
                    </div>

                    <div className="w-full bg-black/40 rounded-2xl border border-[#2D5A3D]/20 p-4 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center min-h-[150px]">
                                <div className="animate-spin w-8 h-8 border-2 border-t-transparent border-gold-500 rounded-full"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {/* Empty slot for the current user */}
                                <div className="aspect-square bg-gold-500/10 border-2 border-dashed border-gold-500/50 rounded-xl flex items-center justify-center relative overflow-hidden group p-2 text-center">
                                    <span className="text-xs font-bold text-gold-500 z-10">Zarezerwowane dla Ciebie!</span>
                                </div>

                                {members.map((m, i) => (
                                    <div key={i} className="aspect-square bg-[#0E1208] rounded-xl border border-white/5 overflow-hidden relative group">
                                        {m.photoId ? (
                                            <img
                                                src={`https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/${m.photoId}.webp`}
                                                alt="Member"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                <Users className="text-white/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-2 pt-6 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[10px] text-white truncate text-center">{m.memberName}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty slots */}
                                {Array.from({ length: Math.min(11, totalSeats - takenSeats) }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square bg-white/5 rounded-xl border border-white/5 flex items-center justify-center relative">
                                        <span className="text-white/20 font-mono text-xs">?</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress bar info */}
                    <div className="mt-4">
                        <div className="w-full h-1.5 bg-[#2D5A3D]/40 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#2D5A3D] to-gold-500 rounded-full"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-center text-[#8A9E8A] mt-2">
                            Pozostało <span className="text-white font-bold">{totalSeats - takenSeats}</span> z 150 miejsc członkowskich. Paszporty na razie bez limitu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
