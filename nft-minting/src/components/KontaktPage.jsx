import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export default function KontaktPage() {
    const [form, setForm] = useState({ imie: "", telefon: "" });
    const [kiedyDzwonic, setKiedyDzwonic] = useState("rano");
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState(null); // null | 'submitting' | 'success' | 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.imie || !form.telefon || !consent) return;

        const cleanedPhone = form.telefon.replace(/\D/g, '');
        if (cleanedPhone.length < 9 || cleanedPhone.length > 12) {
            toast.error("Numer telefonu musi mieć od 9 do 12 cyfr.");
            setStatus('error');
            return;
        }

        setStatus('submitting');
        try {
            console.log("🚀 Submitting lead to:", `${API_BASE}/api/leads`);
            const response = await fetch(`${API_BASE}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imie: form.imie,
                    telefon: form.telefon,
                    zrodlo: 'kontakt_page',
                    kiedy_dzwonic: kiedyDzwonic,
                })
            });
            
            if (response.ok) {
                console.log("✅ Lead submitted successfully");
                setStatus('success');
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ Server returned error:", response.status, errorData);
                setStatus('error');
            }
        } catch (err) {
            console.error("❌ Fetch error:", err);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-[#0E1208] text-[#F5F0E8] flex flex-col items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Back link */}
                <a href="/" className="inline-flex items-center gap-2 text-[#8A9E8A] text-sm mb-8 hover:text-[#C9A84C] transition-colors no-underline">
                    <ArrowLeft size={16} /> Wróć do strony
                </a>

                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-3 py-1.5 rounded-full text-[#C9A84C] text-xs font-bold uppercase tracking-widest mb-4">
                        <Phone size={14} /> Kontakt
                    </div>
                    <h1 className="font-playfair text-3xl md:text-4xl text-[#F5F0E8] mb-3">
                        Porozmawiajmy o projekcie
                    </h1>
                    <p className="text-[#8A9E8A] text-sm leading-relaxed">
                        Zostaw swoje dane - Oddzwonię osobiście i odpowiem na wszystkie pytania.
                    </p>
                </div>

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1C2614]/50 border border-[#C9A84C]/30 rounded-2xl p-8 text-center"
                    >
                        <CheckCircle size={48} className="text-[#C9A84C] mx-auto mb-4" />
                        <h2 className="font-playfair text-2xl text-[#F5F0E8] mb-2">Dziękuję!</h2>
                        <p className="text-[#8A9E8A] text-sm mb-1">Oddzwonię osobiście w ciągu 24h.</p>
                        <p className="text-[#8A9E8A] text-sm">Bez zobowiązań - ewentualna rezerwacja dopiero po rozmowie.</p>
                        <a href="/" className="inline-block mt-6 text-[#C9A84C] text-sm hover:underline no-underline">
                            ← Wróć do strony
                        </a>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-[#1C2614]/30 border border-[#2D5A3D]/30 rounded-2xl p-6 md:p-8 space-y-5">
                        {/* Imię */}
                        <div>
                            <label className="text-[#8A9E8A] text-xs uppercase tracking-widest mb-2 block">Imię</label>
                            <input
                                type="text"
                                required
                                placeholder="Twoje imię"
                                value={form.imie}
                                onChange={(e) => setForm({ ...form, imie: e.target.value })}
                                className="w-full bg-[#0E1208] border border-[#2D5A3D] px-4 py-3 text-sm text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-colors rounded-md"
                            />
                        </div>

                        {/* Telefon */}
                        <div>
                            <label className="text-[#8A9E8A] text-xs uppercase tracking-widest mb-2 block">Telefon</label>
                            <input
                                type="tel"
                                required
                                placeholder="+48 ..."
                                value={form.telefon}
                                onChange={(e) => setForm({ ...form, telefon: e.target.value })}
                                className="w-full bg-[#0E1208] border border-[#2D5A3D] px-4 py-3 text-sm text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] transition-colors rounded-md"
                            />
                        </div>

                        {/* Kiedy dzwonić */}
                        <div>
                            <label className="text-[#8A9E8A] text-xs uppercase tracking-widest mb-3 block">Kiedy mogę zadzwonić?</label>
                            <div className="flex flex-col gap-2">
                                {[
                                    { value: "rano", label: "Rano (8–12)" },
                                    { value: "poludnie", label: "Południe (12–16)" },
                                    { value: "wieczor", label: "Wieczór (16–20)" },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md border cursor-pointer transition-all ${
                                            kiedyDzwonic === option.value
                                                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#F5F0E8]"
                                                : "border-[#2D5A3D] bg-[#0E1208] text-[#8A9E8A] hover:border-[#C9A84C]/50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="kiedy"
                                            value={option.value}
                                            checked={kiedyDzwonic === option.value}
                                            onChange={(e) => setKiedyDzwonic(e.target.value)}
                                            className="accent-[#C9A84C] w-4 h-4"
                                        />
                                        <span className="text-sm">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Consent */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-[#C9A84C] shrink-0"
                            />
                            <span className="text-[#8A9E8A] text-[11px] leading-relaxed">
                                Akceptuję <a href="/regulamin" className="text-[#C9A84C] hover:underline">Regulamin</a> oraz{" "}
                                <a href="/polityka-prywatnosci" className="text-[#C9A84C] hover:underline">Politykę Prywatności</a>{" "}
                                i wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji połączenia telefonicznego.
                            </span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={status === 'submitting' || !consent}
                            style={{ background: '#C9A84C', color: '#0E1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '0.02em' }}
                            className="w-full py-4 rounded-md transition-all hover:brightness-90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {status === 'submitting' ? 'Wysyłanie...' : 'Wyślij →'}
                        </button>

                        {/* Error */}
                        {status === 'error' && (
                            <p className="text-red-400 text-xs text-center">Coś poszło nie tak. Spróbuj ponownie lub napisz na bartosz@silna.club</p>
                        )}

                        {/* Trust copy */}
                        <p className="text-[#8A9E8A] text-xs text-center leading-relaxed pt-2">
                            Oddzwonię osobiście w ciągu 24h.<br />
                            Bez zobowiązań - ewentualna rezerwacja dopiero po rozmowie.
                        </p>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
