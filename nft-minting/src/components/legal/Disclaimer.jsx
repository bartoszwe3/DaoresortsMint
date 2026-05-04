import React from "react";
import { Link } from "react-router-dom";

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-[#0E1208] text-[#8A9E8A] pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <p className="text-xs font-bold tracking-widest text-gold-500 uppercase">
                        Ważna informacja prawna
                    </p>
                    <h1 className="font-playfair text-5xl text-[#F5F0E8] mb-6">Disclaimer</h1>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm text-[#8A9E8A]/80">
                        <p>Pozycjonowanie prawne</p>
                        <p>Silna.club</p>
                    </div>
                </div>

                <hr className="border-[#8A9E8A]/30" />

                <section className="flex flex-col space-y-8">
                    <p className="leading-relaxed text-lg text-[#F5F0E8]">
                        W celu jednoznacznego pozycjonowania prawnego, informujemy czym członkostwo w Silna.club <strong className="text-gold-500">NIE JEST</strong>:
                    </p>
                    
                    <ul className="space-y-8">
                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">01.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Nie jest instrumentem finansowym</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Członkostwo nie jest instrumentem finansowym w rozumieniu ustawy o obrocie instrumentami finansowymi ani Dyrektywy MiFID II.</p>
                            </div>
                        </li>
                        
                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">02.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Nie jest papierem wartościowym</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Członkostwo nie jest papierem wartościowym, jednostką uczestnictwa funduszu inwestycyjnego ani certyfikatem inwestycyjnym.</p>
                            </div>
                        </li>

                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">03.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Nie jest udziałem w spółce</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Członkostwo nie stanowi udziału w spółce ani nie daje prawa do dywidendy.</p>
                            </div>
                        </li>

                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">04.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Nie jest inwestycją finansową</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Członek nie nabywa ekspozycji na wynik finansowy spółki ani na zmianę wartości aktywa.</p>
                            </div>
                        </li>

                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">05.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Nie podlega ustawie deweloperskiej</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Nie podlega ustawie deweloperskiej z 20 maja 2021 r., gdyż członek nie nabywa własności nieruchomości.</p>
                            </div>
                        </li>

                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">06.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Nie jest depozytem</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Opłata Rezerwacyjna nie jest depozytem w rozumieniu Prawa bankowego ani depozytu nieprawidłowego (art. 845 KC) — jest zaliczką na poczet ceny członkostwa.</p>
                            </div>
                        </li>
                    </ul>
                </section>

                <div className="bg-[#161B10] border-l-4 border-gold-500 p-6 md:p-8 mt-12">
                    <p className="font-bold text-[#F5F0E8] text-lg mb-2">
                        Prawa członka
                    </p>
                    <p className="text-[#8A9E8A] leading-relaxed mb-4">
                        Członkostwo jest prawem do korzystania z infrastruktury Klubu — relacją usługową, nie kapitałową.
                    </p>
                    <Link to="/o-projekcie" className="inline-block mt-2 text-gold-500 hover:text-white transition-colors border-b border-gold-500/30 hover:border-white pb-1">
                        Przeczytaj pełny dokument O Projekcie →
                    </Link>
                </div>
            </div>
        </div>
    );
}
