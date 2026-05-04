import React from "react";

export default function PolitykaPrywatnosci() {
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#555555] pt-32 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-4">
                    <p className="text-xs font-bold tracking-widest text-[#C4A47C] uppercase">
                        Dokument Prawny
                    </p>
                    <h1 className="font-playfair text-5xl text-[#222222] mb-6">Polityka Prywatności</h1>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-sm text-[#777777]">
                        <p>Wersja 1.0</p>
                        <p>Obowiązuje od: maj 2026</p>
                        <p>Administrator: WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</p>
                    </div>
                </div>

                <hr className="border-[#E5E0D8]" />

                {/* Administrator Box */}
                <div className="bg-[#F4F1EB] border-l-4 border-[#C4A47C] p-6 md:p-8">
                    <h2 className="text-xs font-bold tracking-widest text-[#C4A47C] uppercase mb-4">
                        Administrator danych osobowych
                    </h2>
                    <p className="font-bold text-[#222222] mb-2">
                        WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
                    </p>
                    <p className="space-y-1 text-sm text-[#555555]">
                        <span className="block">ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra</span>
                        <span className="block">KRS: 0001188626 · NIP: 9731114421</span>
                        <span className="block">E-mail: <a href="mailto:bartosz@silna.club" className="text-[#C4A47C] hover:underline">bartosz@silna.club</a> · Tel.: +48 514 716 063</span>
                    </p>
                    <p className="mt-6 text-sm text-[#777777]">
                        Spółka nie wyznaczyła Inspektora Ochrony Danych. We wszystkich sprawach dotyczących ochrony danych osobowych należy kontaktować się bezpośrednio z Administratorem na wskazany wyżej adres e-mail.
                    </p>
                </div>

                {/* Section 1 */}
                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#222222] flex items-baseline gap-2">
                        <span className="text-[#C4A47C]">1.</span> Jakie dane zbieramy i skąd
                    </h2>
                    <p className="leading-relaxed">Zbieramy wyłącznie dane, które sam nam przekazujesz lub które powstają w związku z korzystaniem z naszej strony internetowej i usług.</p>
                    
                    <h3 className="text-lg font-bold text-[#222222] mt-6">Dane przekazywane bezpośrednio:</h3>
                    <ul className="list-disc pl-6 space-y-2 text-[#555555]">
                        <li>Imię i nazwisko, adres zamieszkania, adres e-mail, numer telefonu — przy wypełnianiu formularza kontaktowego lub zawieraniu Umowy Rezerwacji</li>
                        <li>Numer rachunku bankowego — przy zwrocie Opłaty Rezerwacyjnej</li>
                        <li>Treść korespondencji — wiadomości wysyłane do nas e-mailem lub przez formularz</li>
                    </ul>

                    <h3 className="text-lg font-bold text-[#222222] mt-6">Dane zbierane automatycznie (Meta Pixel):</h3>
                    <ul className="list-disc pl-6 space-y-2 text-[#555555]">
                        <li>Adres IP, identyfikatory urządzenia i przeglądarki</li>
                        <li>Informacje o zachowaniu na stronie (odwiedzone podstrony, kliknięcia, czas wizyty)</li>
                        <li>Dane demograficzne i zainteresowania — w zakresie udostępnianym przez Meta Platforms Ireland Ltd.</li>
                    </ul>

                    <h3 className="text-lg font-bold text-[#222222] mt-6">Meta Pixel</h3>
                    <p className="leading-relaxed">Na stronie silna.club zainstalowany jest kod Meta Pixel (Facebook Pixel) — narzędzie reklamowe Meta Platforms Ireland Ltd. (4 Grand Canal Square, Dublin 2, Irlandia). Pixel przekazuje dane o Twoich działaniach na stronie do Meta, co pozwala nam wyświetlać dopasowane reklamy na Facebooku i Instagramie. Meta może łączyć te dane z Twoim profilem na Facebooku/Instagramie. Podstawa prawna przetwarzania: zgoda (art. 6 ust. 1 lit. a RODO). Możesz wycofać zgodę, wyłączając cookies marketingowe lub korzystając z ustawień reklam na swoim koncie Meta.</p>
                </section>

                {/* Section 2 */}
                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#222222] flex items-baseline gap-2">
                        <span className="text-[#C4A47C]">2.</span> Cele i podstawy prawne przetwarzania
                    </h2>
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full text-left border-collapse border border-[#E5E0D8]">
                            <thead className="bg-[#F4F1EB]">
                                <tr>
                                    <th className="py-3 px-4 font-bold text-[#222222] border-b border-[#E5E0D8]">Cel przetwarzania</th>
                                    <th className="py-3 px-4 font-bold text-[#222222] border-b border-[#E5E0D8]">Podstawa prawna (RODO)</th>
                                    <th className="py-3 px-4 font-bold text-[#222222] border-b border-[#E5E0D8]">Okres przechowywania</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E0D8] text-sm">
                                <tr>
                                    <td className="py-3 px-4 text-[#222222]">Wykonanie Umowy Rezerwacji (obsługa rezerwacji, komunikacja, zwrot Opłaty Rezerwacyjnej)</td>
                                    <td className="py-3 px-4">art. 6 ust. 1 lit. b — niezbędność do wykonania umowy</td>
                                    <td className="py-3 px-4">Czas trwania umowy + 5 lat</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-[#222222]">Odpowiedź na zapytania przez formularz kontaktowy</td>
                                    <td className="py-3 px-4">art. 6 ust. 1 lit. f — prawnie uzasadniony interes (obsługa klienta)</td>
                                    <td className="py-3 px-4">Do zakończenia korespondencji + 1 rok</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-[#222222]">Wypełnienie obowiązków prawnych (księgowość, archiwizacja dokumentów)</td>
                                    <td className="py-3 px-4">art. 6 ust. 1 lit. c — obowiązek prawny</td>
                                    <td className="py-3 px-4">5 lat od końca roku podatkowego</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-[#222222]">Dochodzenie i obrona przed roszczeniami</td>
                                    <td className="py-3 px-4">art. 6 ust. 1 lit. f — prawnie uzasadniony interes</td>
                                    <td className="py-3 px-4">Do upływu terminu przedawnienia roszczeń (max. 6 lat)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-[#222222]">Marketing bezpośredni (e-mail, telefon) — aktualizacje projektu, oferty</td>
                                    <td className="py-3 px-4">art. 6 ust. 1 lit. a — zgoda (opcjonalna, zbierana w Umowie Rezerwacji)</td>
                                    <td className="py-3 px-4">Do wycofania zgody</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-[#222222]">Remarketing przez Meta Pixel (reklamy na Facebooku/Instagramie)</td>
                                    <td className="py-3 px-4">art. 6 ust. 1 lit. a — zgoda (cookies marketingowe)</td>
                                    <td className="py-3 px-4">Do wycofania zgody / usunięcia cookies</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#222222] flex items-baseline gap-2">
                        <span className="text-[#C4A47C]">3.</span> Odbiorcy danych
                    </h2>
                    <p className="leading-relaxed">Twoje dane mogą być przekazywane następującym kategoriom odbiorców:</p>
                    <ul className="list-disc pl-6 space-y-2 text-[#555555]">
                        <li>Biuro rachunkowe — w zakresie niezbędnym do prowadzenia księgowości</li>
                        <li>Kancelaria prawna — w zakresie obsługi prawnej Spółki</li>
                        <li>mBank S.A. — obsługa płatności i przelewów bankowych</li>
                        <li>Supabase Inc. (USA) — hosting bazy danych i aplikacji silna.club</li>
                        <li>Make (Celonis SE, Niemcy) — automatyzacja procesów i przepływów danych</li>
                        <li>Notion Labs Inc. (USA) — CRM i zarządzanie relacjami z klientami</li>
                        <li>MailerLite (UAB, Litwa) — wysyłka e-maili i automatyzacja komunikacji</li>
                        <li>Meta Platforms Ireland Ltd. (Irlandia) — Meta Pixel, reklamy na Facebooku/Instagramie</li>
                        <li>Operatorzy poczty elektronicznej — obsługa skrzynki bartosz@silna.club</li>
                    </ul>
                    <p className="leading-relaxed mt-4">Przekazywanie danych poza Europejski Obszar Gospodarczy (Supabase, Make, Notion, Meta) odbywa się na podstawie standardowych klauzul umownych zatwierdzonych przez Komisję Europejską (art. 46 ust. 2 lit. c RODO), zapewniających odpowiedni poziom ochrony danych.</p>
                </section>

                {/* Section 4 */}
                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#222222] flex items-baseline gap-2">
                        <span className="text-[#C4A47C]">4.</span> Twoje prawa
                    </h2>
                    <p className="leading-relaxed">W związku z przetwarzaniem Twoich danych osobowych przysługują Ci następujące prawa:</p>
                    <ul className="space-y-3 text-[#555555]">
                        <li><strong className="text-[#222222] font-bold">Dostęp do danych:</strong> Prawo do uzyskania informacji o tym, jakie dane przetwarzamy i w jakim celu.</li>
                        <li><strong className="text-[#222222] font-bold">Sprostowanie:</strong> Prawo do poprawienia błędnych lub uzupełnienia niekompletnych danych.</li>
                        <li><strong className="text-[#222222] font-bold">Usunięcie:</strong> Prawo do żądania usunięcia danych, gdy nie są już potrzebne do celu, w którym zostały zebrane.</li>
                        <li><strong className="text-[#222222] font-bold">Ograniczenie przetwarzania:</strong> Prawo do żądania wstrzymania przetwarzania danych w określonych przypadkach.</li>
                        <li><strong className="text-[#222222] font-bold">Przenoszenie danych:</strong> Prawo do otrzymania swoich danych w ustrukturyzowanym, powszechnie używanym formacie.</li>
                        <li><strong className="text-[#222222] font-bold">Sprzeciw:</strong> Prawo do sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 6 ust. 1 lit. f).</li>
                        <li><strong className="text-[#222222] font-bold">Cofnięcie zgody:</strong> Prawo do wycofania zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania sprzed cofnięcia.</li>
                        <li><strong className="text-[#222222] font-bold">Skarga do UODO:</strong> Prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.</li>
                    </ul>
                    <p className="leading-relaxed mt-4">Aby skorzystać z powyższych praw, skontaktuj się z nami: <a href="mailto:bartosz@silna.club" className="text-[#C4A47C] hover:underline">bartosz@silna.club</a>. Odpowiemy w terminie 30 dni.</p>
                </section>

                {/* Section 5 */}
                <section className="flex flex-col space-y-4">
                    <h2 className="text-3xl font-playfair text-[#222222] flex items-baseline gap-2">
                        <span className="text-[#C4A47C]">5.</span> Pliki cookies
                    </h2>
                    <p className="leading-relaxed">Strona silna.club używa plików cookies (ciasteczek) — małych plików tekstowych zapisywanych w Twojej przeglądarce.</p>
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full text-left border-collapse border border-[#E5E0D8]">
                            <thead className="bg-[#F4F1EB]">
                                <tr>
                                    <th className="py-3 px-4 font-bold text-[#222222] border-b border-[#E5E0D8]">Rodzaj cookies</th>
                                    <th className="py-3 px-4 font-bold text-[#222222] border-b border-[#E5E0D8]">Cel</th>
                                    <th className="py-3 px-4 font-bold text-[#222222] border-b border-[#E5E0D8]">Podstawa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E0D8] text-sm">
                                <tr>
                                    <td className="py-3 px-4 text-[#222222] font-medium">Niezbędne</td>
                                    <td className="py-3 px-4">Zapewnienie podstawowego działania strony (sesja, bezpieczeństwo)</td>
                                    <td className="py-3 px-4">Uzasadniony interes — bez zgody</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-[#222222] font-medium">Marketingowe (Meta Pixel)</td>
                                    <td className="py-3 px-4">Remarketing i personalizacja reklam na Facebooku/Instagramie</td>
                                    <td className="py-3 px-4">Zgoda użytkownika</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="leading-relaxed mt-4">Możesz zarządzać cookies przez ustawienia swojej przeglądarki lub przez baner cookies przy pierwszej wizycie. Wyłączenie cookies marketingowych nie wpłynie na działanie strony.</p>
                </section>

                {/* Section 6 */}
                <section className="space-y-4">
                    <h2 className="text-3xl font-playfair text-[#222222] flex items-baseline gap-2">
                        <span className="text-[#C4A47C]">6.</span> Bezpieczeństwo danych
                    </h2>
                    <p className="leading-relaxed">Stosujemy techniczne i organizacyjne środki bezpieczeństwa odpowiednie do ryzyka, w tym szyfrowanie połączeń (HTTPS), kontrolę dostępu do danych oraz umowy powierzenia przetwarzania z każdym podmiotem przetwarzającym dane w naszym imieniu.</p>
                </section>

                {/* Section 7 */}
                <section className="space-y-4">
                    <h2 className="text-3xl font-playfair text-[#222222] flex items-baseline gap-2">
                        <span className="text-[#C4A47C]">7.</span> Zmiany Polityki Prywatności
                    </h2>
                    <p className="leading-relaxed">Możemy aktualizować niniejszą Politykę Prywatności. O istotnych zmianach poinformujemy e-mailem osoby, które zawarły z nami Umowę Rezerwacji. Data ostatniej aktualizacji widoczna jest w nagłówku dokumentu. Archiwalne wersje Polityki dostępne są na żądanie.</p>
                </section>

                {/* Footer Contact */}
                <section className="flex flex-col space-y-4 pt-12 mt-12 border-t border-[#E5E0D8]">
                    <h2 className="text-xl text-[#222222] font-playfair font-bold">Kontakt w sprawach danych osobowych</h2>
                    <p className="text-[#555555] space-y-1">
                        <span className="block font-bold text-[#222222]">WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.</span>
                        <span className="block">ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra</span>
                        <span className="block mt-2">E-mail: <a href="mailto:bartosz@silna.club" className="text-[#C4A47C] hover:underline">bartosz@silna.club</a></span>
                        <span className="block">Tel.: +48 514 716 063</span>
                        <span className="block mt-2 text-sm text-[#777777]">KRS: 0001188626 · NIP: 9731114421</span>
                    </p>
                </section>
            </div>
        </div>
    );
}
