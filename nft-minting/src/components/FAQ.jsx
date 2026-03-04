import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Shield, Home, CreditCard, Star, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FAQ() {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const toggleOpen = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqCategories = [
        {
            title: t("faq_cat_1_title", "Model & Koszty"),
            icon: <CreditCard className="text-gold-500" size={24} />,
            items: [
                {
                    q: t("faq_q_1_1", "Na czym polega opłata 19 990 PLN?"),
                    a: t("faq_a_1_1", "To jednorazowa opłata za dożywotnie członkostwo w DAOResorts. Nie jest to zaliczka ani subskrypcja — płacisz raz i masz zagwarantowane 14 nocy do końca życia. Token możesz w każdej chwili odsprzedać na rynku wtórnym.")
                },
                {
                    q: t("faq_q_1_2", "Jakie dokładnie koszty ponoszę jadąc na wakacje?"),
                    a: t("faq_a_1_2", "Płacisz wyłącznie koszty operacyjne domku za Twój pobyt — prąd, woda, sprzątanie końcowe. Szacunkowo 200-400 PLN za cały pobyt niezależnie od liczby osób. Zero marży hotelowej, zero ukrytych prowizji. Konkretna kwota jest ustalana corocznie przez głosowanie społeczności DAO.")
                },
                {
                    q: t("faq_q_1_3", "Czy są jakieś ukryte opłaty roczne?"),
                    a: t("faq_a_1_3", "Nie ma abonamentu ani opłat członkowskich. Jedyna cykliczna opłata to fundusz remontowy — niewielka kwota ustalana corocznie przez DAO, przeznaczona na utrzymanie domków w standardzie premium. Szacunkowo 50-100 PLN miesięcznie od członka.")
                },
                {
                    q: t("faq_q_1_4", "Czy ceny pobytów mogą wzrosnąć?"),
                    a: t("faq_a_1_4", "Płacisz tylko realne koszty operacyjne — prąd, woda, sprzątanie. Te koszty mogą nieznacznie rosnąć z inflacją, ale nigdy nie będzie tu marży ani zysku dla właścicieli. DAO głosuje nad każdą zmianą stawek.")
                },
                {
                    q: t("faq_q_1_5", "Czy mogę odsprzedać swój Token?"),
                    a: t("faq_a_1_5", "Tak — Token jest Twoją własnością i możesz go odsprzedać w dowolnym momencie komukolwiek. Transakcja odbywa się przez aplikację DAOResorts. Jeśli wartość resortu wzrośnie, Token może być wart więcej niż zapłaciłeś.")
                }
            ]
        },
        {
            title: t("faq_cat_2_title", "Rezerwacje & Pobyty"),
            icon: <Home className="text-gold-500" size={24} />,
            items: [
                {
                    q: t("faq_q_2_1", "Jak działa system rezerwacji?"),
                    a: t("faq_a_2_1", "Terminy dzielą się na dwie kategorie: Terminy standardowe — rezerwujesz normalnie w aplikacji z wyprzedzeniem, zasada kto pierwszy ten lepszy. Terminy premium (losowane): wakacje letnie 1 lipca — 31 sierpnia, majówka 30 kwietnia — 4 maja, święta Bożego Narodzenia 23-27 grudnia, sylwester i Nowy Rok 28 grudnia — 2 stycznia, Wielkanoc i długie weekendy. Losowanie odbywa się raz w roku, 1 marca, dla wszystkich terminów premium na dany sezon. Każdy member zgłasza preferencje — system losuje i przydziela.")
                },
                {
                    q: t("faq_q_2_2", "Co jeśli dla każdego zabraknie terminów w wakacje?"),
                    a: t("faq_a_2_2", "System działa na zasadzie rotacji. Jeśli wygrałeś termin wakacyjny w danym roku — w kolejnym losowaniu na ten sam termin masz niższy priorytet, dopóki wszyscy chętni nie skorzystają przynajmniej raz. System gwarantuje że nikt nie monopolizuje najlepszych terminów rok po roku.")
                },
                {
                    q: t("faq_q_2_3", "Co jeśli nie wygrałem żadnego terminu premium w losowaniu?"),
                    a: t("faq_a_2_3", "Masz pierwszeństwo w kolejnym losowaniu. Dodatkowo system giełdy terminów pozwala na zamianę lub przekazanie przydzielonego terminu innemu memberowi przez aplikację.")
                },
                {
                    q: t("faq_q_2_4", "Czy jestem przypisany do konkretnego domku?"),
                    a: t("faq_a_2_4", "Nie — rezerwujesz dostępny domek w wybranym terminie, nie konkretną jednostkę. Wszystkie domki mają identyczny standard i wyposażenie.")
                },
                {
                    q: t("faq_q_2_5", "Ile osób mogę zabrać ze sobą?"),
                    a: t("faq_a_2_5", "Każdy domek mieści maksymalnie 6 osób — dwie sypialnie, dwa łóżka podwójne i dodatkowe pojedyncze. Możesz przyjeżdżać z rodziną lub znajomymi bez dodatkowych opłat za osobę.")
                },
                {
                    q: t("faq_q_2_6", "Czy mogę podzielić swoje 14 nocy między kilka wizyt?"),
                    a: t("faq_a_2_6", "Tak — 14 nocy możesz wykorzystać jednorazowo lub podzielić na kilka krótszych pobytów w ciągu roku, np. dwa razy po 7 nocy lub cztery razy po 3-4 noce.")
                },
                {
                    q: t("faq_q_2_7", "Czy niewykorzystane noce przechodzą na następny rok?"),
                    a: t("faq_a_2_7", "Nie — niewykorzystane noce przepadają. Zasada jest prosta: 14 nocy rocznie, rok zaczyna się od daty zakupu tokenu.")
                },
                {
                    q: t("faq_q_2_8", "Czy mogę użyczyć swoich nocy komuś innemu?"),
                    a: t("faq_a_2_8", "Tak — możesz przekazać swoje noce znajomemu lub rodzinie. Osoba korzystająca musi być zarejestrowana w systemie DAOResorts ze względów bezpieczeństwa obiektu.")
                },
                {
                    q: t("faq_q_2_9", "Czy resort działa przez cały rok?"),
                    a: t("faq_a_2_9", "Tak — domki są dostępne przez cały rok, w tym zimą. Ogrzewanie, klimatyzacja i jacuzzi działają niezależnie od sezonu.")
                }
            ]
        },
        {
            title: t("faq_cat_3_title", "Standard & Wakacje"),
            icon: <Star className="text-gold-500" size={24} />,
            items: [
                {
                    q: t("faq_q_3_1", "Jaki jest dokładny standard domków?"),
                    a: t("faq_a_3_1", "Każdy domek ma 70m² powierzchni użytkowej, dwie sypialnie z miejscem dla 6 osób, w pełni wyposażoną kuchnię, łazienkę, salon z jadalnią, prywatne jacuzzi na zewnątrz i taras. Wykończenie premium — drewniana elewacja, ogrzewanie podłogowe w łazience, klimatyzacja w każdym pomieszczeniu.")
                },
                {
                    q: t("faq_q_3_2", "Co jest w domku — pościel, ręczniki, wyposażenie kuchni?"),
                    a: t("faq_a_3_2", "Resort zapewnia pełne wyposażenie: pościel, ręczniki, podstawowe środki czystości, garnki, sztućce, naczynia, ekspres do kawy. Przyjeżdżasz z walizką — wszystko inne jest na miejscu.")
                },
                {
                    q: t("faq_q_3_3", "Czy jest WiFi?"),
                    a: t("faq_a_3_3", "Tak — szybkie WiFi w każdym domku i w częściach wspólnych.")
                },
                {
                    q: t("faq_q_3_4", "Czy mogę przyjechać ze zwierzęciem?"),
                    a: t("faq_a_3_4", "Polityka wobec zwierząt zostanie ustalona przez głosowanie DAO przed otwarciem resortu.")
                },
                {
                    q: t("faq_q_3_5", "Czy jest możliwość zamówienia jedzenia?"),
                    a: t("faq_a_3_5", "Resort posiada restaurację w osobnym budynku. Możliwe będzie zamówienie śniadań do domku — szczegóły przed otwarciem.")
                },
                {
                    q: t("faq_q_3_6", "Co w okolicy?"),
                    a: t("faq_a_3_6", "Resort znajduje się w Pszczew, Wielkopolska — okolica jeziora Pszczewskiego, szlaki rowerowe, lasy. Na terenie resortu planowane są rowery elektryczne do wypożyczenia. Szczegółowa mapa atrakcji w okolicy będzie dostępna w aplikacji.")
                }
            ]
        },
        {
            title: t("faq_cat_4_title", "Bezpieczeństwo & DAO"),
            icon: <Shield className="text-gold-500" size={24} />,
            items: [
                {
                    q: t("faq_q_4_0", "Co to właściwie jest DAO?"),
                    a: t("faq_a_4_0", "DAO (ang. Decentralized Autonomous Organization) to w tłumaczeniu Zdecentralizowana Organizacja Autonomiczna. Oznacza to, że nasz resort nie jest zarządzany przez jednego właściciela czy zamknięty zarząd, lecz wspólnie przez wszystkich posiadaczy tokenów. Ważne zasady działania oraz fundusze są zarządzane przez kod na blockchainie (smart kontrakty), co gwarantuje 100% przejrzystość finansów i w pełni demokratyczne podejmowanie decyzji.")
                },
                {
                    q: t("faq_q_4_1", "Kto jest faktycznym właścicielem ziemi i budynków?"),
                    a: t("faq_a_4_1", "Działka i wszystkie budynki są własnością spółki DAOResorts sp. z o.o. zarejestrowanej w Polsce. Żaden pojedynczy udziałowiec nie może podjąć decyzji o sprzedaży bez zgody społeczności. W przyszłości organ DAO zostanie formalnie wpisany do struktury nadzorczej spółki.")
                },
                {
                    q: t("faq_q_4_2", "Co jeśli DAOResorts zbankrutuje? Co z moimi 19 990 PLN?"),
                    a: t("faq_a_4_2", "Środki ze sprzedaży tokenów są zarządzane w sposób w pełni przejrzysty i zgodny z wolą społeczności. Podział jest stały: 70% idzie w aktywa rzeczowe (budowa, ziemia), 15% w fundusz remontowy, a 15% to obsługa projektu. Działka i budynki zawsze mają realną wartość rynkową. W przypadku likwidacji holderzy tokenów mają pierwszeństwo w podziale aktywów proporcjonalnie. Wszystko widać na żywo na blockchain.")
                },
                {
                    q: t("faq_q_4_3", "Na co właściwie posiadacze tokenów mogą głosować?"),
                    a: t("faq_a_4_3", "Holderzy głosują nad wszystkimi kluczowymi decyzjami: wysokość opłat operacyjnych na kolejny rok, fundusz remontowy, nowe udogodnienia, zasady rezerwacji, potencjalna ekspansja na nowe lokalizacje, wybór dostawców usług.")
                },
                {
                    q: t("faq_q_4_4", "Czy DAO głosowanie jest wiążące?"),
                    a: t("faq_a_4_4", "Tak — wyniki głosowań są wiążące dla zarządu spółki w sprawach operacyjnych. Zarząd nie może jednostronnie podnieść opłat ani zmienić zasad korzystania z resortu bez zgody społeczności.")
                },
                {
                    q: t("faq_q_4_5", "Czy moje dane osobowe z KYC są bezpieczne?"),
                    a: t("faq_a_4_5", "Weryfikacja tożsamości odbywa się przez DidIt.me — certyfikowanego europejskiego dostawcę usług KYC działającego zgodnie z RODO. DAOResorts nie przechowuje kopii Twojego dowodu osobistego ani danych biometrycznych — tylko potwierdzenie że weryfikacja przebiegła pomyślnie.")
                }
            ]
        },
        {
            title: t("faq_cat_5_title", "Technologia & NFT"),
            icon: <Globe className="text-gold-500" size={24} />,
            items: [
                {
                    q: t("faq_q_5_1", "Muszę znać się na krypto żeby kupić Token?"),
                    a: t("faq_a_5_1", "Nie — proces nie wymaga żadnej wiedzy o blockchain. Rejestrujesz się emailem, weryfikujesz tożsamość, płacisz przelewem lub kartą. Token pojawia się automatycznie w Twoim koncie.")
                },
                {
                    q: t("faq_q_5_2", "Co to właściwie jest NFT i dlaczego wakacje są na blockchain?"),
                    a: t("faq_a_5_2", "NFT to cyfrowy dokument własności — jak akt notarialny w formie elektronicznej. Blockchain gwarantuje że nikt nie może sfałszować Twojego członkostwa, usunąć go ani zduplikować.")
                },
                {
                    q: t("faq_q_5_3", "Czy Token może przepaść jeśli zapomnę hasła?"),
                    a: t("faq_a_5_3", "Nie — Token jest powiązany z Twoim kontem zabezpieczonym emailem i hasłem, jak każde inne konto internetowe. Nie potrzebujesz zarządzać kluczami kryptograficznymi — my robimy to za Ciebie.")
                }
            ]
        }
    ];

    return (
        <div className="w-full text-text-primary font-sans mix-blend-lighten relative px-4 mx-auto pb-40" style={{ maxWidth: '800px' }}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="text-center mb-16 mt-8">
                <div className="inline-flex items-center justify-center p-4 bg-gold-500/10 rounded-3xl mb-6">
                    <HelpCircle size={40} className="text-gold-500" />
                </div>
                <h1 className="text-4xl md:text-6xl font-playfair font-semibold mb-4 text-text-primary">
                    Pytania & <span className="text-gold-500 italic">Odpowiedzi</span>
                </h1>
                <p className="text-text-secondary font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Budujemy model jutra, ale cenimy jasne zasady. Oto wszystko, co musisz wiedzieć o członkostwie w DAOResorts.
                </p>
            </div>

            <div className="space-y-12">
                {faqCategories.map((category, catIndex) => (
                    <div key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 150}ms` }}>
                        <div className="flex items-center gap-3 mb-6">
                            {category.icon}
                            <h2 className="text-2xl font-playfair font-semibold text-text-primary">{category.title}</h2>
                        </div>

                        <div className="space-y-4">
                            {category.items.map((item, itemIndex) => {
                                const globalIndex = `${catIndex}-${itemIndex}`;
                                const isOpen = openIndex === globalIndex;

                                return (
                                    <div
                                        key={itemIndex}
                                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                                            ? "border-gold-500/40 bg-forest-800 shadow-card"
                                            : "border-border-default bg-forest-900/50 hover:border-gold-500/20 hover:bg-forest-800/50"
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleOpen(globalIndex)}
                                            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 outline-none focus:ring-2 focus:ring-gold-500/50 rounded-2xl"
                                        >
                                            <span className={`font-sans font-medium text-lg md:text-xl transition-colors ${isOpen ? "text-text-primary" : "text-text-secondary"}`}>
                                                {item.q}
                                            </span>
                                            <ChevronDown
                                                className={`text-gold-500 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                                size={24}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    <div className="px-6 pb-6 pt-2 text-text-secondary font-light leading-relaxed text-base md:text-lg border-t border-border-default mx-6 mt-2">
                                                        {item.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA Block */}
            <div className="mt-20 text-center bg-forest-900 border border-border-default shadow-card p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-[50px] rounded-full" />
                <h3 className="text-2xl font-playfair font-semibold text-text-primary mb-2 relative z-10">Nie znalazłeś odpowiedzi?</h3>
                <p className="text-text-secondary font-light mb-6 max-w-lg mx-auto relative z-10">Jesteśmy w 100% transparentni. Wejdź na naszego Discorda w zakładkę "Zapytaj DAO" i utwórz tam ticketa – chętnie porozmawiamy głosowo!</p>
                <a href="#" className="inline-block px-8 py-3 bg-forest-800 hover:bg-forest-800/80 text-text-primary border border-border-default rounded-full font-bold transition-colors relative z-10">
                    Discord Community
                </a>
            </div>
        </div>
    );
}
