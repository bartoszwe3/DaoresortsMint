import React from "react";

export default function PolitykaPrywatnosci() {
    return (
        <div className="min-h-screen bg-[#0E1208] text-[#8A9E8A] pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="font-playfair text-4xl text-[#F5F0E8] mb-8">Polityka Prywatności</h1>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">1. Administrator danych</h2>
                    <p>
                        WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.<br />
                        ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra<br />
                        bartosz@daoresorts.club
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">2. Zakres zbieranych danych</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Email (rejestracja)</li>
                        <li>Imię i nazwisko (profil)</li>
                        <li>Adres portfela krypto (opcjonalnie)</li>
                        <li>Dane KYC: imię, nazwisko, dokument tożsamości (przetwarzane przez DidIt.me jako procesor)</li>
                        <li>Dane rezerwacji (daty, liczba osób)</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">3. Cel przetwarzania</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Świadczenie usług członkowskich</li>
                        <li>Weryfikacja KYC (wymóg prawny)</li>
                        <li>Komunikacja o projekcie i rezerwacjach</li>
                        <li>Głosowania DAO</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">4. Podstawa prawna</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>RODO art. 6 ust. 1 lit. b (wykonanie umowy)</li>
                        <li>RODO art. 6 ust. 1 lit. c (obowiązek prawny - KYC)</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">5. Prawa użytkownika</h2>
                    <p>
                        Dostęp, sprostowanie, usunięcie, przenoszenie<br />
                        Kontakt: bartosz@daoresorts.club
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">6. Procesorzy danych</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>DidIt.me - weryfikacja KYC</li>
                        <li>Magic Labs - autentykacja email</li>
                        <li>Polygon - blockchain (dane publiczne)</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
