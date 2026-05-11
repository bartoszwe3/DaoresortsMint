import React from "react";

export default function Regulamin() {
    return (
        <div className="min-h-screen bg-[#0E1208] text-[#8A9E8A] pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <p className="text-xs font-bold tracking-widest text-gold-500 uppercase">
                        Karta Klubu
                    </p>
                    <h1 className="font-playfair text-5xl text-[#F5F0E8] mb-6">Kluczowe Zasady Silna.club</h1>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm text-[#8A9E8A]/80">
                        <p>Dokument informacyjny</p>
                        <p>Silna.club</p>
                    </div>
                </div>

                <hr className="border-[#8A9E8A]/30" />

                <section className="flex flex-col space-y-8">
                    <p className="leading-relaxed text-lg text-[#F5F0E8]">
                        Poniżej przedstawiamy skrócone, kluczowe zasady funkcjonowania i członkostwa w naszym prywatnym klubie wakacyjnym.
                    </p>
                    
                    <ul className="space-y-8">
                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">01.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">14 nocy rocznie</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Każdy członek otrzymuje gwarantowaną pulę 14 nocy do wykorzystania w domkach Klubu w każdym roku kalendarzowym.</p>
                            </div>
                        </li>
                        
                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">02.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Płacisz tylko za pobyt</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Nie pobieramy marży za bycie członkiem. Jedyne koszty to proporcjonalnie podzielone podatki oraz ubezpieczenie infrastruktury wspólnej. Nie ma żadnych rocznych opłat członkowskich ani abonamentów — płacisz tylko wtedy, gdy korzystasz z resortu.</p>
                            </div>
                        </li>

                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">03.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Opłata za noc (80–120 PLN)</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Przy rezerwacji terminu pokrywasz wyłącznie koszt operacyjny — sprzątanie, media i bezpośrednią obsługę. Koszt mieści się w widełkach 80–120 PLN za noc, bez marży hotelowej.</p>
                            </div>
                        </li>

                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">04.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Prawo zbycia członkostwa</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Członkostwo nie jest przypisane na stałe bez możliwości rezygnacji. Masz pełne prawo sprzedać lub przenieść swoje miejsce w Klubie na inną osobę.</p>
                            </div>
                        </li>

                        <li className="flex flex-col md:flex-row md:items-start gap-4">
                            <span className="text-4xl text-gold-500 font-playfair font-bold">05.</span>
                            <div className="md:mt-1">
                                <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">Dziedziczenie członkostwa</h3>
                                <p className="leading-relaxed text-[#8A9E8A]">Twoje członkostwo oraz przysługujące z niego prawa podlegają w pełni dziedziczeniu, zgodnie z przepisami powszechnie obowiązującego prawa spadkowego.</p>
                            </div>
                        </li>
                    </ul>
                </section>

                <div className="bg-[#161B10] border-l-4 border-gold-500 p-6 md:p-8 mt-12">
                    <p className="font-bold text-[#F5F0E8] text-lg mb-2">
                        Pełny Regulamin Klubu
                    </p>
                    <p className="text-[#8A9E8A] leading-relaxed">
                        Niniejszy dokument jest jedynie skróconą "Kartą Klubu". Pełny, szczegółowy Regulamin Klubu zostanie Ci udostępniony do wglądu i akceptacji przy podpisywaniu Umowy Członkowskiej w Etapie 1.
                    </p>
                </div>
            </div>
        </div>
    );
}
