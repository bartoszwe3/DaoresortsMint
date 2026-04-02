// src/components/CreateProposal.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { PlusCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export default function CreateProposal({ onCreated }) {
    const { isAuthenticated, user } = useAuth();
    const { t } = useTranslation();
    const adminAddress = user?.address || user?.publicAddress || "";

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(60);
    const [isCustom, setIsCustom] = useState(false);
    const [choices, setChoices] = useState(["", ""]);
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error(t("toast_connect_wallet"));
        if (!title.trim()) return toast.error("Tytuł jest wymagany");

        const finalChoices = isCustom ? choices.filter(c => c.trim().length > 0) : [];
        if (isCustom && finalChoices.length < 2) {
            return toast.error("Podaj przynajmniej dwie opcje wyboru");
        }

        setLoading(true);
        const tLoading = toast.loading("Tworzenie propozycji...");

        try {
            const res = await fetch(`${API_BASE}/api/vote/create-proposal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    durationMinutes: Number(durationMinutes),
                    adminAddress,
                    choices: finalChoices
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Błąd tworzenia propozycji");

            toast.success(`✅ Propozycja #${data.proposalId} "${title}" utworzona!`, { id: tLoading });
            setTitle("");
            setDescription("");
            setDurationMinutes(60);
            setIsCustom(false);
            setChoices(["", ""]);
            if (onCreated) onCreated(data.proposal);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Błąd tworzenia propozycji", { id: tLoading });
        } finally {
            setLoading(false);
        }
    };

    const addChoice = () => setChoices([...choices, ""]);
    const removeChoice = (idx) => setChoices(choices.filter((_, i) => i !== idx));
    const updateChoice = (idx, val) => {
        const next = [...choices];
        next[idx] = val;
        setChoices(next);
    };

    return (
        <form onSubmit={handleCreate} className="bg-[#0d1117] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
                <PlusCircle size={20} className="text-gold-500" />
                Nowe głosowanie
            </h3>

            {/* Title */}
            <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 block">
                    Pytanie / Tytuł *
                </label>
                <input
                    type="text"
                    placeholder="np. Jakiego koloru powinny być ławki?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 block">
                    Opis (opcjonalnie)
                </label>
                <textarea
                    placeholder="Dodatkowe informacje dla głosujących..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors resize-none"
                />
            </div>

            {/* Choice Type Toggle */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                <button
                    type="button"
                    onClick={() => setIsCustom(false)}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${!isCustom ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-gray-500 hover:text-white'}`}
                >
                    Standard (Tak/Nie)
                </button>
                <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${isCustom ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-gray-500 hover:text-white'}`}
                >
                    Opcje A/B...
                </button>
            </div>

            {/* Custom Choices */}
            {isCustom && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">Opcje wyboru:</label>
                    {choices.map((c, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                type="text"
                                placeholder={`Opcja ${i + 1}`}
                                value={c}
                                onChange={e => updateChoice(i, e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/30"
                            />
                            {choices.length > 2 && (
                                <button type="button" onClick={() => removeChoice(i)} className="p-2.5 text-red-500/50 hover:text-red-500 transition-colors">✕</button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addChoice}
                        className="text-[10px] font-bold text-gold-500/70 hover:text-gold-500 uppercase flex items-center gap-1.5 mt-2 transition-colors"
                    >
                        <PlusCircle size={14} /> Dodaj opcję
                    </button>
                </div>
            )}

            {/* Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 block flex items-center gap-1">
                        <Clock size={12} /> Czas trwania
                    </label>
                    <select
                        value={durationMinutes}
                        onChange={e => setDurationMinutes(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50"
                    >
                        <option value={60}>1 godzina</option>
                        <option value={1440}>24 godziny</option>
                        <option value={4320}>3 dni</option>
                        <option value={10080}>7 dni</option>
                        <option value={20160}>14 dni</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gold-500 text-black font-black rounded-xl hover:bg-gold-400 transition-all disabled:opacity-50 shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20"
                    >
                        {loading ? "Tworzenie..." : "🗳️ Utwórz głosowanie"}
                    </button>
                </div>
            </div>
        </form>
    );
}
