import React from "react";

export default function MembershipProgress({ passportCount = 189, reservedCount = 47, activeCount = 25 }) {
    return (
        <div className="w-full md:max-w-xl md:mx-auto space-y-4">
            {/* Paszporty darmowe */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8A9E8A]">Paszporty (bezpłatne)</span>
                    <span className="text-[#8A9E8A]">{passportCount} / 5 000</span>
                </div>
                <div className="h-1 bg-[#1C2614] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2D5A3D] rounded-full transition-all"
                        style={{ width: `${(passportCount / 5000) * 100}%` }} />
                </div>
            </div>

            {/* Rezerwacje - 2 000 PLN */}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#F5F0E8] font-medium">
                        Zarezerwowane miejsca (2 000 PLN)
                    </span>
                    <span className="text-[#C9A84C] font-bold">
                        {reservedCount} / 150
                    </span>
                </div>
                <div className="h-2 bg-[#1C2614] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A84C]/60 rounded-full transition-all"
                        style={{ width: `${(reservedCount / 150) * 100}%` }} />
                </div>
            </div>

            {/* Aktywne członkostwa - 27 000 PLN */}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#8A9E8A] font-medium">
                        Pełne Członkostwa (Etap 4)
                    </span>
                    <span className="text-[#8A9E8A] font-bold">
                        {activeCount} / 150
                    </span>
                </div>
                <div className="h-2 bg-[#1C2614] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A84C] rounded-full transition-all"
                        style={{ width: `${(activeCount / 150) * 100}%` }} />
                </div>
                <p className="text-[#8A9E8A] text-xs mt-1 text-right">
                    Pozostało {150 - reservedCount} wolnych miejsc
                </p>
            </div>
        </div>
    );
}
