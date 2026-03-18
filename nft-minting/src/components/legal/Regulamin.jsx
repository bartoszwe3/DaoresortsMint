import React from "react";

export default function Regulamin() {
    return (
        <div className="min-h-screen bg-[#0E1208] text-[#8A9E8A] pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4 border-b border-[#2D5A3D]/50 pb-8">
                    <h1 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] font-bold tracking-tight">
                        Regulamin Członkostwa DAOResorts
                    </h1>
                    <h2 className="text-xl md:text-2xl text-[#C9A84C] font-semibold tracking-wide">
                        WE3.CLUB RESORT DEVELOPMENT <br className="md:hidden" /> SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-[#8A9E8A] opacity-80 uppercase tracking-widest">
                        <span>Wersja: <span className="text-[#F5F0E8]">1.0</span></span>
                        <span>Data wejścia w życie: <span className="text-[#F5F0E8]">[DO UZUPEŁNIENIA]</span></span>
                    </div>
                </div>

                {/* § 1 */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 1. Postanowienia ogólne
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">1.1. Strony Regulaminu</h3>
                        <p className="leading-relaxed">
                            Niniejszy Regulamin określa zasady funkcjonowania projektu DAOResorts, prowadzonego przez:
                        </p>
                        <div className="bg-[#0E1208] border border-[#2D5A3D]/50 rounded-xl p-6 md:p-8 shadow-sm shadow-[#C9A84C]/5">
                            <p className="font-playfair text-xl md:text-2xl text-[#F5F0E8] border-b border-[#2D5A3D]/30 pb-4 mb-5">WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</p>

                            <div className="space-y-5 text-sm md:text-base text-[#8A9E8A]">
                                <div>
                                    <span className="block text-[10px] md:text-xs uppercase tracking-widest mb-1 text-[#C9A84C]/80">Identyfikatory Spółki</span>
                                    <span className="text-[#F5F0E8] font-medium">KRS 0001188626 • NIP 9731114421 • REGON 542448933</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] md:text-xs uppercase tracking-widest mb-1 text-[#C9A84C]/80">Adres Siedziby</span>
                                    <span className="text-[#F5F0E8] font-medium">ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] md:text-xs uppercase tracking-widest mb-1 text-[#C9A84C]/80">Kontakt & Rejestracja</span>
                                    <span className="text-[#F5F0E8] font-medium block">Data rejestracji: 13 sierpnia 2025 r.</span>
                                    <span className="text-[#F5F0E8] font-medium block mt-1">
                                        Email: <a href="mailto:kontakt@daoresorts.club" className="text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors">kontakt@daoresorts.club</a>
                                    </span>
                                    <span className="text-[#F5F0E8] font-medium block mt-1">
                                        Strona: <a href="https://daoresorts.club" className="text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors">daoresorts.club</a>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="leading-relaxed">zwana dalej <strong>„Spółką"</strong> lub <strong>„Operatorem"</strong>.</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">1.2. Definicje</h3>
                        <p className="leading-relaxed">Na potrzeby niniejszego Regulaminu przyjmuje się następujące definicje:</p>
                        <ul className="space-y-3">
                            {[
                                { term: "DAOResorts", desc: "projekt polegający na budowie i eksploatacji prywatnego resortu wakacyjnego w Silna, Lubuskie, prowadzony przez Spółkę na podstawie modelu zdecentralizowanego zarządzania." },
                                { term: "Resort", desc: "obiekt rekreacyjny zlokalizowany w Silna, Lubuskie, składający się z 6 (sześciu) drewnianych domków mieszkalnych o powierzchni użytkowej 70 m² każdy, wyposażonych w prywatne jacuzzi zewnętrzne, oraz infrastruktury towarzyszącej. Dokładny adres i numer działki: [DO UZUPEŁNIENIA - numer działki, obręb Pszczew, KW]." },
                                { term: "Paszport NFT (Paszport)", desc: "darmowy token NFT (standard ERC-721) wydawany każdemu zarejestrowanemu użytkownikowi aplikacji DAOResorts, stanowiący profil członkowski w społeczności. Paszport nie jest Tokenem Członkowskim i nie uprawnia do pobytów w Resorcie." },
                                { term: "Token Członkowski (Token RWA)", desc: "płatny token NFT (standard ERC-721) reprezentujący dożywotnie prawo do korzystania z Resortu na warunkach określonych w niniejszym Regulaminie. Token Członkowski jest Real World Asset (RWA) powiązanym z fizycznym obiektem nieruchomościowym." },
                                { term: "Member (Członek)", desc: "osoba fizyczna lub prawna posiadająca ważny Token Członkowski oraz aktywną weryfikację KYC." },
                                { term: "Posiadacz Paszportu", desc: "osoba posiadająca Paszport NFT, nieposiadająca Tokenu Członkowskiego." },
                                { term: "DAO (Decentralized Autonomous Organization)", desc: "mechanizm zarządzania projektem DAOResorts, w ramach którego Członkowie głosują nad kluczowymi decyzjami dotyczącymi Resortu. Jeden Token Członkowski = jeden głos." },
                                { term: "Smart Contract", desc: "umowa cyfrowa wdrożona na sieci blockchain Polygon, automatycznie egzekwująca warunki emisji i transferu Tokenów." },
                                { term: "KYC", desc: "procedura weryfikacji tożsamości (Know Your Customer) przeprowadzana przez zewnętrznego dostawcę DidIt.me, wymagana do aktywacji Członkostwa." },
                                { term: "Koszty Operacyjne", desc: "faktyczne koszty eksploatacji Resortu przypadające na jeden pobyt, obliczane zgodnie z § 5 niniejszego Regulaminu." },
                                { term: "Management Fee", desc: "opłata za zarządzanie pobierana przez Spółkę zgodnie z § 5 niniejszego Regulaminu." },
                                { term: "Termin Premium", desc: "okresy zwiększonego popytu podlegające systemowi losowania, określone w § 4 niniejszego Regulaminu." },
                            ].map((item, idx) => (
                                <li key={idx} className="pl-5 relative border-l border-[#2D5A3D]/40 ml-2">
                                    <span className="absolute -left-[3px] top-2.5 w-[5px] h-[5px] bg-[#C9A84C] rounded-full"></span>
                                    <strong className="text-[#F5F0E8] font-medium block mb-1">{item.term}</strong>
                                    <span className="text-[#8A9E8A] text-sm leading-relaxed block">{item.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* § 2 */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 2. Paszport NFT - Profil Członkowski (Bezpłatny)
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">2.1. Charakter Paszportu</h3>
                        <p className="leading-relaxed">
                            Paszport NFT jest bezpłatnym tokenem profilowym wydawanym przez Spółkę każdemu użytkownikowi, który zarejestruje się w aplikacji DAOResorts i przejdzie podstawową weryfikację adresu email.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.2. Parametry emisji</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Łączna emisja Paszportów: <strong className="text-[#F5F0E8]">5 000 (pięć tysięcy) sztuk</strong></li>
                            <li>Cena: <strong className="text-[#F5F0E8]">0 PLN - bezpłatny</strong></li>
                            <li>Koszty aktywacji na sieci blockchain pokrywa Spółka</li>
                            <li>Standard tokenu: ERC-721 na sieci Polygon</li>
                            <li>Adres Smart Contractu: [DO UZUPEŁNIENIA - po deployu]</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.3. Co daje Paszport</h3>
                        <p>Posiadacz Paszportu uzyskuje dostęp do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Profilu członkowskiego w aplikacji DAOResorts z unikalnym awatarem (bober NFT)</li>
                            <li>Podglądu aktywnych i archiwalnych głosowań DAO (bez prawa głosu)</li>
                            <li>Społeczności DAOResorts - forum, kanał Telegram, aktualizacje projektu</li>
                            <li>Aplikacji informacyjnej o stanie budowy Resortu i roadmapie projektu</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.4. Czego Paszport nie daje</h3>
                        <p>Paszport NFT <strong>nie jest</strong> Tokenem Członkowskim i <strong>nie uprawnia</strong> do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-red-400/80">
                            <li>Pobytów w Resorcie</li>
                            <li>Głosowania w DAO</li>
                            <li>Dostępu do systemu rezerwacji</li>
                            <li>Żadnych świadczeń o charakterze finansowym</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.5. Transferowalność Paszportu</h3>
                        <p className="leading-relaxed">
                            Paszport jest nieprzenoszalny - związany jest z zarejestrowanym adresem email i portfelem użytkownika. Transfer Paszportu na inny portfel jest technicznie zablokowany przez Smart Contract.
                        </p>
                    </div>
                </section>

                {/* § 3 */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 3. Token Członkowski RWA - Pełne Członkostwo (Płatne)
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">3.1. Charakter Tokenu Członkowskiego</h3>
                        <p className="leading-relaxed">
                            Token Członkowski jest tokenem NFT (Real World Asset) reprezentującym dożywotnie prawo do korzystania z Resortu DAOResorts na warunkach określonych w niniejszym Regulaminie. Token nie jest instrumentem finansowym, papierem wartościowym ani udziałem w Spółce w rozumieniu przepisów prawa.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.2. Harmonogram płatności i emisja</h3>
                        <p className="leading-relaxed mb-4">Płatność za Token Członkowski została podzielona na 5 (pięć) etapów skorelowanych z postępem prac budowlanych:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li><strong>Etap 0: Rezerwacja</strong> - <strong className="text-[#F5F0E8]">2 000 PLN</strong> (wpisowe zwrotne przyznające numer paszportu)</li>
                            <li><strong>Etap 1: Fundamenty</strong> - <strong className="text-[#F5F0E8]">5 000 PLN</strong> (płatne po uzyskaniu prawomocnego PNB)</li>
                            <li><strong>Etap 2: Konstrukcja</strong> - <strong className="text-[#F5F0E8]">5 000 PLN</strong> (stan surowy otwarty)</li>
                            <li><strong>Etap 3: Wykończenie</strong> - <strong className="text-[#F5F0E8]">3 000 PLN</strong> (instalacje i stolarka)</li>
                            <li><strong>Etap 4: Aktywacja</strong> - <strong className="text-[#F5F0E8]">4 990 PLN</strong> (odbiór końcowy i aktywacja NFT)</li>
                            <li className="mt-2 border-t border-[#2D5A3D] pt-2">Łączna cena: <strong className="text-[#C9A84C]">19 990 PLN</strong></li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.3. Co daje Token Członkowski</h3>
                        <p>Posiadacz aktywnego Tokenu Członkowskiego z ważnym KYC uzyskuje:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-[#C9A84C]">
                            <li><span className="text-[#8A9E8A]">Prawo do <strong>14 (czternastu) nocy rocznie</strong> w Resorcie po Kosztach Operacyjnych (§ 5)</span></li>
                            <li><span className="text-[#8A9E8A]">Prawo do <strong>1 (jednego) głosu</strong> w głosowaniach DAO</span></li>
                            <li><span className="text-[#8A9E8A]">Dostęp do systemu rezerwacji w aplikacji DAOResorts</span></li>
                            <li><span className="text-[#8A9E8A]">Dostęp do giełdy terminów między Memberami</span></li>
                            <li><span className="text-[#8A9E8A]">Dożywotni charakter Członkostwa - bez opłat rocznych ani abonamentowych</span></li>
                            <li><span className="text-[#8A9E8A]">Wgląd w pełną transparentność finansową Resortu przez panel DAO</span></li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.4. Próg uruchomienia budowy</h3>
                        <p className="leading-relaxed">
                            Budowa Resortu zostaje uruchomiona po osiągnięciu progu sprzedaży <strong className="text-[#F5F0E8]">50% Tokenów Członkowskich</strong>, tj. <strong className="text-[#F5F0E8]">75 (siedemdziesiąt pięć) sztuk</strong>.
                        </p>
                        <p className="leading-relaxed">
                            W przypadku nieosiągnięcia progu w terminie <strong>12 (dwunastu) miesięcy</strong> od daty uruchomienia sprzedaży Tokenów, zastosowanie ma § 3.5.
                        </p>
                        <p className="leading-relaxed">
                            O osiągnięciu progu Spółka informuje wszystkich Memberów i Posiadaczy Paszportów za pośrednictwem aplikacji DAOResorts oraz kanału Telegram w ciągu 24 godzin.
                        </p>

                        <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-6 mt-6">
                            <h3 className="text-lg text-[#F5F0E8] font-semibold mb-4 flex items-center gap-2">
                                <span className="text-[#C9A84C]">🛡️</span> 3.5. Polityka zwrotów i zabezpieczenie Memberów
                            </h3>
                            <p className="leading-relaxed mb-4">
                                W przypadku gdy budowa Resortu nie dojdzie do skutku z jakiejkolwiek przyczyny, w tym w szczególności:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 mb-4 text-[#F5F0E8]/80 text-sm">
                                <li>Nieuzyskania pozwolenia na budowę</li>
                                <li>Nieosiągnięcia progu sprzedaży 75 Tokenów w terminie 12 miesięcy</li>
                                <li>Działania siły wyższej uniemożliwiającego realizację projektu</li>
                                <li>Decyzji głosowania DAO o zakończeniu projektu</li>
                            </ul>
                            <p className="leading-relaxed font-semibold text-[#F5F0E8]">
                                Dzięki modelowi 5-etapowemu, Member ponosi ryzyko jedynie w wysokości aktualnie opłaconej transzy. Spółka zobowiązuje się do zwrotu 100% (stu procent) dotychczas wpłaconej kwoty w przypadku trwałego zaprzestania realizacji projektu z przyczyn zależnych od Spółki.
                            </p>
                            <p className="leading-relaxed text-sm mt-4">
                                Zwrot nastąpi w terminie <strong>30 (trzydziestu) dni</strong> od podjęcia decyzji o zakończeniu projektu, przelewem na rachunek bankowy wskazany przez Membera. Token Członkowski zostaje spalony (burn) przez Smart Contract po potwierdzeniu zwrotu na adres Membera.
                            </p>
                        </div>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.6. Wymagania do aktywacji Członkostwa</h3>
                        <p>Pełna aktywacja Członkostwa wymaga łącznie:</p>
                        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
                            <li>Opłacenie Etapu 0 (Rezerwacja: 2 000 PLN) i kolejnych etapów zgodnie z harmonogramem</li>
                            <li>Posiadania Paszportu NFT (darmowy - generowany automatycznie przy rezerwacji)</li>
                            <li>Przejścia weryfikacji KYC przez platformę DidIt.me</li>
                        </ol>
                        <p className="leading-relaxed text-sm opacity-80 mt-2">
                            Do czasu zakończenia weryfikacji KYC dostęp do systemu rezerwacji i głosowań DAO jest zablokowany.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.7. Zasady transferu Tokenu Członkowskiego</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Token Członkowski jest <strong>zbywalny</strong> - może być przedmiotem obrotu na rynku wtórnym (m.in. OpenSea)</li>
                            <li>Przy każdej wtórnej sprzedaży naliczane jest <strong>royalty fee w wysokości 10% (dziesięciu procent)</strong> od ceny sprzedaży, przekazywane do funduszu DAO</li>
                            <li>Spółka posiada <strong>prawo pierwokupu</strong> Tokenu po cenie rynkowej, z terminem realizacji <strong>7 (siedmiu) dni</strong> od otrzymania oferty</li>
                            <li>Nowy nabywca Tokenu musi przejść weryfikację KYC przed aktywacją Członkostwa</li>
                            <li>Transfer nie wymaga zgody Spółki, ale wymaga aktualizacji danych KYC przez nabywcę w terminie <strong>30 (trzydziestu) dni</strong> od nabycia</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.8. Dziedziczenie Tokenu Członkowskiego</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Token Członkowski podlega dziedziczeniu na zasadach ogólnych prawa cywilnego</li>
                            <li>Spadkobierca zobowiązany jest do aktualizacji danych KYC w terminie <strong>90 (dziewięćdziesięciu) dni</strong> od nabycia Tokenu w drodze spadku</li>
                            <li>Do czasu aktualizacji KYC dostęp do rezerwacji i głosowań jest zawieszony</li>
                            <li>Spółka nie ponosi odpowiedzialności za skutki nieaktualizowania KYC przez spadkobiercę</li>
                        </ul>
                    </div>
                </section>

                {/* § 4 */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 4. System rezerwacji
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">4.1. Zasady ogólne</h3>
                        <p className="leading-relaxed">
                            System rezerwacji dostępny jest wyłącznie dla Memberów z aktywnym KYC, za pośrednictwem aplikacji DAOResorts. Każdy Member dysponuje <strong className="text-[#F5F0E8]">14 (czternastoma) nocami rocznie</strong>, które mogą być wykorzystane w jednym lub kilku pobytach, przy czym:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Minimalny pobyt: <strong>2 (dwie) noce</strong></li>
                            <li>Maksymalny pobyt w jednej rezerwacji: <strong>14 (czternaście) nocy</strong></li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.2. Rok rezerwacyjny</h3>
                        <p className="leading-relaxed">
                            Rok rezerwacyjny trwa od <strong>1 stycznia do 31 grudnia</strong>. Niewykorzystane noce w danym roku <strong>nie przechodzą</strong> na rok kolejny i przepadają bez prawa do rekompensaty.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.3. Terminy standardowe - kolejność zgłoszeń</h3>
                        <p className="leading-relaxed">
                            Terminy inne niż Premium (§ 4.4) rezerwowane są w systemie kolejności zgłoszeń - pierwszeństwo ma Member który złoży rezerwację wcześniej w aplikacji. Rezerwacja standardowa możliwa jest z wyprzedzeniem maksymalnie <strong>12 (dwunastu) miesięcy</strong>.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.4. Terminy Premium - system losowania</h3>
                        <p className="leading-relaxed mb-4">Następujące okresy objęte są systemem losowania ze względu na zwiększony popyt:</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1C2614] border-b border-[#2D5A3D]">
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Termin Premium</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Okres</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D5A3D]/30">
                                    <tr><td className="py-3 px-4">Wakacje letnie</td><td className="py-3 px-4">1 lipca - 31 sierpnia</td></tr>
                                    <tr><td className="py-3 px-4">Majówka</td><td className="py-3 px-4">30 kwietnia - 4 maja</td></tr>
                                    <tr><td className="py-3 px-4">Boże Narodzenie</td><td className="py-3 px-4">23 - 27 grudnia</td></tr>
                                    <tr><td className="py-3 px-4">Sylwester / Nowy Rok</td><td className="py-3 px-4">28 grudnia - 2 stycznia</td></tr>
                                    <tr><td className="py-3 px-4">Wielkanoc</td><td className="py-3 px-4">Tydzień obejmujący Niedzielę Wielkanocną</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="font-semibold text-[#F5F0E8] mt-6">Procedura losowania Terminów Premium:</p>
                        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
                            <li>Losowanie odbywa się <strong>1 marca każdego roku</strong> za pośrednictwem aplikacji DAOResorts</li>
                            <li>Do <strong>28 lutego</strong> każdy Member może zgłosić chęć skorzystania z wybranych Terminów Premium przez aplikację</li>
                            <li>Przy nadmiarze chętnych na dany termin - losowanie elektroniczne z weryfikowalnym wynikiem rejestrowanym publicznie</li>
                            <li><strong>System rotacji sprawiedliwości:</strong>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li>Member który wygrał Termin Premium w danym roku - w kolejnym losowaniu tej samej kategorii terminu otrzymuje <strong>niższy priorytet</strong>, do czasu gdy wszyscy chętni skorzystają co najmniej raz</li>
                                    <li>Member który nie wygrał żadnego Terminu Premium - w kolejnym losowaniu otrzymuje <strong>wyższy priorytet</strong></li>
                                </ul>
                            </li>
                            <li>Wyniki losowania publikowane są w aplikacji DAOResorts w ciągu <strong>24 godzin</strong></li>
                        </ol>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.5. Godziny check-in i check-out</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li><strong>Check-in:</strong> 15:00</li>
                            <li><strong>Check-out:</strong> 11:00</li>
                        </ul>
                        <p className="leading-relaxed mt-2 opacity-80 text-sm">
                            Wcześniejszy check-in lub późniejszy check-out możliwy wyłącznie po indywidualnym uzgodnieniu z Operatorem minimum <strong>48 godzin</strong> przed przyjazdem, w zależności od dostępności domku.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.6. Anulowanie rezerwacji</h3>
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1C2614] border-b border-[#2D5A3D]">
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Czas do pobytu</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Skutek anulowania</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D5A3D]/30">
                                    <tr><td className="py-3 px-4 font-semibold text-[#F5F0E8]">Powyżej 14 dni</td><td className="py-3 px-4 text-[#C9A84C]">Noce wracają na konto Membera w bieżącym roku</td></tr>
                                    <tr><td className="py-3 px-4 font-semibold text-[#F5F0E8]">7-13 dni</td><td className="py-3 px-4">Zwrot 50% niewykorzystanych nocy</td></tr>
                                    <tr><td className="py-3 px-4 font-semibold text-[#F5F0E8]">Poniżej 7 dni</td><td className="py-3 px-4 text-red-400">Noce przepadają w danym roku rezerwacyjnym</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed mt-2 text-sm opacity-80">
                            Anulowanie Terminów Premium podlega tym samym zasadom. Zwrot nocy realizowany jest automatycznie przez system w ciągu 24 godzin od anulowania.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.7. Giełda terminów między Memberami</h3>
                        <p className="leading-relaxed">Member który nie może skorzystać z zarezerwowanego terminu może:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Wystawić termin na <strong>giełdzie wewnętrznej</strong> aplikacji DAOResorts</li>
                            <li>Przekazać lub sprzedać termin innemu Memberowi za uzgodnioną opłatą</li>
                            <li>Transakcja rejestrowana jest w systemie i wymaga potwierdzenia obu stron</li>
                            <li>Giełda dostępna jest wyłącznie dla Memberów z aktywnym KYC</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.8. Użyczenie terminu gościom</h3>
                        <p className="leading-relaxed">Member może zaprosić do Resortu osoby niebędące Memberami (rodzina, znajomi) pod warunkiem:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Podania danych gości (imię, nazwisko, liczba osób) w aplikacji DAOResorts przy dokonaniu rezerwacji</li>
                            <li>Gościom przysługują wszystkie udogodnienia Resortu w trakcie pobytu</li>
                            <li>Member ponosi pełną odpowiedzialność za zachowanie zaproszonych gości i wszelkie szkody przez nich wyrządzone</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.9. Zakaz wynajmu komercyjnego przez Membera</h3>
                        <p className="leading-relaxed border-l-4 border-red-500/50 pl-4 py-1">
                            Member <strong>nie może</strong> wynajmować swojego terminu osobom trzecim za wynagrodzeniem we własnym imieniu. Wynajem komercyjny prowadzony jest wyłącznie przez Spółkę w ramach 7. budynku operacyjnego. Naruszenie tego zakazu skutkuje <strong className="text-red-400">zawieszeniem dostępu do systemu rezerwacji</strong> do czasu wyjaśnienia sprawy przez DAO.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.10. Maksymalna liczba osób w domku</h3>
                        <p className="leading-relaxed">
                            Każdy domek może pomieścić maksymalnie <strong className="text-[#F5F0E8]">6 (sześć) osób</strong>. Przekroczenie limitu jest niedozwolone ze względów bezpieczeństwa przeciwpożarowego i sanitarnego.
                        </p>
                    </div>
                </section>

                {/* § 5 */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 5. Koszty operacyjne i rozliczenia
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">5.1. Zasada at cost</h3>
                        <p className="leading-relaxed">
                            Celem DAOResorts jest zapewnienie pobytów <strong>po rzeczywistych kosztach operacyjnych</strong> - bez marży hotelowej i bez zysku na noclegach. Member płaci wyłącznie za faktyczne koszty utrzymania Resortu przypadające na jego pobyt plus Management Fee (§ 5.3).
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.2. Składowe Kosztów Operacyjnych</h3>
                        <p className="leading-relaxed mb-4">Koszty Operacyjne jednego pobytu tygodniowego (7 nocy, 1 domek) obejmują:</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1C2614] border-b border-[#2D5A3D]">
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Pozycja</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium text-right">Szacunkowy koszt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D5A3D]/30">
                                    <tr><td className="py-3 px-4">Energia elektryczna (ogrzewanie, klimatyzacja, bojler)</td><td className="py-3 px-4 text-right font-mono">~208 PLN</td></tr>
                                    <tr><td className="py-3 px-4">Woda (7 nocy, do 6 osób)</td><td className="py-3 px-4 text-right font-mono">~63 PLN</td></tr>
                                    <tr><td className="py-3 px-4">Jacuzzi (napełnienie, nagrzewanie, chemia, wymiana wody po pobycie)</td><td className="py-3 px-4 text-right font-mono">~131 PLN</td></tr>
                                    <tr><td className="py-3 px-4">Sprzątanie końcowe</td><td className="py-3 px-4 text-right font-mono">~175 PLN</td></tr>
                                    <tr className="bg-[#1C2614]/50"><td className="py-3 px-4 font-semibold text-[#F5F0E8]">Razem koszty bazowe</td><td className="py-3 px-4 text-right font-bold text-[#F5F0E8]">~577 PLN</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed mt-2 text-sm opacity-80">
                            Powyższe kwoty są szacunkowe i mogą ulec zmianie wraz ze zmianą cen energii i usług. Aktualne stawki publikowane są w aplikacji DAOResorts i zatwierdzane przez głosowanie DAO. Zmiana Kosztów Operacyjnych o więcej niż 15% wymaga głosowania DAO (§ 8.3).
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.3. Management Fee</h3>
                        <p className="leading-relaxed">
                            Do Kosztów Operacyjnych doliczane jest <strong>Management Fee w wysokości 20% (dwudziestu procent)</strong> od sumy kosztów bazowych, pobierane przez Spółkę tytułem wynagrodzenia za zarządzanie Resortem.
                        </p>

                        <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-6 mt-4">
                            <h4 className="text-[#C9A84C] font-semibold mb-3">Przykład rozliczenia:</h4>
                            <div className="space-y-2 font-mono text-sm max-w-sm">
                                <div className="flex justify-between">
                                    <span>Koszty bazowe pobytu tygodniowego</span>
                                    <span className="text-[#F5F0E8]">577 PLN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Management Fee 20%</span>
                                    <span className="text-[#F5F0E8]">115 PLN</span>
                                </div>
                                <div className="flex justify-between border-t border-[#2D5A3D] pt-2 mt-2 font-bold text-[#C9A84C] text-base">
                                    <span>Łączny koszt pobytu tygodniowego</span>
                                    <span>~692 PLN</span>
                                </div>
                            </div>
                            <p className="mt-4 text-sm opacity-80 italic">
                                Dla porównania: tygodniowy pobyt w hotelu premium z jacuzzi w Polsce - 5 600-8 000 PLN.
                            </p>
                        </div>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.4. Rozliczenie kosztów</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Koszty Operacyjne pobierane są przez aplikację DAOResorts przed każdym pobytem</li>
                            <li>Faktura VAT wystawiana jest przez Spółkę na życzenie Membera</li>
                            <li>Rozliczenie odbywa się w PLN, przelewem bankowym lub kartą płatniczą</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.5. Podział środków ze sprzedaży Tokenów Członkowskich</h3>
                        <p className="leading-relaxed mb-4">
                            Ze środków uzyskanych ze sprzedaży 150 Tokenów Członkowskich (łącznie do 2 998 500 PLN brutto):
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1C2614] border-b border-[#2D5A3D]">
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Przeznaczenie</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Procent</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium text-right">Kwota (przy pełnej sprzedaży)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D5A3D]/30">
                                    <tr><td className="py-3 px-4">Budowa Resortu (materiały, robocizna, infrastruktura)</td><td className="py-3 px-4 text-[#C9A84C] font-mono">70%</td><td className="py-3 px-4 text-right font-mono">~2 098 950 PLN</td></tr>
                                    <tr><td className="py-3 px-4">Fundusz remontowy i operacyjny DAO</td><td className="py-3 px-4 text-[#C9A84C] font-mono">10%</td><td className="py-3 px-4 text-right font-mono">~299 850 PLN</td></tr>
                                    <tr><td className="py-3 px-4">Koszty developmentu, obsługa prawna, marketing, wynagrodzenie foundera</td><td className="py-3 px-4 text-[#C9A84C] font-mono">20%</td><td className="py-3 px-4 text-right font-mono">~599 700 PLN</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed mt-2 text-sm opacity-80">
                            Pełne zestawienie wydatków publikowane jest w transparentnym panelu DAO w czasie rzeczywistym.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.6. Przychody z wynajmu komercyjnego</h3>
                        <p className="leading-relaxed mb-4">
                            Spółka prowadzi wynajem komercyjny 7. budynku operacyjnego Resortu przez platformy zewnętrzne. Przychody z tego wynajmu dzielone są:
                        </p>
                        <ul className="space-y-3 font-mono text-sm">
                            <li className="flex gap-4"><span className="text-[#C9A84C] w-12">50%</span> <span>→ fundusz operacyjny DAO (obniżenie Kosztów Operacyjnych dla Memberów)</span></li>
                            <li className="flex gap-4"><span className="text-[#C9A84C] w-12">35%</span> <span>→ fundusz remontowy DAO</span></li>
                            <li className="flex gap-4"><span className="text-[#C9A84C] w-12">20%</span> <span>→ wynagrodzenie operacyjne Spółki</span></li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.7. Royalty fee z wtórnego obrotu Tokenami</h3>
                        <p className="leading-relaxed">
                            10% wartości każdej wtórnej transakcji Tokenem Członkowskim przekazywane jest do funduszu DAO, przeznaczonego na utrzymanie i rozwój Resortu.
                        </p>
                    </div>
                </section>

                {/* § 6 */}
                <section className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 6. Zasady pobytu w Resorcie
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">6.1. Obowiązki Membera i gości</h3>
                        <p>Member oraz zaproszeni przez niego goście zobowiązani są do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Przestrzegania niniejszego Regulaminu oraz szczegółowego Regulaminu Resortu dostępnego w każdym domku</li>
                            <li>Dbania o powierzone mienie - wszelkie szkody pokrywa Member</li>
                            <li>Poszanowania ciszy nocnej w godzinach <strong>22:00 - 8:00</strong></li>
                            <li>Niezwłocznego zgłaszania usterek i awarii obsłudze Resortu przez aplikację lub telefonicznie</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.2. Zakazy obowiązujące na terenie Resortu</h3>
                        <ul className="space-y-3 text-[#F5F0E8]">
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zakaz palenia</strong> wyrobów tytoniowych i e-papierosów wewnątrz domków (dopuszczalne wyłącznie na zewnątrz, w wyznaczonych miejscach)</li>
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zakaz organizowania imprez</strong> z udziałem osób spoza listy gości zgłoszonych w rezerwacji</li>
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zakaz przekraczania limitu</strong> 6 osób w domku</li>
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zakaz wprowadzania zwierząt</strong> na teren Resortu, w tym do domków i na tarasy.</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.3. Zasady korzystania z jacuzzi</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Jacuzzi napełniane jest świeżą wodą i uzdatniane systemem UV-C przed każdym nowym pobytem</li>
                            <li>Obowiązkowy prysznic przed wejściem do jacuzzi</li>
                            <li>Zakaz używania środków pieniących (płyny do kąpieli, szampony, olejki) w jacuzzi</li>
                            <li>Jacuzzi dostępne wyłącznie dla gości danego domku</li>
                            <li>Dzieci do lat 12 korzystają z jacuzzi wyłącznie pod nadzorem dorosłego</li>
                            <li>Temperatura wody: 36-40°C (na życzenie możliwa regulacja)</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.4. Odpowiedzialność za szkody</h3>
                        <p className="leading-relaxed">
                            Member odpowiada finansowo za wszelkie szkody wyrządzone przez siebie lub zaproszonych gości w mieniu Resortu. Wysokość odszkodowania ustalana jest przez Spółkę na podstawie kosztów naprawy lub wymiany. Member ma prawo do odwołania się od wyceny szkody do DAO w terminie 14 dni.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.5. Parking</h3>
                        <p className="leading-relaxed">
                            Resort dysponuje wspólnym parkingiem przy wjeździe. Liczba miejsc parkingowych: [DO UZUPEŁNIENIA]. Parking jest bezpłatny dla gości Resortu.
                        </p>
                    </div>
                </section >

                {/* § 7 */}
                < section className="space-y-6" >
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 7. Prawa i obowiązki Membera
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">7.1. Prawa Membera</h3>
                        <p>Member ma prawo do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-[#C9A84C]">
                            <li><span className="text-[#8A9E8A]">Korzystania z 14 nocy rocznie w Resorcie po Kosztach Operacyjnych</span></li>
                            <li><span className="text-[#8A9E8A]">Głosowania w DAO (1 Token = 1 głos)</span></li>
                            <li><span className="text-[#8A9E8A]">Zgłaszania propozycji pod głosowanie DAO</span></li>
                            <li><span className="text-[#8A9E8A]">Wglądu w pełną dokumentację finansową Resortu przez panel DAO</span></li>
                            <li><span className="text-[#8A9E8A]">Dostępu do giełdy terminów</span></li>
                            <li><span className="text-[#8A9E8A]">Transferu lub sprzedaży Tokenu Członkowskiego na rynku wtórnym</span></li>
                            <li><span className="text-[#8A9E8A]">Uczestnictwa w społeczności DAOResorts</span></li>
                            <li><span className="text-[#8A9E8A]">Otrzymania pełnego zwrotu 100% wpłaconej kwoty w przypadkach określonych w § 3.5</span></li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">7.2. Obowiązki Membera</h3>
                        <p>Member zobowiązany jest do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Utrzymania aktualnych danych KYC - zmiana danych osobowych wymaga aktualizacji w terminie <strong>30 dni</strong></li>
                            <li>Przestrzegania Regulaminu i Regulaminu Resortu</li>
                            <li>Terminowego regulowania Kosztów Operacyjnych przed każdym pobytem</li>
                            <li>Zgłaszania gości w systemie rezerwacji przed przyjazdem</li>
                            <li>Odpowiedzialnego zarządzania danymi dostępowymi do konta i portfela</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">7.3. Zawieszenie Członkostwa</h3>
                        <p className="leading-relaxed">Spółka może zawiesić dostęp Membera do systemu rezerwacji i głosowań w przypadku:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-red-400/80">
                            <li>Naruszenia Regulaminu (§ 6)</li>
                            <li>Nieuregulowania należnych Kosztów Operacyjnych</li>
                            <li>Prowadzenia wynajmu komercyjnego wbrew § 4.9</li>
                            <li>Nieaktualizowania danych KYC w wymaganym terminie</li>
                        </ul>
                        <p className="leading-relaxed mt-4">
                            Zawieszenie <strong>nie pozbawia</strong> Membera prawa własności Tokenu Członkowskiego. O zawieszeniu Member informowany jest niezwłocznie przez email. Member ma prawo do odwołania się do DAO w terminie 14 dni.
                        </p>
                    </div>
                </section >

                {/* § 8 */}
                < section className="space-y-6" >
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 8. Zarządzanie DAO
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">8.1. Zasady głosowania</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Prawo głosu przysługuje wyłącznie Memberom z aktywnym KYC</li>
                            <li>Jeden Token Członkowski = jeden głos</li>
                            <li>Głosowania prowadzone są przez aplikację DAOResorts, wyniki rejestrowane są publicznie</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">8.2. Quorum</h3>
                        <p className="leading-relaxed">
                            Głosowanie jest ważne jeżeli weźmie w nim udział co najmniej <strong className="text-[#F5F0E8]">30% (trzydzieści procent)</strong> wszystkich aktywnych Memberów, tj. co najmniej <strong className="text-[#F5F0E8]">45 (czterdzieści pięć)</strong> Tokenów przy pełnej emisji 150. Jeżeli quorum nie zostanie osiągnięte, głosowanie zostaje powtórzone w terminie 14 dni z obniżonym quorum <strong>20%</strong>.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">8.3. Decyzje wymagające głosowania DAO</h3>
                        <p>Obligatoryjnemu głosowaniu DAO podlegają:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Zmiany Kosztów Operacyjnych o więcej niż 20%</li>
                            <li>Zmiany Management Fee</li>
                            <li>Decyzje o przeznaczeniu funduszu remontowego powyżej 10 000 PLN</li>
                            <li>Zakup nowych działek lub rozbudowa Resortu (Etap 2)</li>
                            <li>Zmiany niniejszego Regulaminu</li>
                            <li>Decyzja o likwidacji projektu i zwrocie środków</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">8.4. Decyzje Operatora</h3>
                        <p>Spółka podejmuje samodzielnie decyzje operacyjne niewymagające głosowania DAO:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Wybór dostawców usług i materiałów</li>
                            <li>Zarządzanie personelem Resortu</li>
                            <li>Codzienne zarządzanie i utrzymanie Resortu</li>
                            <li>Działania marketingowe i PR</li>
                            <li>Decyzje wymagające natychmiastowego działania (awarie, bezpieczeństwo)</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">8.5. Propozycje Memberów</h3>
                        <p className="leading-relaxed">
                            Każdy Member może złożyć propozycję pod głosowanie DAO za pośrednictwem aplikacji. Propozycja zostaje poddana pod głosowanie formalne po uzyskaniu poparcia co najmniej <strong className="text-[#F5F0E8]">10 (dziesięciu) Memberów</strong> w ciągu 14 dni od złożenia.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">8.6. Czas trwania głosowania</h3>
                        <p className="leading-relaxed">
                            Standardowe głosowanie trwa <strong className="text-[#F5F0E8]">7 (siedem) dni</strong>. W przypadkach pilnych Spółka może skrócić czas do <strong>48 godzin</strong>, informując Memberów z wyprzedzeniem minimum 12 godzin.
                        </p>
                    </div>
                </section >

                {/* § 9 */}
                < section className="space-y-6" >
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 9. Ochrona danych osobowych
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">9.1. Administrator danych</h3>
                        <p className="leading-relaxed">
                            Administratorem danych osobowych jest:<br />
                            WE3.CLUB RESORT DEVELOPMENT SP. Z O.O., ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra, <a href="mailto:kontakt@daoresorts.club" className="text-[#C9A84C] hover:underline">kontakt@daoresorts.club</a>
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">9.2. Zakres i cel przetwarzania</h3>
                        <p>Dane przetwarzane są w celu:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Świadczenia usług członkowskich i zarządzania rezerwacjami</li>
                            <li>Weryfikacji KYC (procesor zewnętrzny: DidIt.me)</li>
                            <li>Komunikacji z Memberami i Posiadaczami Paszportów</li>
                            <li>Realizacji głosowań DAO</li>
                            <li>Wystawiania faktur VAT</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">9.3. Podstawa prawna</h3>
                        <p>Przetwarzanie danych odbywa się na podstawie:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>RODO art. 6 ust. 1 lit. b - wykonanie umowy</li>
                            <li>RODO art. 6 ust. 1 lit. c - obowiązek prawny (KYC)</li>
                        </ul>
                        <p className="leading-relaxed mt-4 text-sm opacity-80">
                            Szczegółowe zasady przetwarzania danych określa Polityka Prywatności dostępna pod adresem <a href="/polityka-prywatnosci" className="text-[#C9A84C] hover:underline">daoresorts.club/polityka-prywatnosci</a>
                        </p>
                    </div>
                </section >

                {/* § 10 */}
                < section className="space-y-6" >
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 10. Postanowienia końcowe
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">10.1. Prawo właściwe</h3>
                        <p className="leading-relaxed">
                            Niniejszy Regulamin podlega prawu polskiemu. W sprawach nieuregulowanych zastosowanie mają przepisy Kodeksu Cywilnego oraz innych właściwych ustaw.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">10.2. Rozwiązywanie sporów</h3>
                        <p className="leading-relaxed">
                            Wszelkie spory wynikające z niniejszego Regulaminu strony będą rozstrzygać w pierwszej kolejności polubownie, z udziałem społeczności DAO. W przypadku braku porozumienia właściwy jest sąd właściwy dla siedziby Spółki (Zielona Góra).
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">10.3. Zmiany Regulaminu</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Zmiany Regulaminu wymagają głosowania DAO i ogłoszenia z minimum <strong className="text-[#F5F0E8]">30-dniowym</strong> wyprzedzeniem przed wejściem w życie</li>
                            <li>Zmiany dotyczące § 3 (Token Członkowski - cena, supply, prawa) wymagają kwalifikowanej większości <strong className="text-[#F5F0E8]">75% głosów</strong></li>
                            <li>Zmiany dotyczące § 3.5 (polityka zwrotów) wymagają kwalifikowanej większości <strong className="text-[#F5F0E8]">90% głosów</strong></li>
                            <li>O każdej zmianie Memberowie informowani są przez email i aplikację</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">10.4. Klauzula salwatoryjna</h3>
                        <p className="leading-relaxed">
                            Jeżeli jakiekolwiek postanowienie Regulaminu okaże się nieważne lub bezskuteczne, pozostałe postanowienia pozostają w mocy. Strony zobowiązują się zastąpić nieważne postanowienie postanowieniem zgodnym z prawem i zbliżonym do pierwotnego zamiaru.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">10.5. Kontakt</h3>
                        <div className="bg-[#0E1208] border border-[#2D5A3D]/50 rounded-xl p-6 md:p-8 space-y-4 shadow-sm shadow-[#C9A84C]/5 mt-4">
                            <p className="text-[#8A9E8A] text-sm uppercase tracking-widest mb-1">W sprawach dotyczących Regulaminu:</p>
                            <p className="font-playfair text-xl text-[#F5F0E8] border-b border-[#2D5A3D]/30 pb-3">WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</p>
                            <div className="space-y-3 text-sm">
                                <p className="flex flex-col sm:flex-row sm:justify-between md:justify-start md:gap-4"><span className="text-[#8A9E8A] inline-block min-w-[60px]">Adres:</span> <span className="text-[#F5F0E8] font-medium break-words text-right sm:text-left">ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra</span></p>
                                <p className="flex justify-between md:justify-start md:gap-4"><span className="text-[#8A9E8A] inline-block min-w-[60px]">Email:</span> <a href="mailto:kontakt@daoresorts.club" className="text-[#C9A84C] hover:text-[#C9A84C]/80 font-medium break-all">kontakt@daoresorts.club</a></p>
                                <p className="flex justify-between md:justify-start md:gap-4"><span className="text-[#8A9E8A] inline-block min-w-[60px]">Strona:</span> <a href="https://daoresorts.club" className="text-[#C9A84C] hover:text-[#C9A84C]/80 font-medium break-all">daoresorts.club</a></p>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Footer info */}
                < div className="border-t border-[#2D5A3D]/50 pt-8 mt-16 text-center text-sm text-[#8A9E8A] opacity-80" >
                    <p className="italic">Regulamin wchodzi w życie z dniem [15.03.2026].</p>
                    <p className="font-semibold mt-2">WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</p>
                </div >

            </div >
        </div >
    );
}
