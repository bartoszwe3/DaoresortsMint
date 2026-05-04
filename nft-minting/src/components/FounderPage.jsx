import React from "react";

export default function FounderPage() {
    const activeMembers = 0; // Will be properly fetched in the future

    return (
        <main className="bg-[#0E1208] min-h-screen">

            {/* HERO */}
            <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

                    {/* Zdjęcie + socials */}
                    <div className="flex-shrink-0 text-center">
                        <img
                            src="/Bartoszzdjecie.jpeg"
                            alt="Bartosz Zniszczoł"
                            className="w-64 aspect-[3/4] rounded-2xl object-cover object-top border border-[#2D5A3D] mx-auto"
                        />
                        <div className="flex gap-3 mt-4 justify-center">
                            <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer"
                                className="border border-[#C9A84C] text-[#C9A84C] px-4 py-2 rounded-md text-sm hover:bg-[#C9A84C] hover:text-[#0E1208] transition-all">
                                LinkedIn
                            </a>
                            <a href="https://twitter.com/" target="_blank" rel="noreferrer"
                                className="border border-[#2D5A3D] text-[#8A9E8A] px-4 py-2 rounded-md text-sm hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
                                X / Twitter
                            </a>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-2">
                            Założyciel Silna.club
                        </p>
                        <h1 className="font-playfair text-4xl md:text-5xl text-[#F5F0E8] mb-2">
                            Bartosz Zniszczoł
                        </h1>
                        <p className="text-[#8A9E8A] text-sm mb-6">
                            WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
                        </p>
                        <p className="text-[#F5F0E8] text-base font-medium border-l-4 border-[#C9A84C] pl-4 mb-4">
                            Kupiłem tę ziemię za własne pieniądze zanim sprzedałem pierwsze członkostwo. Nie możesz mi zaufać bardziej niż ja zaufałem tej idei.
                        </p>
                        <blockquote className="border-l-4 border-[#C9A84C] pl-4 mb-6">
                            <p className="font-playfair text-xl text-[#F5F0E8] italic">
                                "Szukałem miejsca gdzie mógłbym wypoczywać bez przepłacania hotelom. Bez wydawania 500 tys pln na dom wakacyjny, Nie znalazłem, więc postanowiłem je zbudować"
                            </p>
                        </blockquote>
                        <p className="text-[#8A9E8A] text-base leading-relaxed">
                            Mam 22 lata. Kupiłem działkę, zarejestrowałem spółkę i zbudowałem aplikację. Nie czekałem, po prostu zacząłem.
                        </p>
                        <p className="text-[#8A9E8A] text-base leading-relaxed mt-3">
                            Buduję pierwszy w Polsce prywatny klub wakacyjny zarządzany przez społeczność. 156 rodzin, 6 domków z jacuzzi, las, cisza — po kosztach operacyjnych.
                        </p>
                    </div>

                </div>
            </div>

            {/* HISTORIA - timeline */}
            <div className="py-16 px-4 max-w-3xl mx-auto">
                <h2 className="font-playfair text-3xl text-[#F5F0E8] mb-8">
                    Historia projektu
                </h2>
                <div className="space-y-8">
                    {[
                        {
                            year: '2023',
                            title: 'Początki wizji',
                            desc: 'Poszukiwanie alternatywy dla hoteli oraz skomplikowanego systemu klasycznego timeshare. Zauważenie luki na rynku na styku RWA i nieruchomości.'
                        },
                        {
                            year: '2024',
                            title: 'Budowa zespołu i koncepcji prawnej',
                            desc: 'Dopracowanie prawnych aspektów członkostwa i prawa do pobytu w Polsce z użyciem publicznego rejestru cyfrowego.'
                        },
                        {
                            year: '2025',
                            title: 'Założenie WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.',
                            desc: 'Rejestracja spółki 13 sierpnia 2025. Zakup działki w Silna, Lubuskie. Podpisanie umowy z biurem architektonicznym.'
                        },
                        {
                            year: '2026',
                            title: 'Launch Silna.club',
                            desc: 'Aplikacja uruchomiona. Pierwsze 150 miejsc członkowskich w sprzedaży. 5000 darmowych Paszportów do odbioru.'
                        },
                    ].map((item, i, arr) => (
                        <div key={i} className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <span className="text-[#C9A84C] font-bold text-sm w-12 text-center flex-shrink-0">
                                    {item.year}
                                </span>
                                {i < arr.length - 1 && (
                                    <div className="w-px flex-1 bg-[#2D5A3D] mt-2 mb-0 min-h-[40px]" />
                                )}
                            </div>
                            <div className="pb-8">
                                <h3 className="text-[#F5F0E8] font-semibold mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-[#8A9E8A] text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRANSPARENTNOŚĆ - dane spółki */}
            <div className="py-16 px-4 max-w-4xl mx-auto">
                {/* Nagłówek NAD całością */}
                <h2 className="font-playfair text-4xl text-[#F5F0E8] mb-10">
                    Transparentność
                </h2>

                {/* Kontent wizji */}
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Akapit 1 */}
                    <p className="text-[#8A9E8A] text-base leading-relaxed">
                        Nieruchomości od zawsze były zarezerwowane dla najzamożniejszych.
                        Wierzę, że to się zmienia.
                    </p>

                    {/* Akapit 2 */}
                    <p className="text-[#8A9E8A] text-base leading-relaxed">
                        Publiczny rejestr cyfrowy daje coś czego tradycyjne rynki nigdy nie oferowały -
                        pełną przejrzystość. Każda złotówka widoczna. Każda decyzja głosowana.
                        Każdy etap budowy dokumentowany publicznie, w czasie rzeczywistym.
                    </p>

                    {/* Akapit 2 */}
                    <p className="text-[#8A9E8A] text-base leading-relaxed">
                        Silna.club to dowód że społeczność może razem kupić ziemię,
                        razem zlecić projekt, razem zbudować coś wartościowego -
                        i razem wypoczywać. Po kosztach. Bez pośredników, bez ukrytych marż,
                        bez wydawania pół miliona na dom wakacyjny który stoi pusty
                        przez 11 miesięcy w roku.
                    </p>

                    {/* Wyróżnione ostatnie zdanie */}
                    <blockquote className="border-l-4 border-[#C9A84C] pl-4 mt-2">
                        <p className="font-playfair text-xl text-[#F5F0E8] italic leading-relaxed">
                            To nie jest projekt inwestycyjny. To wspólna decyzja 150 rodzin
                            że chcą spędzać wakacje inaczej.
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 px-4 text-center max-w-xl mx-auto">
                <h2 className="font-playfair text-3xl text-[#F5F0E8] mb-4">
                    Dołącz do projektu
                </h2>
                <p className="text-[#8A9E8A] mb-4">
                    Zajmij darmowe miejsce i zostań częścią społeczności.
                    Jeśli chcesz korzystać z resortu - zarezerwuj członkostwo.
                </p>

                {/* Dwa CTA - rozróżnienie paszport vs członkostwo */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="/" className="bg-[#C9A84C] text-[#0E1208] font-semibold px-6 py-4 rounded-md hover:bg-[#C9A84C]/90 transition-colors">
                        Zajmij to miejsce - Bezpłatnie
                    </a>
                    <a href="/checkout/stage/0" className="border border-[#C9A84C] text-[#C9A84C] font-semibold px-6 py-4 rounded-md hover:bg-[#C9A84C] hover:text-[#0E1208] transition-colors">
                        Zarezerwuj członkostwo - 2000 PLN
                    </a>
                </div>

                <p className="text-[#8A9E8A] text-xs mt-4">
                    Pozostało {150 - activeMembers} z 150 miejsc członkowskich
                </p>
            </div>

        </main>
    );
}
