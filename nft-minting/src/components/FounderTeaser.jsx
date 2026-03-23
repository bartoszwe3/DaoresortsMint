import React from "react";

export const FounderTeaser = () => (
    <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col gap-10 items-center w-full max-w-3xl mx-auto text-center px-4">
            {/* Headers */}
            <div className="w-full">
                <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">
                    Za projektem stoi człowiek
                </p>
                <h2 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] mb-4">
                    Kto buduje DAOResorts
                </h2>
            </div>

            {/* Karta */}
            <div className="w-full">
                <a href="/founder"
                    className="group block bg-[#1C2614] border border-[#2D5A3D] hover:border-[#C9A84C] rounded-2xl p-8 md:p-12 transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.1)]">
                    <div className="flex flex-col items-center gap-6">
                        {/* Zdjęcie */}
                        <img
                            src="/Bartoszzdjecie.jpeg"
                            alt="Założyciel DAOResorts"
                            className="w-32 h-32 rounded-full object-cover border-2 border-[#C9A84C] flex-shrink-0"
                        />

                        {/* Tekst */}
                        <div className="flex-1 flex flex-col items-center text-center">
                            <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">
                                Założyciel
                            </p>
                            <h3 className="font-playfair text-2xl md:text-3xl text-[#F5F0E8] mb-4">
                                Bartosz Zniszczoł
                            </h3>
                            <p className="text-[#8A9E8A] text-sm md:text-base leading-relaxed mb-6">
                                Szukałem miejsca gdzie mógłbym wypoczywać bez przepłacania hotelom. Bez wydawania 500 tys pln na dom wakacyjny, Nie znalazłem, więc postanowiłem je zbudować
                            </p>
                            <span className="inline-flex items-center justify-center gap-2 text-[#C9A84C] text-sm md:text-base font-medium group-hover:gap-3 transition-all">
                                Poznaj całą historię →
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </section>
);
