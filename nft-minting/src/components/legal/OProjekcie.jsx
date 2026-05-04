import React from "react";

export default function OProjekcie() {
    return (
        <div className="min-h-screen bg-[#0E1208] text-[#8A9E8A] pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <p className="text-xs font-bold tracking-widest text-gold-500 uppercase">
                        Prywatny Klub Wakacyjny
                    </p>
                    <h1 className="font-playfair text-5xl text-[#F5F0E8] mb-6">O Projekcie</h1>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm text-[#8A9E8A]/80">
                        <p>Dokument informacyjny — wersja: maj 2026</p>
                        <p>Silna.club</p>
                    </div>
                </div>

                <hr className="border-[#8A9E8A]/30" />

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Dlaczego powstał Silna.club</h2>
                    <p className="leading-relaxed">
                        Wakacje w luksusowych domkach w lesie, z jacuzzi, z pełną prywatnością, z dobrym śniadaniem i ciszą wieczorem — w Polsce kosztują 500-700 PLN za noc. Tydzień dla rodziny to 3500-4900 PLN. Dwa tygodnie — drugie tyle.
                    </p>
                    <p className="leading-relaxed">
                        To nie jest świat dostępny dla większości pracujących ludzi. To jest świat, do którego zaprasza się raz w roku, na medal. Albo się go ogląda na Instagramie.
                    </p>
                    <p className="leading-relaxed font-bold text-[#F5F0E8]">Silna.club zmienia ten model.</p>
                    <p className="leading-relaxed">
                        <strong className="text-[#F5F0E8]">Cel nadrzędny:</strong> sprawić, żeby wakacje w luksusowych domkach były dostępne nie tylko dla najbogatszych — żeby normalny przedsiębiorca, lekarz, programista, freelancer, ktokolwiek kto pracuje na siebie i ceni jakość, miał <em>swoje</em> miejsce w lesie. Nie wynajem na noc. Nie hotel. Swoje 14 nocy rocznie, dożywotnio, w klubie którego jest częścią.
                    </p>
                    <p className="leading-relaxed">
                        Sposób na to: <strong className="text-[#F5F0E8]">156 osób kupuje członkostwo w prywatnym klubie wakacyjnym, klub buduje 6 domków premium na własnym terenie, każdy członek korzysta z 14 nocy rocznie po koszcie operacyjnym — bez marży hotelowej.</strong>
                    </p>
                    <p className="leading-relaxed">
                        Matematyka: 6 domków × 365 nocy = 2190 nocodób rocznie ÷ 156 członków = ~14 nocy na członka. Nie jak udział w nieruchomości. Jak prawo do korzystania z resortu, którego jest się częścią.
                    </p>
                </section>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Co dokładnie kupuje członek</h2>
                    <p className="leading-relaxed"><strong className="text-[#F5F0E8]">Członkostwo w prywatnym klubie wakacyjnym</strong> — to znaczy:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>prawo do korzystania z infrastruktury Klubu na warunkach Regulaminu Klubu</li>
                        <li>14 nocy rocznie w jednym z 6 domków, po opłacie operacyjnej (sprzątanie, media, obsługa)</li>
                        <li>prawo wnoszenia głosu w konsultacjach społeczności w sprawach dotyczących funkcjonowania Klubu</li>
                        <li>możliwość przenoszenia członkostwa zgodnie z zasadami Regulaminu (np. odstąpienie miejsca innej osobie, przekazanie dzieciom)</li>
                        <li>dostęp do społeczności 156 osób, które wybrały podobny styl życia</li>
                    </ul>

                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-6">Czego członkostwo nie obejmuje:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>nie obejmuje własności nieruchomości ani udziału w nieruchomości</li>
                        <li>nie obejmuje udziału w spółce ani prawa do dywidendy</li>
                        <li>nie obejmuje partycypacji w zyskach z wynajmu domków osobom spoza Klubu</li>
                        <li>nie jest instrumentem finansowym, papierem wartościowym ani jednostką funduszu inwestycyjnego</li>
                        <li>nie jest formą inwestycji finansowej i nie wiąże się z oczekiwaniem zwrotu finansowego</li>
                    </ul>
                    <p className="leading-relaxed mt-4 italic text-[#8A9E8A]/80">Członkostwo to prawo do korzystania z resortu — nie inwestycja w resort.</p>
                </section>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Lokalizacja</h2>
                    <p className="leading-relaxed"><strong className="text-[#F5F0E8]">Silna, gmina Pszczew, województwo lubuskie.</strong></p>
                    <p className="leading-relaxed">
                        Działka 2 530 m² w lesie sosnowym, około 1,5 godziny od Poznania, 2,5 godziny od Berlina, 3,5 godziny od Warszawy. Spokojna część Polski — bez tłumów Mazur, bez korków na wjeździe, bez festiwalowego hałasu. Las, jezioro w okolicy, cisza.
                    </p>
                    <p className="leading-relaxed">
                        Działka jest własnością spółki realizującej Projekt — WE3.CLUB RESORT DEVELOPMENT SP. Z O.O. (KRS 0001188626), zakupiona w 2025 r. i zabezpieczona pod realizację Projektu.
                    </p>
                </section>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Co powstaje na działce</h2>
                    <p className="leading-relaxed">Po uzyskaniu pozwolenia na budowę Klub buduje:</p>
                    <p className="leading-relaxed"><strong className="text-[#F5F0E8]">6 domków rekreacyjnych</strong> w drewnianej konstrukcji szkieletowej, każdy:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>ok. 70 m² powierzchni użytkowej</li>
                        <li>2 sypialnie + salon z aneksem kuchennym + łazienka</li>
                        <li>jacuzzi na zewnętrznym tarasie</li>
                        <li>własna strefa wokół domku zapewniająca prywatność</li>
                        <li>wyposażenie premium: kuchnia w pełni wyposażona, pościel hotelowa, ręczniki, systemy multimedialne</li>
                    </ul>

                    <p className="leading-relaxed mt-4"><strong className="text-[#F5F0E8]">Infrastrukturę wspólną:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>własna oczyszczalnia biologiczna (bez podłączenia do gminnej kanalizacji)</li>
                        <li>własna studnia głębinowa (bez zależności od wodociągu)</li>
                        <li>przyłącza energetyczne i światłowodowe</li>
                        <li>ścieżki spacerowe, miejsca ogniskowe, drewniana sauna społecznościowa</li>
                        <li>7. domek operacyjny</li>
                    </ul>
                    <p className="leading-relaxed mt-4"><strong className="text-[#F5F0E8]">Architekt projektu:</strong> wynegocjowany kontrakt na pełne 7 budynków (6 domków + domek operacyjny). Projekt finalizowany.</p>
                </section>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Jak działa członkostwo w czasie</h2>
                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-4">Co roku członek:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Otrzymuje pulę 14 nocy do wykorzystania w roku kalendarzowym</li>
                        <li>Rezerwuje terminy w systemie Klubu na zasadach pierwszeństwa zgłoszenia, z mechanizmem priorytetu dla nowych członków przy pierwszym pełnym sezonie</li>
                        <li>Płaci opłatę operacyjną za każdy zarezerwowany pobyt — pokrywającą sprzątanie, media, obsługę, zarządzanie. Bez marży hotelowej, bez zysku Spółki na pobycie członka.</li>
                        <li>Może przyjeżdżać sam, z rodziną, ze znajomymi (do limitu osób przewidzianego dla domku)</li>
                    </ul>

                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-6">Niewykorzystane noce:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Mogą być oddane innym członkom lub puli wynajmu zewnętrznego (przychody z wynajmu zasilają fundusz operacyjny Klubu, redukując opłatę roczną)</li>
                    </ul>

                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-6">Społeczność:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>156 osób z podobnymi wartościami i stylem życia</li>
                        <li>Wydarzenia integracyjne (otwarcie sezonu, weekendy tematyczne)</li>
                        <li>Opcjonalne wspólne aktywności (warsztaty kulinarne, jogę poranną, wieczory przy ognisku)</li>
                        <li>Konsultacje społeczności w sprawach dotyczących funkcjonowania Klubu (zmiany operacyjne, propozycje rozbudowy infrastruktury)</li>
                    </ul>
                </section>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Model ekonomiczny</h2>
                    <p className="leading-relaxed"><strong className="text-[#F5F0E8]">Cena członkostwa:</strong> ~25 900 PLN brutto, w trzech etapach:</p>
                    
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full text-left border-collapse border border-[#8A9E8A]/30">
                            <thead className="bg-[#161B10]">
                                <tr>
                                    <th className="py-3 px-4 font-bold text-[#F5F0E8] border-b border-[#8A9E8A]/30">Etap</th>
                                    <th className="py-3 px-4 font-bold text-[#F5F0E8] border-b border-[#8A9E8A]/30">Kwota orientacyjna</th>
                                    <th className="py-3 px-4 font-bold text-[#F5F0E8] border-b border-[#8A9E8A]/30">Moment płatności</th>
                                    <th className="py-3 px-4 font-bold text-[#F5F0E8] border-b border-[#8A9E8A]/30">Charakter</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#8A9E8A]/30 text-sm">
                                <tr>
                                    <td className="py-3 px-4 font-bold text-[#F5F0E8]">Etap 0 — Opłata Rezerwacyjna</td>
                                    <td className="py-3 px-4">2 000 PLN</td>
                                    <td className="py-3 px-4">Przy podpisaniu Umowy Rezerwacji</td>
                                    <td className="py-3 px-4">Zwrotna w pełnej wysokości w przypadkach określonych w Umowie</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-[#F5F0E8]">Etap 1 — Pierwsza transza</td>
                                    <td className="py-3 px-4">~12 000 PLN</td>
                                    <td className="py-3 px-4">Po uzyskaniu pozwolenia na budowę, przy podpisaniu Umowy Członkowskiej</td>
                                    <td className="py-3 px-4">Finansowanie budowy infrastruktury i domków do stanu deweloperskiego</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-bold text-[#F5F0E8]">Etap 2 — Druga transza</td>
                                    <td className="py-3 px-4">~12 000 PLN</td>
                                    <td className="py-3 px-4">Po osiągnięciu stanu deweloperskiego, potwierdzonego przez niezależnego inspektora nadzoru</td>
                                    <td className="py-3 px-4">Wykończenie, wyposażenie, jacuzzi, uruchomienie Klubu</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="leading-relaxed mt-4">
                        <strong className="text-[#F5F0E8]">Kwoty mogą ulec niewielkiej korekcie</strong> w zależności od finalnego kosztorysu wykonawczego — finalna cena zostanie określona w Umowie Członkowskiej (Etap 1) i mieści się w widełkach 24 000 – 28 000 PLN brutto. W przypadku ustalenia ceny powyżej widełek członek ma prawo odstąpienia od Umowy Członkowskiej z pełnym zwrotem Opłaty Rezerwacyjnej.
                    </p>
                </section>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Wybór wykonawców — model społecznościowy</h2>
                    <p className="leading-relaxed"><strong className="text-[#F5F0E8]">Wykonawcy domków, oczyszczalni, studni i wyposażenia będą wybrani wspólnie z członkami.</strong></p>
                    <p className="leading-relaxed">Spółka prezentuje 3-5 ofert dla każdej kategorii (np. producenci domków drewnianych, dostawcy jacuzzi, wykonawcy oczyszczalni). Członkowie głosują nad finalnym wyborem w konsultacji społecznościowej.</p>
                    
                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-6">Dlaczego tak:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Resort jest <em>Wasz</em> — chcemy żebyście mieli realny wpływ na to, jak będzie wyglądał</li>
                        <li>Decyzje wykonawcze wpływają na komfort przez najbliższe dekady</li>
                        <li>Społeczność wnosi wiedzę, której pojedyncza spółka nie ma (członkowie z branży architektonicznej, wnętrzarskiej, turystycznej)</li>
                    </ul>

                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-6">Co nie zmienia się przez konsultacje:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Spółka pozostaje jedynym podmiotem zawierającym umowy z wykonawcami i ponosi pełne ryzyko wykonawcze</li>
                        <li>Spółka odpowiada za zachowanie standardu jakości i terminów budowy</li>
                        <li>Spółka odpowiada za rozliczenia finansowe z wykonawcami</li>
                    </ul>
                    <p className="leading-relaxed mt-4 italic text-[#8A9E8A]/80">Konsultacje społecznościowe to prawo wpływu, nie obowiązek zarządzania środkami.</p>
                </section>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Bezpieczeństwo prawne i finansowe</h2>
                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-4">Zabezpieczenie środków członków:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Opłata Rezerwacyjna (Etap 0) jest zaliczką w rozumieniu Kodeksu cywilnego. Podlega zwrotowi w pełnej wysokości w przypadkach określonych w Umowie Rezerwacji — w tym przy odstąpieniu w 14-dniowym ustawowym terminie konsumenckim, przy odstąpieniu w dowolnym późniejszym momencie przed uruchomieniem Projektu, przy nieuzyskaniu pozwolenia na budowę do określonego terminu, oraz przy zaistnieniu siły wyższej.</li>
                        <li>Środki Etapu 1 przekazywane są bezpośrednio wykonawcom zgodnie z postępem prac, potwierdzanym przez niezależnego inspektora nadzoru. Spółka nie pobiera środków przed wykonaniem prac.</li>
                        <li>Środki Etapu 2 są płatne dopiero po osiągnięciu stanu deweloperskiego, potwierdzonego przez niezależnego inspektora nadzoru.</li>
                    </ul>

                    <h3 className="text-lg font-bold text-[#F5F0E8] mt-6">Czym członkostwo nie jest:</h3>
                    <p className="leading-relaxed">W celu jednoznacznego pozycjonowania prawnego członkostwo Silna.club:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong className="text-[#F5F0E8]">nie jest instrumentem finansowym</strong> w rozumieniu ustawy o obrocie instrumentami finansowymi ani Dyrektywy MiFID II;</li>
                        <li><strong className="text-[#F5F0E8]">nie jest papierem wartościowym, jednostką uczestnictwa funduszu inwestycyjnego ani certyfikatem inwestycyjnym</strong>;</li>
                        <li><strong className="text-[#F5F0E8]">nie jest udziałem w spółce ani prawem do dywidendy</strong>;</li>
                        <li><strong className="text-[#F5F0E8]">nie jest formą inwestycji finansowej</strong> — członek nie nabywa ekspozycji na wynik finansowy spółki ani na zmianę wartości aktywa;</li>
                        <li><strong className="text-[#F5F0E8]">nie podlega ustawie deweloperskiej z 20 maja 2021 r.</strong>, gdyż członek nie nabywa własności nieruchomości;</li>
                        <li><strong className="text-[#F5F0E8]">Opłata Rezerwacyjna nie jest depozytem</strong> w rozumieniu Prawa bankowego ani depozytu nieprawidłowego (art. 845 KC) — jest zaliczką na poczet ceny członkostwa.</li>
                    </ul>
                    <p className="leading-relaxed mt-4">Członkostwo jest <strong className="text-[#F5F0E8]">prawem do korzystania z infrastruktury Klubu</strong> — relacją usługową, nie kapitałową.</p>
                    <p className="leading-relaxed mt-4 font-bold text-[#F5F0E8]">Pełne warunki uruchomienia Projektu, w tym Próg Minimalny zawartych Umów Rezerwacji, Termin Graniczny oraz wszystkie przesłanki zwrotu Opłaty Rezerwacyjnej — określa Umowa Rezerwacji (Etap 0).</p>
                </section>

                {/* Company Box */}
                <div className="bg-[#161B10] border-l-4 border-gold-500 p-6 md:p-8">
                    <h2 className="text-xs font-bold tracking-widest text-gold-500 uppercase mb-4">
                        Spółka realizująca Projekt
                    </h2>
                    <p className="font-bold text-[#F5F0E8] mb-4 text-xl">
                        WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-[#8A9E8A]">
                        <div className="font-bold text-[#F5F0E8]">KRS</div><div>0001188626</div>
                        <div className="font-bold text-[#F5F0E8]">NIP</div><div>9731114421</div>
                        <div className="font-bold text-[#F5F0E8]">REGON</div><div>542448933</div>
                        <div className="font-bold text-[#F5F0E8]">Siedziba</div><div>ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra</div>
                        <div className="font-bold text-[#F5F0E8]">Kapitał zakładowy</div><div>zgodnie z KRS</div>
                        <div className="font-bold text-[#F5F0E8]">Reprezentacja</div><div>Bartosz Zniszczoł, Prezes Zarządu</div>
                        <div className="font-bold text-[#F5F0E8]">Kontakt</div><div><a href="mailto:bartosz@silna.club" className="text-gold-500 hover:underline">bartosz@silna.club</a></div>
                        <div className="font-bold text-[#F5F0E8]">Strona Projektu</div><div>silna.club</div>
                    </div>
                    <p className="mt-6 text-sm text-[#8A9E8A]/80">
                        Spółka została zawiązana w sierpniu 2025 r. wyłącznie w celu realizacji Projektu Silna.club. Działka pod resort została zakupiona we wrześniu 2025 r. Wszystkie aktywa Projektu są zabezpieczone w spółce.
                    </p>
                </div>

                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Status dokumentu</h2>
                    <p className="leading-relaxed"><strong className="text-[#F5F0E8]">Niniejszy dokument ma charakter wyłącznie informacyjny.</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Nie stanowi zobowiązania umownego ani oferty w rozumieniu art. 66 Kodeksu cywilnego.</li>
                        <li>Parametry opisowe Projektu mogą ulec zmianie w toku jego realizacji — finalne warunki są określone wyłącznie w Umowie Rezerwacji (Etap 0) oraz Umowie Członkowskiej (Etap 1).</li>
                        <li>Liczby, kwoty i terminy podane w niniejszym dokumencie mają charakter szacunkowy i orientacyjny. Wiążące są wyłącznie kwoty i terminy określone w dokumentach umownych.</li>
                        <li>Spółka zachowuje archiwalne wersje niniejszego dokumentu z datą udostępnienia. Na żądanie Rezerwującego Spółka przekazuje wersję aktualną na dzień zawarcia jego Umowy Rezerwacji.</li>
                    </ul>
                </section>

                <section className="flex flex-col space-y-4 pt-12 mt-12 border-t border-[#8A9E8A]/30">
                    <h2 className="text-3xl font-playfair text-[#F5F0E8]">Mamy pytania</h2>
                    <p className="leading-relaxed">Każde pytanie dotyczące Projektu — od „co jeśli zmienię zdanie po roku" po „kto będzie sprzątał" — kierujcie pod:</p>
                    <p className="leading-relaxed font-bold text-[#F5F0E8] space-y-1">
                        <span className="block"><a href="mailto:bartosz@silna.club" className="text-gold-500 hover:underline font-normal">bartosz@silna.club</a></span>
                        <span className="block">📞 +48 514 716 063</span>
                    </p>
                    <p className="leading-relaxed text-[#8A9E8A]/80 italic mt-4">Odpowiadamy w ciągu 48 godzin w dni robocze.</p>
                </section>
                
                <p className="text-center text-xs text-[#8A9E8A]/60 mt-16 pt-8 border-t border-[#8A9E8A]/30">
                    Wersja dokumentu: maj 2026 · Silna.club · WE3.CLUB RESORT DEVELOPMENT SP. Z O.O. · KRS 0001188626
                </p>
            </div>
        </div>
    );
}
