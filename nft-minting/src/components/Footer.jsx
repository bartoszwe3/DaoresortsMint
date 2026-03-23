import React from "react";

export default function Footer() {
    return (
        <footer className="border-t border-[#2D5A3D] bg-[#0E1208] py-8 mt-auto w-full">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">

                    {/* Dane spółki */}
                    <div>
                        <p className="text-[#F5F0E8] font-semibold text-sm mb-2">
                            WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
                        </p>
                        <p className="text-[#8A9E8A] text-xs leading-relaxed">
                            KRS: 0001188626 | NIP: 9731114421 | REGON: 542448933<br />
                            ul. Kazimierza Wielkiego 7/5, 65-047 Zielona Góra<br />
                            bartosz@daoresorts.club
                        </p>
                    </div>

                    {/* Dokumenty */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[#F5F0E8] text-xs font-semibold uppercase tracking-widest mb-1">
                            Dokumenty
                        </p>
                        {[
                            { label: 'Regulamin', href: '/regulamin' },
                            { label: 'Polityka Prywatności', href: '/polityka-prywatnosci' },
                            { label: 'Disclaimer', href: '/disclaimer' },
                        ].map(link => (
                            <a key={link.href} href={link.href} className="text-[#8A9E8A] text-xs hover:text-[#C9A84C] transition-colors py-2 md:py-0 inline-block">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Resort */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[#F5F0E8] text-xs font-semibold uppercase tracking-widest mb-1">
                            Resort
                        </p>
                        {[
                            { label: 'O Projekcie', href: '/#o-projekcie' },
                            { label: 'Kalkulator', href: '/#kalkulator' },
                            { label: 'FAQ', href: '/#faq' },
                            { label: 'O Założycielu', href: '/founder' },
                        ].map(link => (
                            <a key={link.href} href={link.href} className="text-[#8A9E8A] text-xs hover:text-[#C9A84C] transition-colors py-2 md:py-0 inline-block">
                                {link.label}
                            </a>
                        ))}
                    </div>

                </div>

                {/* Disclaimer one-liner */}
                <div className="border-t border-[#2D5A3D] pt-4 space-y-2">
                    <p className="text-[#8A9E8A] text-xs text-center">
                        Token Członkowski DAOResorts nie jest instrumentem finansowym w rozumieniu MiCA. Paszport NFT jest darmowy i nie stanowi prawa do korzystania z resortu.
                    </p>
                    <p className="text-[#8A9E8A] text-xs text-center">
                        © 2026 DAOResorts by WE3.CLUB RESORT DEVELOPMENT SP. Z O.O. Wszelkie prawa zastrzeżone.
                    </p>
                </div>

            </div>
        </footer>
    );
}
