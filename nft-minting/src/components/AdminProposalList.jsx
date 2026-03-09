// src/components/AdminProposalList.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

export default function AdminProposalList({ refreshTrigger }) {
    const { user } = useAuth();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    const address = user?.address || user?.publicAddress || "";

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/vote/proposals`);
            const data = await res.json();
            if (res.ok) {
                setProposals(data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Błąd pobierania głosowań");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć to głosowanie?")) return;

        try {
            const res = await fetch(`${API_BASE}/api/vote/proposals/${id}`, {
                method: "DELETE",
                headers: {
                    "x-admin-address": address
                }
            });
            if (res.ok) {
                toast.success("Głosowanie usunięte");
                fetchProposals();
            } else {
                const data = await res.json();
                toast.error(data.error || "Błąd usuwania");
            }
        } catch (err) {
            console.error(err);
            toast.error("Błąd sieci");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Ładowanie głosowań...</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Aktywne i zakończone głosowania</h3>

            {proposals.length === 0 ? (
                <div className="bg-[#0D1208]/50 border border-white/5 p-12 text-center rounded-2xl">
                    <p className="text-gray-500">Brak utworzonych głosowań</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {proposals.map(p => (
                        <div key={p.id} className="bg-[#0d1117] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {p.status === 'active' ? 'Aktywne' : 'Zakończone'}
                                    </span>
                                    <span className="text-gray-500 text-xs font-mono">#{p.id}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white">{p.title}</h4>
                                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Users size={12} /> {p.totalVotes || 0} głosów
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} /> Zakończenie: {format(new Date(p.endTime), 'd MMMM HH:mm', { locale: pl })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                <div className="flex gap-2">
                                    <div className="text-center">
                                        <div className="text-[10px] text-gray-500 uppercase">Za</div>
                                        <div className="text-sm font-bold text-green-400">{p.votesFor || 0}</div>
                                    </div>
                                    <div className="text-center px-3 border-x border-white/5">
                                        <div className="text-[10px] text-gray-500 uppercase">Przeciw</div>
                                        <div className="text-sm font-bold text-red-400">{p.votesAgainst || 0}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] text-gray-500 uppercase">Wstrzym.</div>
                                        <div className="text-sm font-bold text-gray-400">{p.votesAbstain || 0}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                    title="Usuń głosowanie"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
