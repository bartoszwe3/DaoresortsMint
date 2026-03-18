import React from "react";
import { RESERVATION_FEE } from "../constants/tokenomics";

export default function MembershipCheckout({ membershipCount = 0 }) {
    return (
        <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-none p-8 max-w-md mx-auto my-10">
            {/* Nagłówek sekcji płatności */}
            <h3 className="font-playfair text-xl text-[#F5F0E8] mb-4 text-center">
                Zarezerwuj Miejsce
            </h3>

            {/* Cena */}
            <div className="bg-[#1C2614] border border-[#C9A84C] rounded-none p-4 mb-4 text-center">
                <p className="text-[#8A9E8A] text-sm mb-1">Kaucja rezerwacyjna</p>
                <p className="font-playfair text-4xl text-[#C9A84C] font-bold">
                    {RESERVATION_FEE.toLocaleString("pl-PL")} PLN
                </p>
                <p className="text-[#8A9E8A] text-xs mt-1">
                    Gwarantowana cena · do 14 dni na rezygnację
                </p>
            </div>

            {/* Przycisk główny */}
            <button className="w-full bg-[#C9A84C] text-[#0E1208] font-bold py-4 rounded-none text-lg hover:bg-[#C9A84C]/90 transition-colors uppercase tracking-widest">
                Zarezerwuj miejsce - {RESERVATION_FEE.toLocaleString("pl-PL")} PLN
            </button>

            {/* Metody płatności */}
            <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[#8A9E8A] text-xs">Płatność:</span>
                <span className="text-[#8A9E8A] text-xs">
                    Karta · Przelew bankowy · BLIK
                </span>
            </div>

            {/* Krypto jako opcja dodatkowa */}
            <div className="border-t border-[#2D5A3D] mt-4 pt-4">
                <button className="w-full border border-[#2D5A3D] text-[#8A9E8A] py-3 rounded-none text-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors uppercase tracking-wider">
                    Zapłać kryptowalutą (Polygon)
                </button>
            </div>

            {/* Availability */}
            <p className="text-[#8A9E8A] text-xs text-center mt-3">
                Pozostało {150 - membershipCount} z 150 miejsc
            </p>
        </div>
    );
}
