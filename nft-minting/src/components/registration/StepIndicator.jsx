import React from "react";
import { ArrowLeft } from "lucide-react";

const steps = [
    { number: 1, label: "Wybierz metodę" },
    { number: 2, label: "Zweryfikuj tożsamość" },
    { number: 3, label: "Uzupełnij profil" },
    { number: 4, label: "Twój Paszport" }
];

export default function StepIndicator({ currentStep, onBack, onCancel }) {
    const currentStepData = steps.find(s => s.number === currentStep) || steps[0];
    const progressPercent = (currentStep / 4) * 100;

    return (
        <div className="w-full mb-8">
            {/* Top Header / Back Button */}
            <div className="flex items-center justify-between mb-4">
                {currentStep === 1 ? (
                    <button
                        onClick={onCancel}
                        className="text-[#8A9E8A] text-sm hover:text-white transition-colors flex items-center gap-1"
                    >
                        ← Wróć do strony głównej
                    </button>
                ) : (
                    <button
                        onClick={onBack}
                        className="text-[#8A9E8A] text-sm hover:text-white transition-colors flex items-center gap-1"
                    >
                        <ArrowLeft size={16} /> Wstecz
                    </button>
                )}
            </div>

            {/* Title */}
            <div className="mb-3">
                <p className="font-sans text-[12px] text-[#8A9E8A] font-medium uppercase tracking-wider">
                    Krok {currentStep} z 4
                </p>
                <h2 className="font-sans text-[14px] text-[#F5F0E8] font-semibold mt-1">
                    {currentStepData.label}
                </h2>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[#2D5A3D] rounded-full overflow-hidden">
                <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}
