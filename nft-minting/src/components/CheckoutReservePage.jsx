import React, { useState, useEffect } from "react";
import { Copy, Check, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { RESERVATION_FEE, MEMBERSHIP_TOTAL } from "../constants/tokenomics";
import toast from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

const TransferRow = ({ label, value, copyable, highlight, important }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <div className={`flex justify-between items-center py-3 border-b border-[#2D5A3D] last:border-0 ${important ? "bg-[#1C2614] -mx-6 px-6 rounded-lg" : ""}`}>
            <div className="flex-1">
                <p className="text-[#8A9E8A] text-xs mb-0.5">{label}</p>
                <p className={`font-mono break-all ${highlight ? "text-[#C9A84C] text-lg font-bold" : "text-[#F5F0E8] text-sm"}`}>
                    {value}
                </p>
            </div>
            {copyable && (
                <button
                    onClick={handleCopy}
                    className={`ml-3 flex-shrink-0 flex items-center gap-1.5 text-xs border rounded-md px-2.5 py-1.5 transition-all duration-200 ${copied ? "border-green-500 text-green-400" : "border-[#2D5A3D] text-[#8A9E8A] hover:border-[#C9A84C] hover:text-[#C9A84C]"}`}
                >
                    {copied ? <><Check size={11} /> Skopiowano</> : <><Copy size={11} /> Kopiuj</>}
                </button>
            )}
        </div>
    );
};

