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
            <div className="flex flex-col items-end gap-1">
                <a href="/checkout/stage/0" className="bg-[#C9A84C] text-[#0E1208] font-semibold px-6 py-3 rounded-md whitespace-nowrap hover:bg-[#C9A84C]/90 transition">
                    Zarezerwuj członkostwo - 2000 PLN
                </a>
                <p className="text-[#8A9E8A] text-xs">
                    Pozostało {150 - activeMembers} z 150 miejsc
                </p>
            </div>
        </div>
    );
}
