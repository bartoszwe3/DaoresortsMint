import React from "react";

export default function Regulamin() {
    return (
        <div className="min-h-screen bg-[#0E1208] text-[#8A9E8A] pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4 border-b border-[#2D5A3D]/50 pb-8">
                    <h1 className="font-playfair text-3xl md:text-5xl text-[#F5F0E8] font-bold tracking-tight uppercase">
                        REGULAMIN CZŁONKOSTWA DAORESORTS
                    </h1>
                    <h2 className="text-xl md:text-2xl text-[#C9A84C] font-semibold tracking-wide">
                        WE3.CLUB RESORT DEVELOPMENT <br className="md:hidden" /> SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-[#8A9E8A] opacity-80 uppercase tracking-widest">
                        <span>Wersja: <span className="text-[#F5F0E8]">1.0</span></span>
                        <span>Data wejścia w życie: <span className="text-[#F5F0E8]">[DO UZUPEŁNIENIA — data przed launchem]</span></span>
                    </div>
                </div>
                             <div className="space-y-6">
                    <div className="flex flex-col space-y-6">
                        <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                            § 1. POSTANOWIENIA OGÓLNE
                        </h2>

                        <div className="space-y-4">
                            <h3 className="text-lg text-[#F5F0E8] font-semibold">1.1. Strony Regulaminu</h3>
                            <p className="leading-relaxed">
                                Niniejszy Regulamin określa zasady funkcjonowania projektu DAOResorts, prowadzonego przez:
                            </p>
                            <div className="bg-[#0E1208] border border-[#2D5A3D]/50 rounded-xl p-6 md:p-8 shadow-sm shadow-[#C9A84C]/5">
                                <p className="font-playfair text-xl md:text-2xl text-[#F5F0E8] border-b border-[#2D5A3D]/30 pb-4 mb-5 uppercase tracking-wide">WE3.CLUB RESORT DEVELOPMENT SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</p>

                                <div className="space-y-5 text-sm md:text-base text-[#8A9E8A]">
                                    <div>
                                        <span className="block text-[10px] md:text-xs uppercase tracking-widest mb-1 text-[#C9A84C]/80">Identyfikatory Spółki</span>
                                        <span className="text-[#F5F0E8] font-medium">KRS: 0001188626 • NIP: 9731114421 • REGON: 542448933</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] md:text-xs uppercase tracking-widest mb-1 text-[#C9A84C]/80">Adres Siedziby</span>
                                        <span className="text-[#F5F0E8] font-medium">ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra</span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] md:text-xs uppercase tracking-widest mb-1 text-[#C9A84C]/80">Kontakt & Rejestracja</span>
                                        <span className="text-[#F5F0E8] font-medium block">Data rejestracji: 13 sierpnia 2025 r.</span>
                                        <span className="text-[#F5F0E8] font-medium block mt-1">
                                            Email: <a href="mailto:bartosz@daoresorts.club" className="text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors">bartosz@daoresorts.club</a>
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
                                    { term: "„DAOResorts”", desc: "projekt polegający na budowie i eksploatacji prywatnego resortu wakacyjnego w Silna, Lubuskie, prowadzony przez Spółkę na podstawie modelu zdecentralizowanego zarządzania." },
                                    { term: "„Resort”", desc: "obiekt rekreacyjny zlokalizowany w Silna, Lubuskie, składający się z 6 (sześciu) drewnianych domków mieszkalnych o powierzchni użytkowej 70 m² każdy, wyposażonych w prywatne jacuzzi zewnętrzne, oraz infrastruktury towarzyszącej. Dokładny adres i numer działki: 248/50, obręb Silna." },
                                    { term: "„Paszport NFT” lub „Paszport”", desc: "darmowy token NFT (standard ERC-721) wydawany każdemu zarejestrowanemu użytkownikowi aplikacji DAOResorts, stanowiący profil członkowski w społeczności. Paszport nie jest Tokenem Członkowskim i nie uprawnia do pobytów w Resorcie." },
                                    { term: "„Token Członkowski” lub „Token RWA”", desc: "płatny token NFT (standard ERC-721) reprezentujący dożywotnie prawo do korzystania z Resortu na warunkach określonych w niniejszym Regulaminie. Token Członkowski jest Real World Asset (RWA) powiązanym z fizycznym obiektem nieruchomościowym." },
                                    { term: "„Member” lub „Członek”", desc: "osoba fizyczna lub prawna posiadająca ważny Token Członkowski oraz aktywną weryfikację KYC." },
                                    { term: "„Posiadacz Paszportu”", desc: "osoba posiadająca Paszport NFT, nieposiadająca Tokenu Członkowskiego." },
                                    { term: "„DAO” (Decentralized Autonomous Organization)", desc: "mechanizm zarządzania projektem DAOResorts, w ramach którego Członkowie głosują nad kluczowymi decyzjami dotyczącymi Resortu. Jeden Token Członkowski = jeden głos." },
                                    { term: "„Smart Contract”", desc: "umowa cyfrowa wdrożona na sieci blockchain Polygon, automatycznie egzekwująca warunki emisji i transferu Tokenów." },
                                    { term: "„KYC”", desc: "procedura weryfikacji tożsamości (Know Your Customer) przeprowadzana przez zewnętrznego dostawcę DidIt.me, wymagana do aktywacji Członkostwa." },
                                    { term: "„Koszty Operacyjne”", desc: "faktyczne koszty eksploatacji Resortu przypadające na jeden pobyt, obliczane zgodnie z § 5 niniejszego Regulaminu." },
                                    { term: "„Management Fee”", desc: "opłata za zarządzanie pobierana przez Spółkę zgodnie z § 5 niniejszego Regulaminu." },
                                    { term: "„Termin Premium”", desc: "okresy zwiększonego popytu podlegające systemowi losowania, określone w § 4 niniejszego Regulaminu." },
                                ].map((item, idx) => (
                                    <li key={idx} className="pl-5 relative border-l border-[#2D5A3D]/40 ml-2">
                                        <span className="absolute -left-[3px] top-2.5 w-[5px] h-[5px] bg-[#C9A84C] rounded-full"></span>
                                        <strong className="text-[#F5F0E8] font-medium block mb-1">{item.term}</strong>
                                        <span className="text-[#8A9E8A] text-sm leading-relaxed block">{item.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>


                {/* § 2 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 2. PASZPORT NFT — PROFIL CZŁONKOWSKI (BEZPŁATNY)
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">2.1. Charakter Paszportu</h3>
                        <p className="leading-relaxed">
                            Paszport NFT jest bezpłatnym tokenem profilowym wydawanym przez Spółkę każdemu użytkownikowi, który zarejestruje się w aplikacji DAOResorts i przejdzie podstawową weryfikację adresu email.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.2. Parametry emisji</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Łączna emisja Paszportów: <strong className="text-[#F5F0E8]">5 000 (pięć tysięcy) sztuk</strong></li>
                            <li>Cena: <strong className="text-[#F5F0E8]">0 PLN — bezpłatny</strong></li>
                            <li>Koszty aktywacji na sieci blockchain pokrywa Spółka</li>
                            <li>Standard tokenu: ERC-721 na sieci Polygon</li>
                            <li>Adres Smart Contractu: [DO UZUPEŁNIENIA — po deployu]</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.3. Co daje Paszport</h3>
                        <p>Posiadacz Paszportu uzyskuje dostęp do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Profilu członkowskiego w aplikacji DAOResorts z unikalnym awatarem (bober NFT)</li>
                            <li>Podglądu aktywnych i archiwalnych głosowań DAO (bez prawa głosu)</li>
                            <li>Społeczności DAOResorts — forum, kanał Telegram, aktualizacje projektu</li>
                            <li>Aplikacji informacyjnej o stanie budowy Resortu i roadmapie projektu</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.4. Czego Paszport nie daje</h3>
                        <p>Paszport NFT <strong>nie jest</strong> Tokenem Członkowskim i <strong>nie uprawnia</strong> do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-red-400/80 font-medium">
                            <li>Pobytów v Resorcie</li>
                            <li>Głosowania w DAO</li>
                            <li>Dostępu do systemu rezerwacji</li>
                            <li>Żadnych świadczeń o charakterze finansowym</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">2.5. Transferowalność Paszportu</h3>
                        <p className="leading-relaxed">
                            Paszport jest nieprzenoszalny — związany jest z zarejestrowanym adresem email i portfelem użytkownika. Transfer Paszportu na inny portfel jest technicznie zablokowany przez Smart Contract.
                        </p>
                    </div>
                </div>

                {/* § 3 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 3. TOKEN CZŁONKOWSKI RWA — PEŁNE CZŁONKOSTWO (PŁATNE)
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">3.1. Charakter Tokenu Członkowskiego</h3>
                        <p className="leading-relaxed">
                            Token Członkowski jest tokenem NFT (Real World Asset) reprezentującym dożywotnie prawo do korzystania z Resortu DAOResorts na warunkach określonych w niniejszym Regulaminie. Token nie jest instrumentem finansowym, papierem wartościowym ani udziałem w Spółce w rozumieniu przepisów prawa.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.2. Harmonogram płatności etapowych</h3>
                        <p className="leading-relaxed mb-4">Płatność za Token Członkowski podzielona jest na <strong>5 (pięć) etapów</strong> skorelowanych z postępem prac budowlanych:</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1C2614] border-b border-[#2D5A3D]">
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Etap</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Nazwa</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Kwota</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Trigger</th>
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium">Zwrot</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D5A3D]/30 text-sm">
                                    <tr><td className="py-3 px-4">0</td><td className="py-3 px-4">Rezerwacja</td><td className="py-3 px-4 font-bold">2 000 PLN</td><td className="py-3 px-4">Dostępne teraz</td><td className="py-3 px-4 text-green-400">100% zwrotne *</td></tr>
                                    <tr><td className="py-3 px-4">1</td><td className="py-3 px-4">Fundamenty</td><td className="py-3 px-4 font-bold">5 000 PLN</td><td className="py-3 px-4">Po uzyskaniu PNB</td><td className="py-3 px-4 opacity-50">Brak **</td></tr>
                                    <tr><td className="py-3 px-4">2</td><td className="py-3 px-4">Konstrukcja</td><td className="py-3 px-4 font-bold">5 000 PLN</td><td className="py-3 px-4">Stan surowy otwarty</td><td className="py-3 px-4 opacity-50">Brak **</td></tr>
                                    <tr><td className="py-3 px-4">3</td><td className="py-3 px-4">Wykończenie</td><td className="py-3 px-4 font-bold">3 000 PLN</td><td className="py-3 px-4">Instalacje i stolarka</td><td className="py-3 px-4 opacity-50">Brak **</td></tr>
                                    <tr><td className="py-3 px-4">4</td><td className="py-3 px-4">Aktywacja</td><td className="py-3 px-4 font-bold">4 990 PLN</td><td className="py-3 px-4">Odbiór końcowy i otwarcie</td><td className="py-3 px-4 opacity-50">Brak **</td></tr>
                                    <tr className="bg-[#1C2614]/30"><td colSpan={2} className="py-3 px-4 font-bold uppercase tracking-widest text-[#C9A84C]">Łącznie</td><td className="py-3 px-4 font-bold text-[#C9A84C]">19 990 PLN</td><td colSpan={2}></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs opacity-60 mt-2 italic leading-relaxed">
                            * Zwrot 100% Etapu 0 w przypadkach określonych w § 3.5. <br />
                            ** Brak zwrotu po Etapie 1+. Token jest jednak w pełni transferowalny — Member może sprzedać swoje miejsce innemu na giełdzie wewnętrznej lub rynku wtórnym (§ 3.7).
                        </p>

                        <ul className="list-disc pl-6 space-y-2 leading-relaxed mt-4">
                            <li>Standard tokenu: ERC-721 na sieci Polygon</li>
                            <li>Adres Smart Contractu: [DO UZUPEŁNIENIA — po deployu]</li>
                            <li>Jeden Member może posiadać maksymalnie <strong>1 (jeden)</strong> Token Członkowski</li>
                            <li>Łączna emisja w Etapie 1: <strong>150 (sto pięćdziesiąt) sztuk</strong> — limit nieprzekraczalny</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.3. Co daje Token Członkowski</h3>
                        <p>Posiadacz aktywnego Tokenu Członkowskiego z ważnym KYC uzyskuje:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-[#C9A84C]">
                            <li><span className="text-[#8A9E8A]">Prawo do <strong>14 (czternastu) nocy rocznie</strong> w Resorcie po Kosztach Operacyjnych (§ 5)</span></li>
                            <li><span className="text-[#8A9E8A]">Prawo do <strong>1 (jednego) głosu</strong> w głosowaniach DAO</span></li>
                            <li><span className="text-[#8A9E8A]">Dostęp do systemu rezerwacji w aplikacji DAOResorts</span></li>
                            <li><span className="text-[#8A9E8A]">Dostęp do giełdy terminów między Memberami</span></li>
                            <li><span className="text-[#8A9E8A]">Dożywotni charakter Członkostwa — bez opłat rocznych ani abonamentowych</span></li>
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

                        <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-6 mt-6 shadow-lg shadow-[#1C2614]/20 border-l-4 border-l-[#C9A84C]">
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
                                Spółka zobowiązuje się do zwrotu 100% (stu procent) wpłaconej kwoty wszystkim posiadaczom Tokenów Członkowskich, bez żadnych potrąceń.
                            </p>
                            <p className="leading-relaxed text-sm mt-4 opacity-80">
                                Zwrot nastąpi w terminie <strong>30 (trzydziestu) dni</strong> od podjęcia decyzji o zakończeniu projektu, przelewem na rachunek bankowy wskazany przez Membera. Token Członkowski zostaje spalony (burn) przez Smart Contract po potwierdzeniu zwrotu na adres Membera.
                            </p>
                        </div>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.6. Wymagania do aktywacji Członkostwa</h3>
                        <p>Pełna aktywacja Członkostwa wymaga łącznie:</p>
                        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
                            <li>Opłacenia wszystkich 5 etapów zgodnie z harmonogramem (łącznie 19 990 PLN)</li>
                            <li>Posiadania Paszportu NFT (darmowy — generowany automatycznie przy Etapie 0)</li>
                            <li>Przejścia weryfikacji KYC przez platformę DidIt.me</li>
                        </ol>
                        <p className="leading-relaxed text-sm shadow-sm p-3 bg-red-400/5 border border-red-400/20 rounded-lg text-red-100/70 mt-3">
                            Do czasu zakończenia weryfikacji KYC dostęp do systemu rezerwacji i głosowań DAO jest zablokowany.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">3.7. Zasady transferu Tokenu Członkowskiego</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Token Członkowski jest <strong>zbywalny</strong> — może być przedmiotem obrotu na rynku wtórnym (m.in. OpenSea)</li>
                            <li>Przy każdej wtórnej sprzedaży naliczane jest <strong>royalty fee w wysokości 10% (dziesięciu procent)</strong> od ceny sprzedaży, dzielone: 5% → Fundusz DAO, 5% → Spółka (wynagrodzenie za utrzymanie platformy)</li>
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
                </div>

                {/* § 4 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 4. SYSTEM REZERWACJI
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

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.3. Terminy standardowe — kolejność zgłoszeń</h3>
                        <p className="leading-relaxed">
                            Terminy inne niż Premium (§ 4.4) rezerwowane są w systemie kolejności zgłoszeń — pierwszeństwo ma Member który złoży rezerwację wcześniej w aplikacji. Rezerwacja standardowa możliwa jest z wyprzedzeniem maksymalnie <strong>12 (dwunastu) miesięcy</strong>.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.4. Terminy Premium — system losowania</h3>
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
                                    <tr><td className="py-3 px-4">Wakacje letnie</td><td className="py-3 px-4">1 lipca — 31 sierpnia</td></tr>
                                    <tr><td className="py-3 px-4">Majówka</td><td className="py-3 px-4">30 kwietnia — 4 maja</td></tr>
                                    <tr><td className="py-3 px-4">Boże Narodzenie</td><td className="py-3 px-4">23 — 27 grudnia</td></tr>
                                    <tr><td className="py-3 px-4">Sylwester / Nowy Rok</td><td className="py-3 px-4">28 grudnia — 2 stycznia</td></tr>
                                    <tr><td className="py-3 px-4">Wielkanoc</td><td className="py-3 px-4">Tydzień obejmujący Niedzielę Wielkanocną</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="font-semibold text-[#F5F0E8] mt-6">Procedura losowania Terminów Premium:</p>
                        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
                            <li>Losowanie odbywa się <strong>1 marca każdego roku</strong> za pośrednictwem aplikacji DAOResorts</li>
                            <li>Do <strong>28 lutego</strong> każdy Member może zgłosić chęć skorzystania z wybranych Terminów Premium przez aplikację</li>
                            <li>Przy nadmiarze chętnych na dany termin — losowanie elektroniczne z weryfikowalnym wynikiem rejestrowanym publicznie</li>
                            <li><strong>System rotacji sprawiedliwości:</strong>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li>Member który wygrał Termin Premium v danym roku — w kolejnym losowaniu tej samej kategorii terminu otrzymuje <strong>niższy priorytet</strong>, do czasu gdy wszyscy chętni skorzystają co najmniej raz</li>
                                    <li>Member który nie wygrał żadnego Terminu Premium — w kolejnym losowaniu otrzymuje <strong>wyższy priorytet</strong></li>
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
                                    <tr><td className="py-3 px-4 font-semibold text-[#F5F0E8]">7—13 dni</td><td className="py-3 px-4">Zwrot 50% niewykorzystanych nocy</td></tr>
                                    <tr><td className="py-3 px-4 font-semibold text-[#F5F0E8]">Poniżej 7 dni</td><td className="py-3 px-4 text-red-100/50">Noce przepadają w danym roku rezerwacyjnym</td></tr>
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
                            <li>Podania danych gości (imię, nazwisko, liczba osób) v aplikacji DAOResorts przy dokonaniu rezerwacji</li>
                            <li>Gościom przysługują wszystkie udogodnienia Resortu w trakcie pobytu</li>
                            <li>Member ponosi pełną odpowiedzialność za zachowanie zaproszonych gości i wszelkie szkody przez nich wyrządzone</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.9. Najem terminu przez Membera</h3>
                        <p className="leading-relaxed border-l-4 border-[#C9A84C]/50 pl-4 py-1">
                            <strong>4.9.1.</strong> Member <strong>nie może</strong> wynajmować swojego terminu osobom trzecim za wynagrodzeniem we własnym imieniu. Naruszenie tego zakazu skutkuje <strong>zawieszeniem dostępu do systemu rezerwacji</strong> do czasu wyjaśnienia sprawy przez DAO.
                        </p>
                        <p className="leading-relaxed border-l-4 border-[#C9A84C]/50 pl-4 py-1">
                            <strong>4.9.2.</strong> Member może udostępnić swój termin do najmu przez platformę DAOResorts. W tym przypadku:
                            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                                <li>Rezerwacja odbywa się przez aplikację DAOResorts</li>
                                <li>Udostępnione noce są <strong>odejmowane z puli 14 nocy rocznych Membera</strong></li>
                                <li>Przychód z najmu dzielony jest: <strong>70%</strong> → Member, <strong>15%</strong> → Fundusz DAO, <strong>15%</strong> → Spółka</li>
                            </ul>
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">4.10. Maksymalna liczba osób w domku</h3>
                        <p className="leading-relaxed">
                            Każdy domek może pomieścić maksymalnie <strong className="text-[#F5F0E8]">6 (sześć) osób</strong>. Przekroczenie limitu jest niedozwolone ze względów bezpieczeństwa przeciwpożarowego i sanitarnego.
                        </p>
                    </div>
                </div>

                {/* § 5 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 5. KOSZTY OPERACYJNE I ROZLICZENIA
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">5.1. Zasada „at cost”</h3>
                        <p className="leading-relaxed">
                            Celem DAOResorts jest zapewnienie pobytów <strong>po rzeczywistych kosztach operacyjnych</strong> — bez marży hotelowej i bez zysku na noclegach. Member płaci wyłącznie za faktyczne koszty utrzymania Resortu przypadające na jego pobyt plus Management Fee (§ 5.3).
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

                        <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-6 mt-4 shadow-sm">
                            <h4 className="text-[#C9A84C] font-semibold mb-3 tracking-wide uppercase text-xs">Przykład rozliczenia:</h4>
                            <div className="space-y-2 font-mono text-sm max-w-sm">
                                <div className="flex justify-between">
                                    <span>Koszty bazowe (tydzień)</span>
                                    <span className="text-[#F5F0E8]">577 PLN</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Management Fee 20%</span>
                                    <span className="text-[#F5F0E8]">115 PLN</span>
                                </div>
                                <div className="flex justify-between border-t border-[#2D5A3D] pt-2 mt-2 font-bold text-[#C9A84C] text-base">
                                    <span>SUMA DO ZAPŁATY</span>
                                    <span>~692 PLN</span>
                                </div>
                            </div>
                            <p className="mt-4 text-[10px] md:text-xs opacity-60 italic leading-relaxed text-[#8A9E8A]">
                                Dla porównania: rynkowy koszt tygodniowego pobytu w domku premium z jacuzzi w tym standardzie to 5 600 PLN — 8 000 PLN.
                            </p>
                        </div>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.4. Rozliczenie kosztów</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Koszty Operacyjne pobierane są przez aplikację DAOResorts przed każdym pobytem</li>
                            <li>Faktura VAT wystawiana jest przez Spółkę na życzenie Membera</li>
                            <li>Rozliczenie odbywa się w PLN lub stablecoinach (USDC/USDT na sieci Polygon)</li>
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
                                        <th className="py-3 px-4 text-[#F5F0E8] font-medium text-right font-mono">Kwota</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#2D5A3D]/30">
                                    <tr><td className="py-3 px-4">Budowa Resortu (materiały, robocizna, działka)</td><td className="py-3 px-4 text-[#C9A84C] font-mono">70%</td><td className="py-3 px-4 text-right font-mono">~2 098 950 PLN</td></tr>
                                    <tr><td className="py-3 px-4">Fundusz remontowy i operacyjny DAO</td><td className="py-3 px-4 text-[#C9A84C] font-mono">10%</td><td className="py-3 px-4 text-right font-mono">~299 850 PLN</td></tr>
                                    <tr><td className="py-3 px-4">Koszty operacyjne, obsługa, marketing, zysk Spółki</td><td className="py-3 px-4 text-[#C9A84C] font-mono">20%</td><td className="py-3 px-4 text-right font-mono">~599 700 PLN</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="leading-relaxed mt-2 text-sm opacity-80">
                            Pełne zestawienie wydatków publikowane jest w transparentnym panelu DAO w czasie rzeczywistym.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.6. Przychody z najmu komercyjnego i Terminów Premium</h3>
                        <p className="leading-relaxed mb-4">
                            Przychody z najmu Terminów Premium (§ 4.9.2) oraz wynajmu komercyjnego przez platformy zewnętrzne dzielone są:
                        </p>
                        <ul className="space-y-3 font-mono text-sm">
                            <li className="flex gap-4"><span className="text-[#C9A84C] w-12 font-bold">70%</span> <span>→ dla Membera (w przypadku najmu jego pulp terminu)</span></li>
                            <li className="flex gap-4"><span className="text-[#C9A84C] w-12 font-bold">15%</span> <span>→ do Funduszu DAO (na obniżenie Kosztów Operacyjnych dla wszystkich)</span></li>
                            <li className="flex gap-4"><span className="text-[#C9A84C] w-12 font-bold">15%</span> <span>→ wynagrodzenie operacyjne Operatora</span></li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">5.7. Royalty fee z wtórnego obrotu Tokenami</h3>
                        <p className="leading-relaxed">
                            10% wartości każdej wtórnej transakcji Tokenem Członkowskim dzielone jest: 5% → Fundusz DAO, 5% → Spółka.
                        </p>
                    </div>
                </div>

                {/* § 6 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 6. ZASADY POBYTU W RESORCIE
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">6.1. Obowiązki Membera i gości</h3>
                        <p>Member oraz zaproszeni przez niego goście zobowiązani są do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Przestrzegania niniejszego Regulaminu oraz szczegółowego „Regulaminu Resortu” dostępnego w każdym domku</li>
                            <li>Dbania o powierzone mienie — wszelkie zawinione szkody pokrywa Member</li>
                            <li>Poszanowania ciszy nocnej w godzinach <strong>22:00 — 8:00</strong></li>
                            <li>Niezwłocznego zgłaszania usterek i awarii obsłudze Resortu przez aplikację</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.2. Zakazy obowiązujące na terenie Resortu</h3>
                        <ul className="space-y-3 text-[#F5F0E8]">
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zakaz palenia:</strong> wyrobów tytoniowych i e-papierosów wewnątrz domków (dopuszczalne wyłącznie na zewnątrz)</li>
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zakaz imprez:</strong> organizowania głośnych wydarzeń z udziałem osób spoza listy gości</li>
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zakaz przepełnienia:</strong> przekraczania limitu 6 osób w domku bez zgody Operatora</li>
                            <li className="flex gap-3"><span className="text-red-400">✗</span> <strong>Zasada „No Pets”:</strong> zakaz wprowadzania zwierząt ze względu na standard premium i alergie gości.</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.3. Zasady korzystania z jacuzzi</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>System UV-C i ozonowanie wody działa automatycznie przed każdym nowym pobytem</li>
                            <li>Obowiązkowy prysznic przed wejściem do jacuzzi</li>
                            <li>Zakaz używania środków pieniących (płyny do kąpieli) w jacuzzi</li>
                            <li>Temperatura wody utrzymywana jest na stałym poziomie 38°C</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.4. Odpowiedzialność za szkody</h3>
                        <p className="leading-relaxed">
                            Member odpowiada finansowo za wszelkie szkody wyrządzone przez siebie lub gości. Wysokość odszkodowania ustalana jest na podstawie kosztów przywrócenia do stanu pierwotnego.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">6.5. Parking i bezpieczeństwo</h3>
                        <p className="leading-relaxed">
                            Resort dysponuje <strong>14 (czternastoma)</strong> bezpłatnymi miejscami parkingowymi (po jednym na domek + miejsca techniczne). Teren Resortu jest monitorowany w celu zapewnienia bezpieczeństwa mienia.
                        </p>
                    </div>
                </div>

                {/* § 7 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 7. PRAWA I OBOWIĄZKI MEMBERA
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">7.1. Prawa Membera</h3>
                        <p>Member ma prawo do:</p>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-[#C9A84C]">
                            <li><span className="text-[#8A9E8A]">Korzystania z 14 nocy rocznie w Resorcie po Kosztach Operacyjnych</span></li>
                            <li><span className="text-[#8A9E8A]">Uczestnictwa w zyskach z najmu (§ 4.9.2)</span></li>
                            <li><span className="text-[#8A9E8A]">Głosowania w DAO (1 Token = 1 głos)</span></li>
                            <li><span className="text-[#8A9E8A]">Wglądu w pełną dokumentację finansową Projektu przez panel DAO</span></li>
                            <li><span className="text-[#8A9E8A]">Transferu lub sprzedaży Tokenu Członkowskiego na rynku wtórnym</span></li>
                            <li><span className="text-[#8A9E8A]">Otrzymania pełnego zwrotu wpłaconej kwoty w przypadkach określonych w § 3.5</span></li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">7.2. Obowiązki Membera</h3>
                        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                            <li>Utrzymania aktualnych danych KYC</li>
                            <li>Terminowego regulowania Kosztów Operacyjnych przed przyjazdem</li>
                            <li>Odpowiedzialnego korzystania z infrastruktury Resortu</li>
                            <li>Dbania o bezpieczeństwo portfela kryptowalutowego z Paszportem/Tokenem</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">7.3. Zawieszenie Członkostwa</h3>
                        <p className="leading-relaxed text-sm text-[#F5F0E8]/70">
                            Operator może zawiesić dostęp Membera do systemu rezerwacji v przypadku naruszenia Regulaminu lub nieuregulowania kosztów. Zawieszenie nie pozbawia własności Tokenu, a jedynie ogranicza korzystanie z benefitów do czasu usunięcia naruszenia.
                        </p>
                    </div>
                </div>

                {/* § 8 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 8. ZARZĄDZANIE DAO
                    </h2>

                    <div className="space-y-4">
                        <h3 className="text-lg text-[#F5F0E8] font-semibold">8.1. Mechanizm głosowania</h3>
                        <p className="leading-relaxed">
                            DAOResorts wykorzystuje portfele kryptowalutowe oraz blockchain Polygon do weryfikacji uprawnień i zapisu wyników głosowania. Każdy posiadacz Tokenu ma 1 (jeden) głos na każdy posiadany Token.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">8.2. Decyzje strategiczne</h3>
                        <p>Wymagają większości głosów (51% biorących udział przy quorum 30%):</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm opacity-80">
                            <li>Zatwierdzenie rocznego budżetu operacyjnego</li>
                            <li>Zmiana operatora technicznego (firmy sprzątającej/ochroniarskiej)</li>
                            <li>Decyzje o większych remontach i inwestycjach z Funduszu DAO</li>
                            <li>Zmiany v zasadach rezerwacji i giełdy terminów</li>
                        </ul>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">8.3. Operator (Spółka)</h3>
                        <p className="leading-relaxed">
                            Spółka pełni rolę <strong>Operatora</strong> Resortu, zarządza codziennymi operacjami, obsługą gości i utrzymaniem technicznym w zamian za Management Fee. Operator działa v granicach budżetu zatwierdzonego przez DAO.
                        </p>
                    </div>
                </div>

                {/* § 9 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 9. OCHRONA DANYCH I WERYFIKACJA (KYC)
                    </h2>

                    <div className="space-y-4">
                        <p className="leading-relaxed">
                            Administratorem danych jest <strong>WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</strong> Weryfikacja tożsamości (KYC) prowadzona jest przez certyfikowanego partnera <strong>DidIt.me</strong>. Dane biometryczne i dokumenty nie są przechowywane bezpośrednio na serwerach Projektu, a jedynie status weryfikacji powiązany z adresem portfela.
                        </p>
                    </div>
                </div>

                {/* § 10 */}
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl text-[#C9A84C] font-playfair border-b border-[#2D5A3D]/30 pb-2">
                        § 10. POSTANOWIENIA KOŃCOWE
                    </h2>

                    <div className="space-y-4">
                        <p className="leading-relaxed">
                            Regulamin może zostać zmieniony wyłącznie w drodze głosowania DAO z większością kwalifikowaną 75%. Wszelkie spory będą rozstrzygane polubownie, a w przypadku braku porozumienia przez sąd właściwy dla siedziby Spółki.
                        </p>

                        <h3 className="text-lg text-[#F5F0E8] font-semibold mt-6">Kontakt we wszystkich sprawach:</h3>
                        <div className="bg-[#0E1208] border border-[#2D5A3D]/50 rounded-xl p-6 md:p-8 space-y-4 shadow-xl shadow-[#C9A84C]/5 mt-4">
                            <p className="font-playfair text-xl text-[#F5F0E8] border-b border-[#2D5A3D]/30 pb-3">WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</p>
                            <div className="space-y-3 text-sm">
                                <p className="flex flex-col md:flex-row md:justify-start md:gap-4"><span className="text-[#8A9E8A] inline-block min-w-[70px] mb-1 md:mb-0">Adres:</span> <span className="text-[#F5F0E8] font-medium">ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra</span></p>
                                <p className="flex flex-col md:flex-row md:justify-start md:gap-4"><span className="text-[#8A9E8A] inline-block min-w-[70px] mb-1 md:mb-0">Email:</span> <a href="mailto:bartosz@daoresorts.club" className="text-[#C9A84C] hover:text-[#C9A84C]/80 font-medium break-all">bartosz@daoresorts.club</a></p>
                                <p className="flex flex-col md:flex-row md:justify-start md:gap-4"><span className="text-[#8A9E8A] inline-block min-w-[70px] mb-1 md:mb-0">NIP:</span> <span className="text-[#F5F0E8]">9731114421</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="border-t border-[#2D5A3D]/50 pt-8 mt-16 text-center text-sm text-[#8A9E8A] opacity-80">
                    <p className="italic font-playfair">Regulamin obowiązuje od dnia 15.03.2024 (Wersja 1.0)</p>
                    <p className="font-semibold mt-2">DAORESORTS — PROJEKT REALIZOWANY PRZEZ WE3.CLUB</p>
                </div>

            </div >
        </div >
    );
}
