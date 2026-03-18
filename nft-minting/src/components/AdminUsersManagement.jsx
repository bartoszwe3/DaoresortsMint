import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AdminUsersManagement = () => {
    const { user, isAuthenticated } = useAuth();

    const [usersInfo, setUsersInfo] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filterKyc, setFilterKyc] = useState("all");
    const [filterPayment, setFilterPayment] = useState("all");
    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    const [stats, setStats] = useState({
        total: 0,
        kycApproved: 0,
        reserved: 0,
        awaitingPayment: 0,
        nftMinted: 0
    });

    const API_BASE = process.env.REACT_APP_API_BASE ?? "";

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch users
            const usersRes = await fetch(`${API_BASE}/api/admin/users`);
            const usersData = usersRes.ok ? await usersRes.json() : [];

            // Fetch payments
            const payRes = await fetch(`${API_BASE}/api/admin/payments`);
            const payData = payRes.ok ? await payRes.json() : { payments: [] };

            // Integrate user data with payment data locally
            const combinedUsers = usersData.map(u => {
                const userPayments = payData.payments.filter(p => p.userId.toLowerCase() === u.wallet.toLowerCase());

                // Determine next stage (first not confirmed)
                let next = 0;
                if (u.paymentStages) {
                    for (let i = 0; i <= 4; i++) {
                        if (!u.paymentStages[i] || u.paymentStages[i].status !== 'confirmed') {
                            next = i;
                            break;
                        }
                    }
                }

                return {
                    ...u,
                    nextStage: next,
                    userPayments: userPayments
                };
            });

            setUsersInfo(combinedUsers);
            setPayments(payData.payments);

            setStats({
                total: combinedUsers.length,
                kycApproved: combinedUsers.filter(u => u.kycStatus === 'approved' || u.kycStatus === 'zatwierdzone').length,
                reserved: combinedUsers.filter(u => u.paymentStages?.[0]?.status === 'confirmed').length,
                awaitingPayment: combinedUsers.some(u => Object.values(u.paymentStages || {}).some(s => s.status === 'awaiting')),
                nftMinted: combinedUsers.filter(u => u.membershipTokenId).length
            });

        } catch (err) {
            console.error("Failed to fetch admin data", err);
            toast.error("Błąd pobierania danych z serwera");
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePayment = async (wallet, stage) => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/payments/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: wallet, stage: stage })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate');

            toast.success(`Płatność dla Etapu ${stage} wygenerowana!`);
            fetchData();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const verifyPayment = async (paymentId, stage) => {
        try {
            const toastId = toast.loading(`Weryfikacja płatności Etapu ${stage}...`);
            const res = await fetch(`${API_BASE}/api/admin/payments/${paymentId}/verify`, {
                method: 'PATCH',
            });

            const data = await res.json();
            if (!res.ok) {
                toast.dismiss(toastId);
                throw new Error(data.error || 'Failed to verify');
            }

            toast.success("Zakończono sukcesem!", { id: toastId });
            fetchData();
            if (selectedUser) setSelectedUser(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Skopiowano!");
    };

    // Derived Filtering
    const filteredUsers = usersInfo.filter(u => {
        // KYC Filter
        const kMatch = filterKyc === 'all'
            ? true
            : (filterKyc === 'zatwierdzone' && (u.kycStatus === 'approved' || u.kycStatus === 'zatwierdzone'))
            || (filterKyc === 'w_trakcie' && u.kycStatus === 'pending')
            || (filterKyc === 'odrzucone' && u.kycStatus === 'rejected')
            || (filterKyc === 'wymagane' && (u.kycStatus === 'not_started' || !u.kycStatus));

        // Payment Filter (Simplified for Phase 1)
        const pMatch = filterPayment === 'all' ? true : u.paymentStatus === filterPayment;

        // Search
        const searchLower = search.toLowerCase();
        const sMatch = !search
            ? true
            : (u.email && u.email.toLowerCase().includes(searchLower)) ||
            (u.wallet && u.wallet.toLowerCase().includes(searchLower));

        return kMatch && pMatch && sMatch;
    });

    const formatKYCStatus = (val) => {
        if (val === 'approved' || val === 'zatwierdzone') return 'Zatwierdzone';
        if (val === 'pending') return 'W Trakcie';
        if (val === 'rejected') return 'Odrzucone';
        return 'Wymagane';
    };

    const getKYCBadgeColor = (val) => {
        if (val === 'approved' || val === 'zatwierdzone') return 'bg-green-500/20 text-green-400';
        if (val === 'pending') return 'bg-blue-500/20 text-blue-400';
        if (val === 'rejected') return 'bg-red-500/20 text-red-500';
        return 'bg-gray-500/20 text-gray-400';
    };

    if (!isAuthenticated) return <div className="p-10 text-center text-white">Brak dostępu. Zaloguj się.</div>;

    return (
        <div className="w-full min-h-screen py-10 px-4 text-white">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold font-sans text-white">Zarządzanie Użytkownikami</h1>
                <p className="text-gray-400 mt-2">System Płatności Etapowych (5 Etapów)</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto mb-10">
                <div className="bg-[#0d1117] border border-white/10 p-6 rounded-2xl flex flex-col items-center">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Wszyscy użytkownicy</span>
                    <span className="text-2xl text-white font-bold mt-1">{stats.total}</span>
                </div>
                <div className="bg-[#0d1117] border border-white/10 p-6 rounded-2xl flex flex-col items-center">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">KYC zatwierdzone</span>
                    <span className="text-2xl text-green-400 font-bold mt-1">{stats.kycApproved}</span>
                </div>
                <div className="bg-[#0d1117] border border-white/10 p-6 rounded-2xl flex flex-col items-center border-gold-500/20 shadow-lg shadow-gold-500/5">
                    <span className="text-gold-500 text-[10px] font-bold uppercase tracking-wider">Rezerwacje (Etap 0)</span>
                    <span className="text-2xl text-gold-500 font-bold mt-1">{stats.reserved}</span>
                </div>
                <div className="bg-[#0d1117] border border-white/10 p-6 rounded-2xl flex flex-col items-center">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Weryfikacja/Awaiting</span>
                    <span className="text-2xl text-yellow-400 font-bold mt-1">{stats.awaitingPayment ? 'Tak' : 'Brak'}</span>
                </div>
                <div className="bg-[#0d1117] border border-white/10 p-6 rounded-2xl flex flex-col items-center">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Aktywne Członkostwa</span>
                    <span className="text-2xl text-neon-cyan font-bold mt-1">{stats.nftMinted}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row gap-4 bg-[#0d1117] p-4 rounded-xl border border-white/10">
                <select
                    onChange={(e) => setFilterKyc(e.target.value)}
                    defaultValue="all"
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-neon-cyan"
                >
                    <option value="all">Wszystkie statusy KYC</option>
                    <option value="wymagane">Wymagane KYC</option>
                    <option value="w_trakcie">KYC w trakcie</option>
                    <option value="odrzucone">KYC odrzucone</option>
                    <option value="zatwierdzone">KYC zatwierdzone</option>
                </select>

                <select
                    onChange={(e) => setFilterPayment(e.target.value)}
                    defaultValue="all"
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-neon-cyan"
                >
                    <option value="all">Wszystkie płatności</option>
                    <option value="none">Brak płatności</option>
                    <option value="awaiting">Oczekuje płatności</option>
                    <option value="verification">W weryfikacji</option>
                    <option value="confirmed">Potwierdzone (etap 4)</option>
                </select>

                <input
                    type="search"
                    placeholder="Szukaj po email lub wallet..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-neon-cyan flex-1"
                />
            </div>

            {/* Table */}
            <div className="max-w-6xl mx-auto bg-[#0d1117] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 border-b border-white/5">
                            <tr>
                                <th className="p-4 font-bold text-gray-400 tracking-wider text-sm uppercase">Email</th>
                                <th className="p-4 font-bold text-gray-400 tracking-wider text-sm uppercase">Wallet</th>
                                <th className="p-4 font-bold text-gray-400 tracking-wider text-sm uppercase">Status KYC</th>
                                <th className="p-4 font-bold text-gray-400 tracking-wider text-sm uppercase">Postęp Płatności</th>
                                <th className="p-4 font-bold text-gray-400 tracking-wider text-sm uppercase">NFT</th>
                                <th className="p-4 font-bold text-gray-400 tracking-wider text-sm uppercase text-right">Akcje</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10">Ładowanie...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10">Brak wyników</td></tr>
                            ) : (
                                filteredUsers.map(u => {
                                    const hasVerification = Object.entries(u.paymentStages || {}).find(([s, data]) => data.status === 'verification');

                                    return (
                                        <tr key={u.wallet} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">{u.email}</td>
                                            <td className="p-4">
                                                <code className="text-sm text-gray-300 mr-2">
                                                    {u.wallet ? `${u.wallet.slice(0, 6)}...${u.wallet.slice(-4)}` : '-'}
                                                </code>
                                                {u.wallet && <button onClick={() => copyToClipboard(u.wallet)} className="text-gray-500 hover:text-white">📋</button>}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getKYCBadgeColor(u.kycStatus)}`}>
                                                    {formatKYCStatus(u.kycStatus)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm font-bold">
                                                <div className="flex gap-1.5 items-center">
                                                    {[0, 1, 2, 3, 4].map(s => {
                                                        const stage = u.paymentStages?.[s];
                                                        const status = stage?.status || 'none';
                                                        let color = 'bg-gray-800'; // none
                                                        if (status === 'confirmed') color = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
                                                        if (status === 'verification') color = 'bg-blue-400 animate-pulse';
                                                        if (status === 'awaiting') color = 'bg-yellow-400';

                                                        return (
                                                            <div key={s} className={`w-3 h-3 rounded-full ${color} border border-white/5`} title={`Etap ${s}: ${status}`} />
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono font-bold">
                                                {u.membershipTokenId ? <span className="text-neon-cyan">#{u.membershipTokenId}</span> : u.tokenNumber ? <span className="text-gold-500">Res #{u.tokenNumber}</span> : <span className="text-gray-600">-</span>}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {hasVerification && (
                                                        <button
                                                            onClick={() => {
                                                                const payment = u.userPayments.find(p => p.stage == hasVerification[0] && p.status === 'verification');
                                                                setSelectedUser({ ...u, currentVerificationStage: hasVerification[0], paymentDetails: payment });
                                                            }}
                                                            className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-blue-500/30"
                                                        >
                                                            ✅ Weryfikuj S{hasVerification[0]}
                                                        </button>
                                                    )}
                                                    {(u.kycStatus === 'approved' || u.kycStatus === 'zatwierdzone') && (
                                                        <>
                                                            <select
                                                                value={u.nextStage}
                                                                className="bg-black/40 border border-white/10 rounded-lg p-1 text-[10px] text-white outline-none h-8"
                                                                onChange={(e) => {
                                                                    const val = parseInt(e.target.value);
                                                                    setUsersInfo(prev => prev.map(usr => usr.wallet === u.wallet ? { ...usr, nextStage: val } : usr));
                                                                }}
                                                            >
                                                                {[0, 1, 2, 3, 4].map(s => (
                                                                    <option key={s} value={s}>Etap {s}</option>
                                                                ))}
                                                            </select>
                                                            <button
                                                                onClick={() => handleGeneratePayment(u.wallet, u.nextStage)}
                                                                className="bg-gold-500/10 text-gold-500 border border-gold-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-gold-500/20"
                                                            >
                                                                💳 Generuj
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Modal */}
            {selectedUser && selectedUser.paymentDetails && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                        <h2 className="text-xl font-bold mb-6">Weryfikacja Płatności: Etap {selectedUser.currentVerificationStage}</h2>

                        <div className="space-y-4 mb-8">
                            <div>
                                <p className="text-gray-400 text-sm">Użytkownik:</p>
                                <p className="font-bold">{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Order ID:</p>
                                <p className="font-mono bg-black/50 p-2 rounded border border-white/5">{selectedUser.paymentDetails.orderId}</p>
                            </div>

                            {selectedUser.paymentDetails.proofOfPayment?.fileUrl && (
                                <div className="mt-4 p-4 border border-blue-500/30 bg-blue-500/10 rounded-xl">
                                    <p className="font-bold text-blue-400 mb-2">Potwierdzenie Przelewu Przesłane</p>
                                    <a href={`${API_BASE}${selectedUser.paymentDetails.proofOfPayment.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-300 underline hover:text-white">
                                        📄 Zobacz plik przesłany przez użytkownika
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 border-t border-white/10 pt-6">
                            <button
                                onClick={() => verifyPayment(selectedUser.paymentDetails.id, selectedUser.currentVerificationStage)}
                                className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors text-center shadow-lg shadow-green-500/20"
                            >
                                ✅ Zatwierdź Etap {selectedUser.currentVerificationStage}
                                {selectedUser.currentVerificationStage == 4 && " & Aktywuj Członkostwo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersManagement;
