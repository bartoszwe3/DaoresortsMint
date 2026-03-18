import React from "react";

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-[#0E1208] text-[#8A9E8A] pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="font-playfair text-4xl text-[#F5F0E8] mb-8">WAŻNA INFORMACJA PRAWNA</h1>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">1. Token Członkowski DAOResorts</h2>
                    <p>
                        Token Członkowski DAOResorts wydawany przez WE3.CLUB RESORT DEVELOPMENT SP. Z O.O. (KRS: 0001188626) NIE jest:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Instrumentem finansowym w rozumieniu MiCA</li>
                        <li>Papierem wartościowym</li>
                        <li>Udziałem w spółce</li>
                        <li>Inwestycją gwarantującą zysk</li>
                    </ul>
                    <p>
                        Token reprezentuje wyłącznie prawo do korzystania z usług resortu DAOResorts na warunkach określonych w Regulaminie.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">2. Paszport NFT</h2>
                    <p>
                        Paszport NFT jest bezpłatnym tokenem profilowym. Nie reprezentuje żadnej wartości finansowej ani prawa do korzystania z resortu.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">3. Ryzyko</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Wartość Tokenu Członkowskiego na rynku wtórnym może się zmieniać</li>
                        <li>Budowa resortu zależy od uzyskania pozwoleń administracyjnych</li>
                        <li>Daty są szacunkowe</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl text-gold-500 font-playfair">4. Kontakt</h2>
                    <p>
                        WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.<br />
                        kontakt@daoresorts.club
                    </p>
                </section>
            </div>
        </div>
    );
}
