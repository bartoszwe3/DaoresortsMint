import React, { useState, useEffect } from "react";

const IPFS_BASE = "https://ipfs.io/ipfs/bafybeicw5an7sbklho2rmlvtbr7cqbdvw7sei2pbbrpz6qsmbgeajptl3q/";
const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export default function MemberCarousel() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
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
