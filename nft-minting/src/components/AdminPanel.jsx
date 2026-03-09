// src/components/AdminPanel.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    Users,
    ShieldCheck,
    Vote,
    Settings,
    LayoutDashboard,
    LogOut
} from "lucide-react";
import AdminUsersManagement from "./AdminUsersManagement";
import AdminWhitelist from "./AdminWhitelist";
import CreateProposal from "./CreateProposal";
import AdminProposalList from "./AdminProposalList";

const AdminPanel = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("proposals");
    const [proposalRefresh, setProposalRefresh] = useState(0);

    const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
    const address = user?.address || user?.publicAddress;
    const isOwner = address && OWNER_ADDRESS && address.toLowerCase() === OWNER_ADDRESS.toLowerCase();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary text-white p-6">
                <div className="text-center max-w-md">
                    <ShieldCheck size={64} className="mx-auto text-gray-600 mb-6" />
                    <h1 className="text-3xl font-playfair font-bold mb-4">Panel Administracyjny</h1>
                    <p className="text-text-secondary mb-8">Zaloguj się, aby uzyskać dostęp do narzędzi administracyjnych.</p>
                </div>
            </div>
        );
    }

    if (!isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary text-white p-6">
                <div className="text-center max-w-md">
                    <ShieldCheck size={64} className="mx-auto text-red-500 mb-6" />
                    <h1 className="text-3xl font-playfair font-bold mb-4">Brak Dostępu</h1>
                    <p className="text-text-secondary mb-8">Twój portfel ({address}) nie ma uprawnień administratora.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: "users", label: "Użytkownicy", icon: Users },
        { id: "whitelist", label: "Whitelist", icon: ShieldCheck },
        { id: "proposals", label: "Głosowania", icon: Vote },
        { id: "settings", label: "Ustawienia", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-bg-primary text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#080D05] hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="font-playfair text-xl font-bold flex items-center gap-2">
                        DAOResorts <span className="w-1.5 h-1.5 rounded-full bg-accent-gold"></span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-accent-gold mt-1 font-bold">Admin Panel</div>
                </div>

                <nav className="flex-grow px-4 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                        ? "bg-accent-gold text-bg-primary shadow-lg shadow-accent-gold/10"
                                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-bold text-xs">
                            {address.slice(2, 4).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{address}</div>
                            <div className="text-[10px] text-gray-500">Administrator</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-screen overflow-y-auto">
                {/* Mobile Header */}
                <header className="lg:hidden p-4 border-b border-white/5 bg-[#080D05] flex justify-between items-center sticky top-0 z-40">
                    <div className="font-playfair font-bold">DAOResorts <span className="text-accent-gold">Admin</span></div>
                    <div className="flex gap-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`p-2 rounded-lg ${activeTab === tab.id ? "text-accent-gold" : "text-gray-500"}`}
                                >
                                    <Icon size={20} />
                                </button>
                            );
                        })}
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-6xl mx-auto">
                    {activeTab === "proposals" && (
                        <div className="space-y-12">
                            <section>
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h2 className="text-3xl font-playfair font-bold text-white mb-2">Zarządzanie Głosowaniami</h2>
                                        <p className="text-text-secondary">Twórz nowe propozycje i monitoruj wyniki trwających głosowań.</p>
                                    </div>
                                </div>
                                <div className="grid lg:grid-cols-[1fr_350px] gap-8 items-start">
                                    <AdminProposalList refreshTrigger={proposalRefresh} />
                                    <CreateProposal onCreated={() => setProposalRefresh(prev => prev + 1)} />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <AdminUsersManagement />
                        </div>
                    )}

                    {activeTab === "whitelist" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* We can refactor AdminWhitelist to be just the table if needed, 
                                but for now we render it as is */}
                            <AdminWhitelist />
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="bg-[#0D1208] border border-white/10 p-8 rounded-3xl">
                                <h2 className="text-2xl font-playfair font-bold mb-6">Ustawienia Globalne</h2>
                                <p className="text-text-secondary mb-8">Konfiguracja parametrów kontraktów i parametrów systemu.</p>
                                {/* We can move individual settings here from other components later */}
                                <div className="p-8 border border-white/5 rounded-2xl text-center text-gray-500 italic">
                                    Dodatkowe ustawienia w przygotowaniu...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
