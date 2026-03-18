import React, { useState, useRef, useEffect } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export default function StepEmailVerify({ email, setEmail, onVerify, loading, error, isEmailSent }) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        let timer;
        if (isEmailSent && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isEmailSent, timeLeft]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
        onVerify(email);
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in-right">
            <div className="text-center md:text-left mb-2">
                <h1 className="font-playfair text-3xl font-bold text-[#F5F0E8] mb-2">
                    {isEmailSent ? "Sprawdź skrzynkę" : "Zaloguj się emailem"}
                </h1>
                <p className="font-sans text-sm text-[#8A9E8A]">
                    {isEmailSent
                        ? "Wysłaliśmy bezpieczny link logowania na Twój adres email. Kliknij go, aby kontynuować - nie potrzebujesz hasła."
                        : "Podaj swój adres email. Wyślemy Ci link logujący bez hasła."}
                </p>
            </div>

            {!isEmailSent ? (
                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/50" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Twój adres email"
                            className="w-full bg-[#0E1208] border border-[#2D5A3D]/50 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-gold-500 transition-colors"
                            required
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-gold-500 text-[#0E1208] py-4 rounded-xl font-bold text-lg hover:bg-gold-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Wysyłanie...</span>
                        ) : (
                            "Wyślij link logowania"
                        )}
                    </button>
                </form>
            ) : (
                <div className="flex flex-col items-center gap-6 mt-4">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-2 animate-[pulse_2s_ease-in-out_infinite]">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <p className="text-white text-base text-center max-w-[280px]">
                        Wysłaliśmy link na adres:<br />
                        <strong className="text-gold-500">{email}</strong>
                    </p>
                    <div className="text-sm text-gray-500 text-center animate-pulse">
                        Oczekuję na weryfikację. Proszę sprawdzić nową kartę po kliknięciu linku.
                    </div>
                    <div className="mt-4 text-center">
                        {timeLeft > 0 ? (
                            <p className="text-xs text-gray-500">
                                Możesz wysłać ponownie za {timeLeft}s
                            </p>
                        ) : (
                            <button
                                onClick={() => onVerify(email)}
                                className="text-xs text-gold-500 hover:text-gold-400 underline underline-offset-4"
                            >
                                Wyślij link ponownie
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
