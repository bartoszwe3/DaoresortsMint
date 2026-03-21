import React from "react";
import { Mail, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function StepMethodSelect({ setAuthMethod, goNext }) {
    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in-right">
            <div className="text-center md:text-left mb-2">
                <h1 className="font-playfair text-3xl font-bold text-[#F5F0E8] mb-2">
                    Dołącz do DAOResorts
                </h1>
                <p className="font-sans text-sm text-[#8A9E8A]">
                    Wybierz jak chcesz się zalogować. Nie potrzebujesz portfela krypto.
                </p>
            </div>

            {/* Email Button (Primary) */}
            <button
                onClick={() => { setAuthMethod('email'); goNext(); }}
                className="w-full bg-gold-500 text-[#0E1208] py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gold-400 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(201,168,76,0.15)] flex flex-col items-center justify-center gap-1 group"
            >
                <div className="flex items-center gap-2">
                    <Mail size={20} className="text-[#0E1208]" /> Zaloguj się emailem
                </div>
                <span className="block text-xs font-medium opacity-75 group-hover:opacity-100 transition-opacity">
                    Wyślemy Ci kod. Bez hasła, bez portfela.
                </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
                <hr className="flex-1 border-[#2D5A3D]/50" />
                <span className="text-[#8A9E8A] text-sm uppercase tracking-wider font-medium">lub</span>
                <hr className="flex-1 border-[#2D5A3D]/50" />
            </div>

            {/* Wallet Button (Secondary) */}
            <button
                onClick={() => { setAuthMethod('wallet'); goNext(); }}
                className="w-full bg-[#1C2614] border border-gold-500/50 text-gold-500 py-3.5 px-6 rounded-xl text-base hover:bg-gold-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Wallet size={18} /> Mam portfel krypto
            </button>

            {/* Disclaimer */}
            <p className="text-[#8A9E8A] text-xs text-center mt-6 leading-relaxed">
                Rejestrując się akceptujesz{" "}
                <a href="/regulamin" target="_blank" rel="noreferrer" className="text-gold-500 hover:text-gold-400 underline decoration-[#2D5A3D] underline-offset-4 transition-colors">
                    Regulamin
                </a>
                {" "}i{" "}
                <a href="/polityka-prywatnosci" target="_blank" rel="noreferrer" className="text-gold-500 hover:text-gold-400 underline decoration-[#2D5A3D] underline-offset-4 transition-colors">
                    Politykę Prywatności
                </a>
                {" "}WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
            </p>
        </div>
    );
}
