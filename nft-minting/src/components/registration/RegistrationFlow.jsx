import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

// Import steps
import StepIndicator from "./StepIndicator";
import StepMethodSelect from "./StepMethodSelect";
import StepEmailVerify from "./StepEmailVerify";
import StepWalletConnect from "./StepWalletConnect";
import StepProfile from "./StepProfile";
import { trackPixelEvent } from "../../utils/pixel";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

// Animation variants
const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
};
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.3 };

export default function RegistrationFlow({ onCancel }) {
    const { user, isAuthenticated, loginWithMagicLink } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [authMethod, setAuthMethod] = useState(null); // 'email' | 'wallet'

    // Form State
    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Determine current step based on auth state
    useEffect(() => {
        // If user is authenticated but needs profile (step 3)
        if (isAuthenticated && currentStep < 3) {
            checkUserStatus();
        }
    }, [isAuthenticated]);

    const checkUserStatus = async () => {
        try {
            const address = user?.address || user?.publicAddress;
            if (!address) return;

            const res = await fetch(`${API_BASE}/api/status/${address}`);
            const data = await res.json();

            if (data.registered) {
                setFirstName(data.memberName || "");
                navigate("/mint"); // Existing user, go to gallery
            } else {
                setCurrentStep(3); // New user, go to profile
            }
        } catch (e) {
            console.error("Failed to check user status", e);
            setCurrentStep(3);
        }
    };

    const goNext = () => setCurrentStep(prev => prev + 1);
    const goBack = () => {
        setError("");
        setLoading(false); // Fix: Reset loading state on back
        if (currentStep === 2) {
            setAuthMethod(null);
            setIsEmailSent(false); // reset
        }
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    // Step 2 Actions
    const handleSendMagicLink = async (emailToUse) => {
        setError("");
        setLoading(true);
        try {
            // Magic link sends email and waits for user to click
            await loginWithMagicLink(emailToUse, () => {
                setIsEmailSent(true);
            });
            // Context will update isAuthenticated which triggers useEffect to move to Step 3
        } catch (err) {
            setError(err.message || "Błąd logowania. Spróbuj ponownie.");
            setIsEmailSent(false);
        } finally {
            setLoading(false);
        }
    };

    // Step 3 Actions
    const handleRegisterProfile = async (profileData) => {
        setError("");
        setLoading(true);
        try {
            const address = user?.address || user?.publicAddress;
            const userEmail = profileData.email || email || user?.email || "";

            if (!address) throw new Error("Brak adresu portfela");
            if (!userEmail) throw new Error("Brak adresu email. Wprowadź email.");

            const payload = {
                email: userEmail,
                wallet: address,
                ...profileData
            };

            const res = await fetch(`${API_BASE}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || "Błąd rejestracji");
            }

            setFirstName(profileData.firstName);
            trackPixelEvent('Lead', { email: userEmail, firstName: profileData.firstName });
            toast.success("Profil utworzony pomyślnie! 🎉");
            navigate("/mint");
        } catch (err) {
            setError(err.message || "Wystąpił błąd podczas zakładania profilu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto min-h-[500px] flex flex-col justify-center py-10 px-4">
            {/* Container */}
            <div className="bg-[#0E1208] border border-[#2D5A3D]/40 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">

                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] pointer-events-none rounded-full" />

                <StepIndicator
                    currentStep={currentStep}
                    onBack={goBack}
                    onCancel={onCancel}
                />

                <div className="relative overflow-hidden w-full">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <StepMethodSelect setAuthMethod={setAuthMethod} goNext={goNext} />
                            </motion.div>
                        )}

                        {currentStep === 2 && authMethod === 'email' && (
                            <motion.div key="step2-email" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <StepEmailVerify
                                    email={email}
                                    setEmail={setEmail}
                                    onVerify={handleSendMagicLink}
                                    loading={loading}
                                    error={error}
                                    isEmailSent={isEmailSent}
                                />
                            </motion.div>
                        )}

                        {currentStep === 2 && authMethod === 'wallet' && (
                            <motion.div key="step2-wallet" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <StepWalletConnect
                                    goNext={goNext}
                                    loading={loading}
                                    error={error}
                                    setError={setError}
                                />
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div key="step3" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}>
                                <StepProfile
                                    initialEmail={email || user?.email || ""}
                                    goNext={goNext}
                                    onRegister={handleRegisterProfile}
                                    loading={loading}
                                    error={error}
                                    setError={setError}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
