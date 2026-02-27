// src/components/AdminWhitelist.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useContract from "../hooks/useContract";
import toast from "react-hot-toast";
import { Loader2, ShieldAlert, CheckCircle, XCircle, Settings, Clock } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import CreateProposal from "./CreateProposal";

export default function AdminWhitelist() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { setVotingDuration: setVotingDurationOnChain } = useContract();

  const address = user?.address || user?.publicAddress;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingDuration, setVotingDuration] = useState("");
  const [updatingSettings, setUpdatingSettings] = useState(false);

  const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS;
  const API_BASE = process.env.REACT_APP_API_BASE;
  const isOwner = address && OWNER_ADDRESS && address.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  // Fetch requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch voting settings
  const fetchVotingSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/voting-settings`);
      if (res.ok) {
        const data = await res.json();
        // Convert seconds to minutes for display
        setVotingDuration(Math.floor(data.votingDuration / 60));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isOwner) {
      fetchRequests();
      fetchVotingSettings();
    }
  }, [isAuthenticated, address, isOwner]);

  const handleStatusUpdate = async (id, newStatus, email) => {
    const toastId = toast.loading(`Updating status to ${newStatus}...`);
    try {
      const res = await fetch(`${API_BASE}/api/admin/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminAddress: address,
          id,
          status: newStatus,
          email // Pass email for notification
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`User ${newStatus}!`, { id: toastId });
        setRequests(prev => prev.map(req =>
          req.id === id ? { ...req, status: newStatus } : req
        ));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const updateVotingSettings = async () => {
    if (!votingDuration || isNaN(votingDuration) || Number(votingDuration) <= 0) {
      return toast.error("Podaj prawidłową długość głosowania");
    }
    setUpdatingSettings(true);
    const toastId = toast.loading("Wysyłanie transakcji...");
    try {
      const durationInSeconds = Number(votingDuration) * 60;
      await setVotingDurationOnChain(durationInSeconds);
      toast.success(`Długość głosowania zmieniona na ${votingDuration} min ✅`, { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(error?.reason || error?.message || "Błąd transakcji", { id: toastId });
    } finally {
      setUpdatingSettings(false);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert size={64} className="text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">{t("admin_title")}</h2>
        <button onClick={() => toast.error("Please sign in via the menu")} className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-xl">
          {t("connect_wallet")}
        </button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-gray-400">You are not the owner of this contract.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            <Trans i18nKey="admin_title" components={[<span className="text-neon-cyan" />]} />
          </h2>
          <p className="text-gray-400">{t("admin_subtitle")}</p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
        >
          {t("reload")}
        </button>
      </div>

      {/* VOTING SETTINGS PANEL */}
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings size={20} className="text-neon-purple" /> {t("admin_voting_settings")}
        </h3>
        <div className="flex items-end gap-4 max-w-md">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase">
              {t("admin_voting_duration")}
            </label>
            <div className="relative">
              <input
                type="number"
                value={votingDuration}
                onChange={(e) => setVotingDuration(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white pl-10 focus:border-neon-purple outline-none"
              />
              <Clock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            </div>
          </div>
          <button
            onClick={updateVotingSettings}
            disabled={updatingSettings}
            className="px-6 py-3 bg-neon-purple/20 border border-neon-purple/50 text-neon-purple font-bold rounded-xl hover:bg-neon-purple/30 transition-colors disabled:opacity-50"
          >
            {updatingSettings ? <Loader2 className="animate-spin" /> : t("admin_update_btn")}
          </button>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-6 font-medium">{t("admin_table_date")}</th>
                <th className="p-6 font-medium">{t("admin_table_email")}</th>
                <th className="p-6 font-medium">{t("admin_table_wallet")}</th>
                <th className="p-6 font-medium">{t("admin_table_status")}</th>
                <th className="p-6 font-medium text-right">{t("admin_table_actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    {t("admin_no_pending")}
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 text-gray-300">
                      {new Date(req.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 font-medium text-white">{req.email}</td>
                    <td className="p-6 font-mono text-sm text-gray-400">
                      {req.wallet.slice(0, 6)}...{req.wallet.slice(-4)}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${req.status === 'approved' ? 'bg-neon-cyan/20 text-neon-cyan' :
                        req.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                        {req.status === 'approved' && <CheckCircle size={14} />}
                        {req.status === 'rejected' && <XCircle size={14} />}
                        {req.status === 'pending' && <Clock size={14} />}
                        {t(`admin_status_${req.status}`)}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(req.id, "approved", req.email)}
                            className="p-2 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                        {req.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(req.id, "rejected", req.email)}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Proposal Form Component */}
      <CreateProposal />

    </div>
  );
}
