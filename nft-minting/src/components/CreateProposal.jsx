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
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error(t("toast_connect_wallet"));
        if (!title.trim()) return toast.error("Tytuł jest wymagany");

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
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Błąd tworzenia propozycji");

            toast.success(`✅ Propozycja #${data.proposalId} "${title}" utworzona!`, { id: tLoading });
            setTitle("");
            setDescription("");
            setDurationMinutes(60);
            if (onCreated) onCreated(data.proposal);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Błąd tworzenia propozycji", { id: tLoading });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreate} className="bg-[#0d1117] border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
                <PlusCircle size={20} className="text-accent-gold" />
                Nowe głosowanie
            </h3>

            {/* Title */}
            <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 block">
                    Pytanie / Tytuł *
                </label>
                <input
                    type="text"
                    placeholder="np. Jakiego koloru powinny być ławki?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/50 transition-colors"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 block">
                    Opis (opcjonalnie)
                </label>
                <textarea
                    placeholder="Dodatkowe informacje dla głosujących..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/50 transition-colors resize-none"
                />
            </div>

            {/* Duration */}
            <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1 block flex items-center gap-1">
                    <Clock size={12} /> Czas trwania głosowania
                </label>
                <select
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                >
                    <option value={30}>30 minut</option>
                    <option value={60}>1 godzina</option>
                    <option value={360}>6 godzin</option>
                    <option value={720}>12 godzin</option>
                    <option value={1440}>24 godziny</option>
                    <option value={4320}>3 dni</option>
                    <option value={10080}>7 dni</option>
                    <option value={20160}>14 dni</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent-gold text-bg-primary font-black rounded-xl hover:bg-accent-gold-hover transition-colors disabled:opacity-50"
            >
                {loading ? "Tworzenie..." : "🗳️ Utwórz głosowanie"}
            </button>
        </form>
    );
}
