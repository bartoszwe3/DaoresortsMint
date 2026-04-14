import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, User, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { trackPixelEvent } from "../../utils/pixel";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
};

export default function RegistrationFlow({ onCancel, isLogin = false }) {
    const { isAuthenticated, loginWithEmailOTP } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [phone, setPhone] = useState("");
    
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // If authenticated, we handle linking in AuthContext and then user can go to mint
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/mint");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!email) {
            setError("Email jest wymagany.");
            return;
        }

        if (!isLogin) {
            if (!firstName || !phone) {
                setError("Imię i numer telefonu są wymagane do rejestracji.");
                return;
            }
        }

        setLoading(true);
        try {
            if (!isLogin) {
                const res = await fetch(`${API_BASE}/api/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, firstName, phone })
                });

                if (!res.ok) {
                    const d = await res.json();
                    throw new Error(d.error || "Błąd rejestracji");
                }
                
                trackPixelEvent('Lead', { email, firstName });
            }

            // Invoke Magic Email OTP Overlay
            await loginWithEmailOTP(email, () => {
                setIsEmailSent(true);
            });

        } catch (err) {
            setError(err.message || "Wystąpił błąd. Spróbuj ponownie.");
            setIsEmailSent(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto min-h-[500px] flex flex-col justify-center py-10 px-4">
            <div className="bg-[#0E1208] border border-[#2D5A3D]/40 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] pointer-events-none rounded-full" />
                
                <button
                    onClick={onCancel}
                    className="absolute top-6 left-6 text-[#8A9E8A] hover:text-[#C9A84C] transition-colors flex items-center gap-2 text-sm z-10"
                >
                    <ArrowLeft size={16} /> Powrót
                </button>

                <div className="relative z-10 pt-8">
                    <AnimatePresence mode="wait">
                        {!isEmailSent ? (
                            <motion.div key="form" variants={pageVariants} initial="initial" animate="in" exit="out">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-playfair font-semibold text-white mb-2">
                                        {isLogin ? "Zaloguj się" : "Dołącz za darmo"}
                                    </h2>
                                    <p className="text-[#8A9E8A] text-sm">
                                        {isLogin ? "Wpisz swój email, aby otrzymać link logowania." : "Zarejestruj się, aby uzyskać bezpłatny profil w klubie DAOResorts."}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {!isLogin && (
                                        <>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9E8A]" size={20} />
                                                <input
                                                    type="text"
                                                    placeholder="Imię"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="w-full bg-[#1C2614] border border-[#2D5A3D]/50 text-white rounded-xl px-12 py-4 focus:outline-none focus:border-[#C9A84C] transition-colors"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9E8A]" size={20} />
                                                <input
                                                    type="tel"
                                                    placeholder="Numer telefonu"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full bg-[#1C2614] border border-[#2D5A3D]/50 text-white rounded-xl px-12 py-4 focus:outline-none focus:border-[#C9A84C] transition-colors"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9E8A]" size={20} />
                                        <input
                                            type="email"
                                            placeholder="Adres email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#1C2614] border border-[#2D5A3D]/50 text-white rounded-xl px-12 py-4 focus:outline-none focus:border-[#C9A84C] transition-colors"
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="text-red-400 text-sm mt-2 text-center p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#C9A84C] hover:bg-[#D4B96A] text-[#0E1208] font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <><Loader2 className="animate-spin" size={20} /> Przetwarzanie...</>
                                        ) : (
                                            isLogin ? "Zaloguj się" : "Dołącz za darmo"
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="success" variants={pageVariants} initial="initial" animate="in" exit="out" className="text-center py-10">
                                <div className="w-20 h-20 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail size={40} />
                                </div>
                                <h3 className="text-2xl font-playfair font-semibold text-white mb-4">
                                    Sprawdź skrzynkę
                                </h3>
                                <p className="text-[#8A9E8A] leading-relaxed max-w-sm mx-auto">
                                    Wysłaliśmy bezpieczny link na <strong>{email}</strong>. 
                                    Kliknij w niego, aby się autoryzować. Pamiętaj, aby otworzyć link na tym samym urządzeniu.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
