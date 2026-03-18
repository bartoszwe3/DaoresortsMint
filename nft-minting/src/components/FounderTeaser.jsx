import React from "react";

export const FounderTeaser = () => (
    <section className="py-20 px-4 max-w-6xl mx-auto">
        <p className="text-[#C9A84C] text-xs uppercase tracking-widest text-center mb-4">
            Za projektem stoi człowiek
        </p>
        <h2 className="font-playfair text-3xl md:text-4xl text-[#F5F0E8] text-center mb-12">
            Kto buduje DAOResorts
        </h2>

        <a href="/founder"
            className="group block max-w-2xl mx-auto bg-[#1C2614] border border-[#2D5A3D] hover:border-[#C9A84C] rounded-xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.08)]">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Zdjęcie */}
                <img
                    src="/Bartoszzdjecie.jpeg"
                    alt="Założyciel DAOResorts"
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#C9A84C] flex-shrink-0"
                />

                {/* Tekst */}
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-1">
                        Założyciel
                    </p>
                    <h3 className="font-playfair text-2xl text-[#F5F0E8] mb-2">
                        Bartosz Zniszczoł
                    </h3>
                    <p className="text-[#8A9E8A] text-sm mb-4">
                        Szukałem miejsca gdzie mógłbym wypoczywać bez przepłacania hotelom. Bez wydawania 500 tys pln na dom wakacyjny, Nie znalazłem, więc postanowiłem je zbudować
                    </p>
                    <span className="inline-flex items-center gap-2 text-[#C9A84C] text-sm font-medium group-hover:gap-3 transition-all">
                        Poznaj całą historię →
                    </span>
                </div>
            </div>
        </a>
    </section>
);