export default function CheckoutReservePage() {
    const { user, isAuthenticated, isInitializing } = useAuth();
    const [state, setState] = useState("loading"); // loading | checkout | pending

    const [passportId, setPassportId] = useState("Oczekujący");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [reservedCount, setReservedCount] = useState(47);
    const [assignedTokenNumber, setAssignedTokenNumber] = useState(47);

    const [confirmed, setConfirmed] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const initCheckout = async () => {
            if (sessionStorage.getItem("reserve_state") === "pending") {
                setState("pending");
                setUserEmail(sessionStorage.getItem("reserve_email") || "");
                setPassportId(sessionStorage.getItem("reserve_passport") || "");
                setAssignedTokenNumber(parseInt(sessionStorage.getItem("reserve_token") || "47"));
                return;
            }

            if (isInitializing) return;

            if (!isAuthenticated || !user) {
                window.location.href = "/";
                return;
            }

            const address = user?.address || user?.publicAddress;
            setUserEmail(user?.email || "");

            try {
                // Fetch stats (mock for now or real if API exists)
                const statusRes = await fetch(`${API_BASE}/api/status/${address}`);
                const statusData = await statusRes.json();

                setUserName(statusData.memberName || "Klubowicz");
                setPassportId(statusData.passportId || "TC-" + address.substring(2, 6).toUpperCase());

                // In real app, backend would assign next available token
                setAssignedTokenNumber(47);

                setState("checkout");
            } catch (err) {
                console.error("Error initializing checkout:", err);
                setState("checkout");
            }
        };

        if (!isInitializing) initCheckout();
    }, [isAuthenticated, user, isInitializing]);

    const copyAllDetails = () => {
        const details = `Odbiorca: WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
Numer konta (IBAN): 05 1090 1535 0000 0001 5472 8891
Kwota: ${RESERVATION_FEE.toLocaleString("pl-PL")},00 PLN
Tytuł przelewu: DAOResorts Rezerwacja #${assignedTokenNumber} ${userEmail}`;
        navigator.clipboard.writeText(details);
        toast.success("Skopiowano wszystkie dane");
    };

    const handleReservationConfirm = async () => {
        setLoading(true);
        setError("");
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            sessionStorage.setItem("reserve_state", "pending");
            sessionStorage.setItem("reserve_email", userEmail);
            sessionStorage.setItem("reserve_passport", passportId);
            sessionStorage.setItem("reserve_token", assignedTokenNumber.toString());

            setState("pending");
        } catch (err) {
            setError("Wystąpił błąd. Spróbuj ponownie.");
        } finally {
            setLoading(false);
        }
    };

    if (state === "loading") {
        return (
            <div className="min-h-screen bg-[#0E1208] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent animate-spin rounded-full mb-4"></div>
                <p className="text-[#8A9E8A] font-medium tracking-widest uppercase text-sm">Inicjowanie rezerwacji...</p>
            </div>
        );
    }

    if (state === "pending") {
        return (
            <main className="bg-[#0E1208] min-h-screen pt-24 pb-20 px-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-20 h-20 rounded-full bg-[#1C2614] border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Clock className="text-[#C9A84C]" size={32} />
                    </div>
                    <h1 className="font-playfair text-3xl text-[#F5F0E8] mb-3">Rezerwacja przyjęta</h1>
                    <p className="text-[#C9A84C] font-semibold mb-4">Miejsce #{assignedTokenNumber} zarezerwowane dla Ciebie</p>
                    <p className="text-[#8A9E8A] mb-8 leading-relaxed">
                        Po uzyskaniu pozwolenia na budowę dostaniesz email z prośbą o dopłatę 17 990 PLN. Masz 30 dni.
                    </p>

                    <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-6 text-left mb-8">
                        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">Status procesu</p>
                        <div className="space-y-4">
                            {[
                                { label: "Rezerwacja zgłoszona", done: true },
                                { label: "Weryfikacja przelewu (1-2 dni)", current: true },
                                { label: "Projekt architektoniczny w toku", future: true },
                                { label: "Pozwolenie na budowę", future: true },
                                { label: "Dopłata 17 990 PLN (30 dni od PNB)", future: true },
                                { label: "Token Członkowski aktywny", future: true },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${s.done ? "bg-green-500/20 text-green-500" : s.current ? "bg-[#C9A84C]/20 text-[#C9A84C] animate-pulse" : "bg-[#2D5A3D]/20 text-[#8A9E8A]"}`}>
                                        {s.done ? "✓" : s.current ? "→" : "○"}
                                    </div>
                                    <span className={`text-sm ${s.done ? "text-green-500" : s.current ? "text-[#F5F0E8] font-medium" : "text-[#8A9E8A]"}`}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <a href="/my-collection" className="w-full bg-[#1C2614] border border-[#2D5A3D] text-[#F5F0E8] py-3 rounded-md text-sm hover:border-[#C9A84C] transition-all">Przejdź do mojego profilu</a>
                        <a href="/" className="text-[#8A9E8A] text-sm hover:text-[#C9A84C]">Wróć na stronę główną</a>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#0E1208] min-h-screen py-24 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[#8A9E8A] hover:text-[#C9A84C] transition-colors mb-6 text-sm"
                >
                    <ArrowLeft size={16} /> Wróć
                </button>

                <p className="text-[#C9A84C] text-xs uppercase tracking-widest text-center mb-2">
                    Rezerwacja Miejsca Założycielskiego
                </p>
                <h1 className="font-playfair text-4xl text-[#F5F0E8] text-center mb-2">
                    Zabezpiecz swoje miejsce
                </h1>
                <p className="text-[#8A9E8A] text-center mb-10">
                    Wpisowe rezerwacyjne blokuje 1 z 150 miejsc.
                    W pełni zwrotne jeśli resort nie powstanie.
                </p>

                <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-6 mb-6 shadow-xl">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">Co rezerwujesz</p>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[#F5F0E8] font-semibold text-lg">Miejsce Założycielskie DAOResorts</p>
                            <p className="text-[#8A9E8A] text-sm mt-1">1 z 150 miejsc · Etap 1 · Cena założycielska</p>
                        </div>
                        <div className="text-right ml-4">
                            <p className="font-playfair text-3xl text-[#C9A84C] font-bold">2 000 PLN</p>
                            <p className="text-[#8A9E8A] text-xs">wpisowe zwrotne</p>
                        </div>
                    </div>
                    <div className="border-t border-[#2D5A3D] pt-4 space-y-2">
                        {[
                            ['Numer miejsca', `#${assignedTokenNumber}`],
                            ['Paszport', `#${passportId} - ${userName}`],
                            ['Dopłata po PNB', '17 990 PLN (termin: 30 dni od PNB)'],
                            ['Łącznie', '19 990 PLN'],
                            ['Pozostało miejsc', `${150 - reservedCount} z 150`],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between text-sm">
                                <span className="text-[#8A9E8A]">{label}</span>
                                <span className="text-[#F5F0E8]">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0E1208] border border-[#C9A84C] rounded-xl p-5 mb-6">
                    <p className="text-[#C9A84C] text-sm font-semibold mb-3">✓ Gwarancja zwrotu wpisowego</p>
                    <div className="space-y-2">
                        {[
                            'Spółka nie uzyska pozwolenia na budowę',
                            'Resort nie zostanie zbudowany z jakiejkolwiek przyczyny',
                            'Zrezygnujesz w ciągu 14 dni od rezerwacji',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                                <p className="text-[#8A9E8A] text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0E1208] border border-[#2D5A3D] rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[#F5F0E8] font-semibold">Dane do przelewu</p>
                        <button onClick={copyAllDetails} className="border border-[#2D5A3D] text-[#8A9E8A] text-xs px-3 py-1.5 rounded-md hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all flex items-center gap-1.5">
                            <Copy size={12} /> Kopiuj wszystkie
                        </button>
                    </div>

                    {[
                        { label: 'Odbiorca', value: 'WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.', copyable: true },
                        { label: 'Numer konta (IBAN)', value: '05 1090 1535 0000 0001 5472 8891', copyable: true, highlight: true },
                        { label: 'Kwota', value: '2 000,00 PLN', copyable: true, highlight: true },
                        { label: 'Tytuł przelewu', value: `DAOResorts Rezerwacja #${assignedTokenNumber} ${userEmail}`, copyable: true, important: true },
                    ].map(row => (
                        <TransferRow key={row.label} {...row} />
                    ))}

                    <div className="bg-[#1C2614] rounded-lg p-3 mt-4 border-l-4 border-[#C9A84C]">
                        <p className="text-[#C9A84C] text-xs font-semibold mb-1">⚠️ Ważne - tytuł przelewu</p>
                        <p className="text-[#8A9E8A] text-xs leading-relaxed">
                            Tytuł musi zawierać numer miejsca i email. Bez tego nie przypiszemy płatności do Twojego konta.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#C9A84C] flex-shrink-0" />
                        <span className="text-[#8A9E8A] text-sm">
                            Potwierdzam że wykonałem przelew <strong className="text-[#F5F0E8]">2 000 PLN</strong> z tytułem <strong className="text-[#F5F0E8]">DAOResorts Rezerwacja #{assignedTokenNumber}</strong>
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#C9A84C] flex-shrink-0" />
                        <span className="text-[#8A9E8A] text-sm">
                            Akceptuję <a href="/regulamin" target="_blank" className="text-[#C9A84C] underline">Regulamin</a> w tym warunki zwrotu wpisowego i termin dopłaty 30 dni od uzyskania PNB
                        </span>
                    </label>

                    <button
                        onClick={handleReservationConfirm}
                        disabled={!confirmed || !acceptedTerms || loading}
                        className={`w-full py-4 rounded-md font-semibold text-lg transition-all ${confirmed && acceptedTerms ? 'bg-[#C9A84C] text-[#0E1208] cursor-pointer hover:bg-[#C9A84C]/90 shadow-lg' : 'bg-[#2D5A3D] text-[#8A9E8A] cursor-not-allowed opacity-50'}`}
                    >
                        {loading ? 'Przetwarzamy rezerwację...' : 'Potwierdzam rezerwację miejsca →'}
                    </button>

                    <p className="text-[#8A9E8A] text-xs text-center">
                        Rezerwacja potwierdzona w ciągu <strong className="text-[#F5F0E8]">1-2 dni roboczych</strong> od zaksięgowania przelewu.
                    </p>
                </div>
            </div>
        </main>
    );
}
