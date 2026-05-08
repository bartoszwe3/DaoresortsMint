import React from "react";

export default function MembershipBanner({ activeMembers = 0 }) {
    return (
        <div className="bg-[#1C2614] border border-[#C9A84C] rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">
                    Masz paszport ✓
                </p>
                <p className="text-[#F5F0E8] font-semibold">
                    Zarezerwuj członkostwo
                </p>
                <p className="text-[#8A9E8A] text-sm">
                    14 nocy rocznie · Dożywotnio · Prawo głosu w DAO
                </p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
                <a href="/checkout/stage/0" style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '16px', padding: '12px 32px', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.02em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Zarezerwuj miejsce w projekcie - 2 000 PLN
                </a>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(245, 240, 232, 0.60)', marginTop: '4px', textAlign: 'center', display: 'block' }}>
                    Rezerwacja w 100% zwrotna. Rezygnujesz kiedy chcesz.
                </p>
            </div>
        </div>
    );
}
