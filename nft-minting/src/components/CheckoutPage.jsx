import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Copy, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
    STAGE_0_RESERVATION,
    STAGE_1_STRUCTURE_CLOSED,
    STAGE_2_DEVELOPER_STATE,
    STAGE_3_ACTIVATION,
    MEMBERSHIP_TOTAL
} from "../constants/tokenomics";
import toast from "react-hot-toast";
import { trackPixelEvent } from "../utils/pixel";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export const TransferRow = ({ label, value, copyable, highlight, important }) => {
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

export default function CheckoutPage() {
    const { stage: stageParam } = useParams();
    const stage = parseInt(stageParam || "0"); // Default to stage 0 (Reservation)

    const { user, isAuthenticated, isInitializing } = useAuth();
    const [state, setState] = useState("loading"); // loading | checkout | pending

    const [passportId, setPassportId] = useState("Oczekujący");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [activeMembers, setActiveMembers] = useState(0);

    const [confirmed, setConfirmed] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [error, setError] = useState("");

    // Load user data and stats
    useEffect(() => {
        const initCheckout = async () => {
            // Restore from session storage if user refreshed on pending page
            if (sessionStorage.getItem("checkout_state") === "pending") {
                setState("pending");
                const savedEmail = sessionStorage.getItem("checkout_email");
                const savedPassport = sessionStorage.getItem("checkout_passport");
                if (savedEmail) setUserEmail(savedEmail);
                if (savedPassport) setPassportId(savedPassport);
                return;
            }

            if (isInitializing) return;

            if (!isAuthenticated || !user) {
                // Not logged in -> redirect to home
                window.location.href = "/";
                return;
            }

            const address = user?.address || user?.publicAddress;
            setUserEmail(user?.email || "");

            try {
                // Fetch members count
                const membersRes = await fetch(`${API_BASE}/api/members/public`);
                const membersData = await membersRes.json();
                if (Array.isArray(membersData)) setActiveMembers(membersData.length);

                // Check user status
                if (address) {
                    const statusRes = await fetch(`${API_BASE}/api/status/${address}`);
                    const statusData = await statusRes.json();

                    if (!statusData.registered) {
                        // User exists in auth but no passport/profile -> redirect to claim passport
                        window.location.href = "/";
                        return;
                    }

                    setUserName(statusData.memberName || "Klubowicz");

                    // Try to get passport ID if they have it, otherwise fallback
                    if (statusData.hasKyc && statusData.memberTokens > 0) {
                        // Already has a token? Go to passport
                        window.location.href = "/passport";
                        return;
                    }

                    // For now, if no explicit ID is returned from backend, use a formatted placeholder based on auth
                    // The prompt mock format uses #[passportId]
                    setPassportId(statusData.passportId || "TC-" + address.substring(2, 6).toUpperCase());
                }

                setState("checkout");
                trackPixelEvent("InitiateCheckout", { value: STAGE_0_RESERVATION, currency: "PLN" });
            } catch (err) {
                console.error("Error initializing checkout:", err);
                // Fallback to checkout anyway to not block UI development for now
                setState("checkout");
            }
        };

        initCheckout();
    }, [isAuthenticated, user, isInitializing]);

    const getStageData = () => {
        switch (stage) {
            case 0: return { title: "Etap 0: Rezerwacja", amount: STAGE_0_RESERVATION, label: "wpisowe zwrotne", desc: "Zarezerwuj swoje miejsce w klubie." };
            case 1: return { title: "Etap 1: Stan surowy zamknięty", amount: STAGE_1_STRUCTURE_CLOSED, label: "dopłata", desc: "Po wylaniu fundamentów." };
            case 2: return { title: "Etap 2: Stan deweloperski", amount: STAGE_2_DEVELOPER_STATE, label: "dopłata", desc: "Po stanie surowym zamkniętym." };
            case 3: return { title: "Etap 3: Aktywacja członkostwa", amount: STAGE_3_ACTIVATION, label: "finał", desc: "Po otwarciu resortu." };
            default: return { title: "Aktywacja Członkostwa", amount: MEMBERSHIP_TOTAL, label: "jednorazowo", desc: "Pełny dostęp do klubu." };
        }
    };

    const stageData = getStageData();

    const copyAllDetails = () => {
        const details = `Odbiorca: WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
Numer konta (IBAN): 05 1090 1535 0000 0001 5472 8891
Kwota: ${stageData.amount.toLocaleString("pl-PL")},00 PLN
Tytuł przelewu: Silna.club Etap ${stage} #${passportId} ${userEmail}
Bank: mBank S.A.`;
        navigator.clipboard.writeText(details);
        toast?.success("Skopiowano wszystkie dane");
    };

    const handleConfirm = async () => {
        setLoadingAction(true);
        setError("");
        try {
            // Optional: Mock backend submit
            // await fetch(`${API_BASE}/api/checkout/submit`, { method: "POST", ... })

            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            trackPixelEvent("Purchase", { value: stageData.amount, currency: "PLN" });

            // Set session storage to persist state on refresh
            sessionStorage.setItem("checkout_state", "pending");
            sessionStorage.setItem("checkout_email", userEmail);
            sessionStorage.setItem("checkout_passport", passportId);

            setState("pending");
        } catch (err) {
            setError("Wystąpił błąd. Spróbuj ponownie lub napisz na bartosz@silna.club");
        } finally {
            setLoadingAction(false);
        }
    };

    if (state === "loading") {
        return (
            <div className="min-h-screen bg-[#0E1208] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent animate-spin rounded-full mb-4"></div>
                <p className="text-[#8A9E8A] font-medium tracking-widest uppercase text-sm">Sprawdzamy Twoje konto...</p>
            </div>
        );
    }

    if (state === "pending") {
        return (
            <div className="min-h-[80vh] bg-[#0E1208] flex items-center justify-center px-4 pt-20">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-[#1C2614] border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-6 animate-[pulse_2s_ease-in-out_infinite]">
                        <Clock className="text-[#C9A84C]" size={32} />
                    </div>
                    <h1 className="font-playfair text-3xl text-[#F5F0E8] mb-3">Zgłoszenie przyjęte</h1>
                    <p className="text-[#8A9E8A] mb-8 leading-relaxed">Dziękujemy za potwierdzenie przelewu. Weryfikujemy płatność i aktywujemy Twój Token w ciągu 1-2 dni roboczych.</p>
                    <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-5 mb-6 text-left">
                        <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-3">Status zamówienia</p>
                        {[
                            { label: "Paszport", value: `#${passportId}`, done: true },
                            { label: "Przelew zgłoszony", value: "Oczekuje weryfikacji", done: false },
                            { label: "Token Członkowski", value: "Zostanie aktywowany", done: false },
                            { label: "KYC", value: "Wymagane po aktywacji", done: false }
                        ].map(item => (
                            <div key={item.label} className="flex justify-between py-2 border-b border-[#2D5A3D] last:border-0">
                                <span className="text-[#8A9E8A] text-sm">{item.label}</span>
                                <span className={`text-sm font-medium ${item.done ? "text-green-400" : "text-[#8A9E8A]"}`}>{item.done ? "✓ " : ""}{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[#8A9E8A] text-sm mb-6">Wysłaliśmy potwierdzenie na <strong className="text-[#F5F0E8]">{userEmail}</strong></p>
                    <div className="flex flex-col gap-3">
                        <a href="/passport" className="w-full bg-[#1C2614] border border-[#2D5A3D] text-[#F5F0E8] flex items-center justify-center py-3 rounded-md text-sm hover:border-[#C9A84C] transition-all">Przejdź do Mojego Paszportu</a>
                        <a href="/" className="text-[#8A9E8A] text-sm hover:text-[#C9A84C] transition-colors">Wróć na stronę główną</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0E1208] pt-24 pb-20 px-4">
            <div className="max-w-xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[#8A9E8A] hover:text-[#C9A84C] transition-colors mb-6 text-sm"
                >
                    <ArrowLeft size={16} /> Wróć
                </button>

                <h1 className="font-playfair text-3xl md:text-4xl text-[#F5F0E8] mb-8 text-center">{stageData.title}</h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Górna Sekcja - Podsumowanie */}
                <div className="bg-[#1C2614] border border-[#2D5A3D] rounded-xl p-6 mb-6 shadow-xl">
                    <p className="text-[#C9A84C] text-xs uppercase tracking-widest mb-4">Podsumowanie zamówienia</p>
                    <div className="flex justify-between items-start mb-4">
                        <div className="pr-4">
                            <p className="text-[#F5F0E8] font-semibold text-lg leading-tight">{stageData.title}</p>
                            <p className="text-[#8A9E8A] text-sm mt-1">{stageData.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="font-playfair text-2xl md:text-3xl text-[#C9A84C] font-bold whitespace-nowrap">{stageData.amount.toLocaleString("pl-PL")} PLN</p>
                            <p className="text-[#8A9E8A] text-xs mt-1">{stageData.label}</p>
                        </div>
                    </div>
                    <div className="border-t border-[#2D5A3D] my-4" />
                    <div className="flex justify-between text-sm">
                        <span className="text-[#8A9E8A]">Paszport</span>
                        <span className="text-[#F5F0E8]">#{passportId} - {userName}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-[#8A9E8A]">Pozostało miejsc</span>
                        <span className="text-[#C9A84C] font-medium">{150 - activeMembers} z 150</span>
                    </div>
                </div>

                {/* Środkowa Sekcja - Dane Przelewu */}
                <div className="bg-[#0E1208] border border-[#C9A84C] shadow-[0_0_20px_rgba(201,168,76,0.1)] rounded-xl p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <p className="text-[#F5F0E8] font-semibold">Dane do przelewu bankowego</p>
                        <button onClick={copyAllDetails} className="flex items-center justify-center gap-2 border border-[#2D5A3D] text-[#8A9E8A] text-xs px-3 py-1.5 rounded-md hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
                            <Copy size={12} /> Kopiuj wszystkie dane
                        </button>
                    </div>

                    {[
                        { label: "Odbiorca", value: "WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.", copyable: true },
                        { label: "Numer konta (IBAN)", value: "05 1090 1535 0000 0001 5472 8891", copyable: true, highlight: true },
                        { label: "Kwota", value: `${stageData.amount.toLocaleString("pl-PL")},00 PLN`, copyable: true, highlight: true },
                        { label: "Tytuł przelewu", value: `Silna.club Etap ${stage} #${passportId} ${userEmail}`, copyable: true, important: true },
                        { label: "Bank odbiorcy", value: "mBank S.A.", copyable: false }
                    ].map(row => <TransferRow key={row.label} {...row} />)}

                    <div className="bg-[#1C2614] rounded-lg p-3 mt-4 border-l-4 border-[#C9A84C]">
                        <p className="text-[#C9A84C] text-xs font-semibold mb-1">⚠️ Ważne - tytuł przelewu</p>
                        <p className="text-[#8A9E8A] text-xs leading-relaxed">
                            Tytuł przelewu musi zawierać numer Twojego Paszportu i adres email. Bez tego nie będziemy w stanie przypisać płatności do Twojego konta.
                        </p>
                    </div>
                </div>

                {/* Dolna Sekcja - Potwierdzenie */}
                <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1 w-4 h-4 accent-[#C9A84C] flex-shrink-0" />
                        <span className="text-[#8A9E8A] text-sm leading-relaxed">
                            Potwierdzam że wykonałem przelew na kwotę <strong className="text-[#F5F0E8]">{stageData.amount.toLocaleString("pl-PL")} PLN</strong> z tytułem <strong className="text-[#F5F0E8] break-all">Silna.club Etap ${stage} #${passportId}</strong>
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-[#C9A84C] flex-shrink-0" />
                        <span className="text-[#8A9E8A] text-sm">
                            Akceptuję <a href="/regulamin" target="_blank" className="text-[#C9A84C] underline">Regulamin Członkostwa</a> WE3.CLUB RESORT DEVELOPMENT SP. Z O.O.
                        </span>
                    </label>

                    <button
                        onClick={handleConfirm}
                        disabled={!confirmed || !acceptedTerms || loadingAction}
                        className={`w-full py-4 rounded-md font-semibold text-lg transition-all duration-200 mt-2 ${confirmed && acceptedTerms ? "bg-[#C9A84C] text-[#0E1208] hover:bg-[#C9A84C]/90 cursor-pointer shadow-[0_4px_15px_rgba(201,168,76,0.3)]" : "bg-[#2D5A3D] text-[#8A9E8A] cursor-not-allowed opacity-50"}`}
                    >
                        {loadingAction ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-[#0E1208] border-t-transparent rounded-full animate-spin" />
                                Przetwarzamy...
                            </span>
                        ) : "Potwierdzam wykonanie przelewu →"}
                    </button>

                    <p className="text-[#8A9E8A] text-xs text-center leading-relaxed mt-4">
                        Po potwierdzeniu Twoje zgłoszenie trafia do weryfikacji. Token zostanie aktywowany w ciągu <strong className="text-[#F5F0E8]">1-2 dni roboczych</strong> od zaksięgowania przelewu.
                    </p>

                    <p className="text-[#8A9E8A] text-xs text-center mt-2">
                        Masz pytania? <a href="mailto:bartosz@silna.club" className="text-[#C9A84C] hover:underline">bartosz@silna.club</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
