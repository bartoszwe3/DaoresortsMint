import React, { useState } from "react";
import { User, Check } from "lucide-react";

export default function StepProfile({ goNext, onRegister, loading, error, setError }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [source, setSource] = useState("");
    const [newsletter, setNewsletter] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName.trim()) {
            setError("Imię jest wymagane");
            return;
        }

        onRegister({ firstName, lastName, source, newsletter });
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in-right">
            <div className="text-center md:text-left mb-2">
                <h1 className="font-playfair text-3xl font-bold text-[#F5F0E8] mb-2">
                    Uzupełnij profil
                </h1>
                <p className="font-sans text-sm text-[#8A9E8A]">
                    Powiedz nam jak się do Ciebie zwracać i skąd się o nas dowiedziałeś.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1 relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                            placeholder="Imię *"
                            className="w-full bg-[#0E1208] border border-[#2D5A3D]/50 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-gold-500 transition-colors"
                            required
                            disabled={loading}
                            autoFocus
                        />
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Nazwisko (Opcjonalne)"
                            className="w-full bg-[#0E1208] border border-[#2D5A3D]/50 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-gold-500 transition-colors"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full bg-[#0E1208] border border-[#2D5A3D]/50 text-[#8A9E8A] rounded-xl py-4 px-4 focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
                        disabled={loading}
                    >
                        <option value="" disabled>Skąd się o nas dowiedziałeś?</option>
                        <option value="X/Twitter">X / Twitter</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Tiktok">TikTok</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Znajomy">Od znajomego z klubu</option>
                        <option value="Inne">Inne źródło</option>
                    </select>
                </div>

                <label className="flex items-start gap-3 cursor-pointer mt-2 group">
                    <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${newsletter ? 'bg-gold-500 border-gold-500' : 'bg-transparent border-[#2D5A3D]/50 group-hover:border-gold-500'}`}>
                        {newsletter && <Check size={14} className="text-[#0E1208]" />}
                    </div>
                    <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="hidden"
                        disabled={loading}
                    />
                    <span className="text-[#8A9E8A] text-xs leading-relaxed">
                        Chcę otrzymywać tajne dropy, zaproszenia na eventy i kluczowe informacje dla członków (max 1 mail w miesiącu).
                    </span>
                </label>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading || !firstName}
                    className="w-full bg-gold-500 text-[#0E1208] py-4 rounded-xl font-bold text-lg hover:bg-gold-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? (
                        <span className="animate-pulse">Zapisywanie profilu...</span>
                    ) : (
                        "Utwórz profil i odbierz Paszport"
                    )}
                </button>
            </form>
        </div>
    );
}
