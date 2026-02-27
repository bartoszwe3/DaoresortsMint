// src/components/NftVoting.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import useContract from "../hooks/useContract";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ThumbsUp, ThumbsDown, Minus, Clock, CheckCircle2, Users, RefreshCw, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import CreateProposal from "./CreateProposal";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5003";
const OWNER_ADDRESS = process.env.REACT_APP_OWNER_ADDRESS || "";

function formatTimeLeft(endTime) {
  if (!endTime) return null;
  const diff = endTime - Date.now();
  if (diff <= 0) return "Zakończone";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDate(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" });
}

function VoteBar({ votesFor = 0, votesAgainst = 0, votesAbstain = 0 }) {
  const realTotal = votesFor + votesAgainst + votesAbstain;
  const total = realTotal || 1;
  const pFor = Math.round((votesFor / total) * 100);
  const pAgainst = Math.round((votesAgainst / total) * 100);
  const pAbstain = Math.min(100 - pFor - pAgainst, Math.round((votesAbstain / total) * 100));

  if (realTotal === 0) {
    return (
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-white/5 w-full" />
        <p className="text-gray-600 text-xs">Brak głosów</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-500 text-xs">Łącznie: <span className="text-white font-bold">{realTotal}</span> głosów</span>
      </div>

      {/* Stacked bar */}
      <div className="flex rounded-full overflow-hidden h-3 bg-white/5 gap-px">
        {pFor > 0 && <div style={{ width: `${pFor}%` }} className="bg-green-500 transition-all duration-500" />}
        {pAgainst > 0 && <div style={{ width: `${pAgainst}%` }} className="bg-red-500 transition-all duration-500" />}
        {pAbstain > 0 && <div style={{ width: `${pAbstain}%` }} className="bg-gray-500 transition-all duration-500" />}
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {votesFor > 0 && (
          <span className="text-green-400 text-xs font-medium flex items-center gap-1">
            ✅ ZA <strong>{votesFor}</strong>
            <span className="text-green-600">({pFor}%)</span>
          </span>
        )}
        {votesAgainst > 0 && (
          <span className="text-red-400 text-xs font-medium flex items-center gap-1">
            ❌ PRZECIW <strong>{votesAgainst}</strong>
            <span className="text-red-600">({pAgainst}%)</span>
          </span>
        )}
        {votesAbstain > 0 && (
          <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
            — WSTRZYMAŁO SIĘ <strong>{votesAbstain}</strong>
            <span className="text-gray-600">({pAbstain}%)</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function NftVoting({ isState3Member }) {
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const { getOwnedBeavers } = useContract();

  const currentUserAddress = user?.address || user?.publicAddress;
  const isAdmin = OWNER_ADDRESS && currentUserAddress &&
    currentUserAddress.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myVotes, setMyVotes] = useState({});    // { [proposalId]: [{ tokenId, choice }] }
  const [myTokenIds, setMyTokenIds] = useState([]); // NFT token IDs owned by user
  const [votingState, setVotingState] = useState({}); // { [proposalId]: { selectedChoice, selectedTokenId, sending } }
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Load proposals
  const loadProposals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/vote/proposals`);
      const data = await res.json();
      setProposals(Array.isArray(data) ? data.sort((a, b) => b.createdAt - a.createdAt) : []);
    } catch (e) {
      toast.error("Błąd ładowania głosowań");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user's votes
  const loadMyVotes = useCallback(async () => {
    if (!currentUserAddress) return;
    try {
      const res = await fetch(`${API_BASE}/api/vote/my-votes/${currentUserAddress}`);
      const data = await res.json();
      setMyVotes(data || {});
    } catch { }
  }, [currentUserAddress]);

  // Load user's NFTs
  const loadMyNfts = useCallback(async () => {
    if (!isAuthenticated || !currentUserAddress) return;
    try {
      // Try blockchain first
      const owned = await getOwnedBeavers();
      if (owned && owned.length > 0) {
        setMyTokenIds(owned.map(n => String(n.tokenId || n[0])));
        return;
      }
    } catch { }
    // Fallback: users.json via status endpoint
    try {
      const res = await fetch(`${API_BASE}/api/status/${currentUserAddress}`);
      const d = await res.json();
      if (d?.minted && d?.membershipTokenId != null) {
        setMyTokenIds([String(d.membershipTokenId)]);
      }
    } catch { }
  }, [isAuthenticated, currentUserAddress, getOwnedBeavers]);

  useEffect(() => { loadProposals(); }, [loadProposals]);
  useEffect(() => { loadMyVotes(); loadMyNfts(); }, [loadMyVotes, loadMyNfts]);

  // Cast a vote
  const castVote = async (proposalId) => {
    const state = votingState[proposalId] || {};
    const { selectedChoice, selectedTokenId } = state;
    if (!selectedChoice) return toast.error("Wybierz opcję głosowania");
    if (!selectedTokenId) return toast.error("Wybierz token NFT do głosowania");

    setVotingState(prev => ({ ...prev, [proposalId]: { ...prev[proposalId], sending: true } }));
    try {
      const res = await fetch(`${API_BASE}/api/vote/cast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: currentUserAddress,
          proposalId: String(proposalId),
          tokenId: selectedTokenId,
          choice: selectedChoice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`✅ Zagłosowano (${selectedChoice === "for" ? "ZA" : selectedChoice === "against" ? "PRZECIW" : "WSTRZYMANIE"})`);
      await loadProposals();
      await loadMyVotes();
    } catch (e) {
      toast.error(e.message || "Błąd głosowania");
    } finally {
      setVotingState(prev => ({ ...prev, [proposalId]: { ...prev[proposalId], sending: false } }));
    }
  };

  const hasVotedOnProposal = (proposalId, tokenId) => {
    const votes = myVotes[proposalId] || [];
    return votes.some(v => String(v.tokenId) === String(tokenId));
  };

  const myVoteChoice = (proposalId, tokenId) => {
    const votes = myVotes[proposalId] || [];
    return votes.find(v => String(v.tokenId) === String(tokenId))?.choice;
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-black text-white">🗳️ Głosowanie DAO</h1>
            <p className="text-gray-400 text-sm mt-1">Każdy Paszport NFT to 1 głos</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadProposals} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <RefreshCw size={16} className={`text-gray-400 ${loading ? "animate-spin" : ""}`} />
            </button>
            {isAdmin && (
              <button onClick={() => setShowCreate(s => !s)}
                className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-black text-sm font-black rounded-xl">
                {showCreate ? "Anuluj" : "+ Nowe głosowanie"}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && isAdmin && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <CreateProposal onCreated={() => { setShowCreate(false); loadProposals(); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proposals */}
      {loading && proposals.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-cyan" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>{isAdmin ? "Brak głosowań. Utwórz pierwsze!" : "Brak aktywnych głosowań."}</p>
        </div>
      ) : (
        <div className="relative">
          {(!isState3Member && !isAdmin) && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-forest-900/40 backdrop-blur-md rounded-3xl border border-border-default/20 p-6 text-center">
              <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-4 border border-gold-500/30">
                <Lock size={32} className="text-gold-500" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-text-primary mb-2">Głosowania Zablokowane</h2>
              <p className="text-text-secondary mb-6 max-w-sm">Kup token członkowski, aby uzyskać pełny dostęp do zarządzania resortem i decydowania o jego przyszłości.</p>
              <button
                onClick={() => document.getElementById('voting').scrollIntoView()}
                className="px-8 py-3 bg-gold-500 text-forest-900 font-bold rounded-xl hover:bg-gold-600 transition-colors shadow-btn-primary hover:shadow-btn-primary-hover"
              >
                Kup token żeby głosować
              </button>
            </div>
          )}
          <div className={`space-y-4 ${(!isState3Member && !isAdmin) ? 'opacity-30 pointer-events-none' : ''}`}>
            {proposals.map((p, i) => {
              const isActive = p.status === "active";
              const timeLeft = p.endTime ? formatTimeLeft(p.endTime) : null;
              const state = votingState[p.id] || {};
              const isExpanded = expandedId === p.id;
              const descText = i18n.language === "pl"
                ? (p.description_pl || p.description)
                : (p.description_en || p.description_pl || p.description);

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-[#0d1117] border rounded-3xl overflow-hidden ${isActive ? "border-neon-cyan/20" : "border-white/5"}`}
                >
                  {/* Clickable header */}
                  <div
                    className="p-6 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">

                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.status === "passed" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        p.status === "active" ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" :
                          "bg-gray-500/15 text-gray-400 border border-gray-500/20"
                        }`}>
                        {p.status === "passed" ? "✅ Przyjęte" : p.status === "active" ? "🟢 Aktywne" : "🔴 Zakończone"}
                      </span>
                      {p.snapshotId && (
                        <span className="text-xs text-gray-600 border border-white/5 px-2 py-0.5 rounded-full">
                          Snapshot #{p.snapshotId.slice(0, 8)}
                        </span>
                      )}
                      {timeLeft && p.status === "active" && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {timeLeft}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-white font-black text-lg leading-tight">
                          {i18n.language === "pl" ? (p.title_pl || p.title) : (p.title_en || p.title_pl || p.title)}
                        </h3>
                        {descText && (
                          <p className={`text-gray-400 text-sm mt-2 whitespace-pre-line ${isExpanded ? "" : "line-clamp-3"}`}>
                            {descText}
                          </p>
                        )}
                        {!isExpanded && descText && descText.length > 180 && (
                          <p className="text-neon-cyan/70 text-xs mt-1 font-medium">Kliknij aby rozwinąć ↓</p>
                        )}
                        {isExpanded && (p.historicalNote_pl || p.historicalNote_en) && (
                          <p className="text-yellow-500/70 text-xs mt-3 italic">
                            📊 {i18n.language === "pl" ? p.historicalNote_pl : (p.historicalNote_en || p.historicalNote_pl)}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <p className="text-neon-cyan font-mono font-bold text-sm">#{p.id}</p>
                        <p className="text-gray-500 text-xs">{formatDate(p.createdAt)}</p>
                        <div className="text-gray-500 mt-1">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>
                  </div>{/* close clickable header */}

                  {/* Vote bar */}
                  <div className="px-6 pb-4">
                    <VoteBar votesFor={p.votesFor} votesAgainst={p.votesAgainst} votesAbstain={p.votesAbstain} />
                  </div>


                  {/* Voting UI */}
                  {isAuthenticated && isActive && myTokenIds.length > 0 && (
                    <div className="mt-5 border-t border-white/5 pt-4 space-y-3">
                      {/* Token selector (if multiple NFTs) */}
                      {myTokenIds.length > 1 && (
                        <div>
                          <label className="text-gray-500 text-xs mb-1 block">Głosujesz tokenem:</label>
                          <div className="flex flex-wrap gap-2">
                            {myTokenIds.map(tid => (
                              <button key={tid} onClick={() => setVotingState(prev => ({ ...prev, [p.id]: { ...prev[p.id], selectedTokenId: tid } }))}
                                className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${state.selectedTokenId === tid ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan" : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                                #{tid} {hasVotedOnProposal(p.id, tid) ? `✅ ${myVoteChoice(p.id, tid) === "for" ? "ZA" : myVoteChoice(p.id, tid) === "against" ? "PRZECIW" : "WSTRZ."}` : ""}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Show per-token vote status for single token */}
                      {myTokenIds.length === 1 && hasVotedOnProposal(p.id, myTokenIds[0]) ? (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={16} className="text-green-400" />
                          <span className="text-green-400 font-bold">
                            Zagłosowano: {myVoteChoice(p.id, myTokenIds[0]) === "for" ? "✅ ZA" : myVoteChoice(p.id, myTokenIds[0]) === "against" ? "❌ PRZECIW" : "— WSTRZYMANIE"}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            {[
                              { choice: "for", label: "ZA", icon: ThumbsUp, color: "green" },
                              { choice: "against", label: "PRZECIW", icon: ThumbsDown, color: "red" },
                              { choice: "abstain", label: "WSTRZYMAJ", icon: Minus, color: "gray" },
                            ].map(({ choice, label, icon: Icon, color }) => (
                              <button key={choice}
                                onClick={() => {
                                  const tokenId = myTokenIds.length === 1 ? myTokenIds[0] : state.selectedTokenId;
                                  setVotingState(prev => ({ ...prev, [p.id]: { ...prev[p.id], selectedChoice: choice, selectedTokenId: tokenId || prev[p.id]?.selectedTokenId } }));
                                }}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold border transition-all
                                ${state.selectedChoice === choice
                                    ? color === "green" ? "bg-green-500/20 border-green-500 text-green-400" : color === "red" ? "bg-red-500/20 border-red-500 text-red-400" : "bg-gray-500/20 border-gray-500 text-gray-300"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                  }`}>
                                <Icon size={14} />{label}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => castVote(p.id)}
                            disabled={state.sending || !state.selectedChoice}
                            className="w-full py-2.5 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-black rounded-xl text-sm disabled:opacity-40 transition-opacity hover:opacity-90"
                          >
                            {state.sending ? "Wysyłanie..." : "Potwierdź głos"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!isAuthenticated && isActive && (
                    <p className="mt-4 text-xs text-gray-500 border-t border-white/5 pt-3">Zaloguj się aby zagłosować</p>
                  )}
                  {isAuthenticated && isActive && myTokenIds.length === 0 && (
                    <p className="mt-4 text-xs text-gray-500 border-t border-white/5 pt-3">⚠️ Potrzebujesz Paszportu NFT żeby głosować</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
