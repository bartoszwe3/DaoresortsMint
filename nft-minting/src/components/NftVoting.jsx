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

const API_BASE = process.env.REACT_APP_API_BASE ?? "";
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

function VoteBar({ votesFor, votesAgainst, votesAbstain, votesByChoice, choices }) {
  const isCustom = choices && choices.length > 0;
  
  let total = 0;
  if (isCustom) {
    total = Object.values(votesByChoice || {}).reduce((a, b) => a + b, 0);
  } else {
    total = (votesFor || 0) + (votesAgainst || 0) + (votesAbstain || 0);
  }

  if (total === 0) {
    return (
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-white/5 w-full" />
        <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Brak głosów</p>
      </div>
    );
  }

  // Predefined colors for custom choices
  const colors = [
    "bg-gold-500", "bg-neon-cyan", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-blue-500"
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Wyniki: <span className="text-white">{total}</span> głosów</span>
      </div>

      {/* Dynamic Stacked Bar */}
      <div className="flex rounded-full overflow-hidden h-2.5 bg-white/5 gap-px shadow-inner">
        {isCustom ? (
          choices.map((c, idx) => {
            const count = votesByChoice?.[c] || 0;
            const pct = Math.round((count / total) * 100);
            if (pct === 0) return null;
            return <div key={c} style={{ width: `${pct}%` }} className={`${colors[idx % colors.length]} transition-all duration-700`} />;
          })
        ) : (
          <>
            {votesFor > 0 && <div style={{ width: `${Math.round((votesFor / total) * 100)}%` }} className="bg-green-500 transition-all duration-700" />}
            {votesAgainst > 0 && <div style={{ width: `${Math.round((votesAgainst / total) * 100)}%` }} className="bg-red-500 transition-all duration-700" />}
            {votesAbstain > 0 && <div style={{ width: `${Math.round((votesAbstain / total) * 100)}%` }} className="bg-gray-500 transition-all duration-700" />}
          </>
        )}
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {isCustom ? (
          choices.map((c, idx) => {
            const count = votesByChoice?.[c] || 0;
            const pct = Math.round((count / total) * 100);
            return (
              <span key={c} className="text-[10px] font-bold uppercase flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                <span className="text-white">{c}</span>
                <span className="text-gray-550">{count} ({pct}%)</span>
              </span>
            );
          })
        ) : (
          <>
            {votesFor >= 0 && (
              <span className="text-green-400 text-[10px] font-bold uppercase flex items-center gap-1">
                ✅ ZA <span className="text-white">{votesFor}</span> <span className="text-green-600/50">({Math.round((votesFor / total) * 100)}%)</span>
              </span>
            )}
            {votesAgainst >= 0 && (
              <span className="text-red-400 text-[10px] font-bold uppercase flex items-center gap-1">
                ❌ PRZECIW <span className="text-white">{votesAgainst}</span> <span className="text-red-600/50">({Math.round((votesAgainst / total) * 100)}%)</span>
              </span>
            )}
          </>
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

      let choiceLabel = selectedChoice;
      if (selectedChoice === "for") choiceLabel = "ZA";
      else if (selectedChoice === "against") choiceLabel = "PRZECIW";
      else if (selectedChoice === "abstain") choiceLabel = "WSTRZYMANIE";

      toast.success(`✅ Zagłosowano: ${choiceLabel}`);
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
                className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black text-sm font-black rounded-xl transition-all shadow-[0_0_15px_rgba(201,168,76,0.3)]">
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
          <div className="space-y-4">
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
                      {(!isState3Member && !isAdmin) && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20 flex items-center gap-1">
                          <Lock size={10} /> {t("voting_view_only")}
                        </span>
                      )}
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
                  <div className="px-6 pb-6 border-b border-white/5 mx-2 mb-2 bg-white/[0.01] rounded-2xl">
                    <VoteBar 
                      votesFor={p.votesFor} 
                      votesAgainst={p.votesAgainst} 
                      votesAbstain={p.votesAbstain} 
                      votesByChoice={p.votesByChoice}
                      choices={p.choices}
                    />
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
                            Zagłosowano: {myVoteChoice(p.id, myTokenIds[0]) === "for" ? "✅ ZA" : myVoteChoice(p.id, myTokenIds[0]) === "against" ? "❌ PRZECIW" : "- WSTRZYMANIE"}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className={`flex gap-2 ${p.choices?.length > 2 ? 'flex-col' : ''}`}>
                            {p.choices && p.choices.length > 0 ? (
                              p.choices.map((choice, idx) => {
                                const colors = ["border-gold-500 text-gold-400", "border-neon-cyan text-neon-cyan", "border-purple-500 text-purple-400", "border-orange-500 text-orange-400"];
                                const activeColor = ["bg-gold-500/20", "bg-neon-cyan/20", "bg-purple-500/20", "bg-orange-500/20"];
                                
                                return (
                                  <button key={choice}
                                    onClick={() => {
                                      const tokenId = myTokenIds.length === 1 ? myTokenIds[0] : state.selectedTokenId;
                                      setVotingState(prev => ({ ...prev, [p.id]: { ...prev[p.id], selectedChoice: choice, selectedTokenId: tokenId || prev[p.id]?.selectedTokenId } }));
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all
                                    ${state.selectedChoice === choice
                                        ? `${activeColor[idx % activeColor.length]} ${colors[idx % colors.length]}`
                                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                                      }`}>
                                    {choice}
                                  </button>
                                );
                              })
                            ) : (
                              [
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
                              ))
                            )}
                          </div>
                          <button
                            onClick={() => castVote(p.id)}
                            disabled={state.sending || !state.selectedChoice}
                            className="w-full py-3 bg-gold-500 text-black font-black rounded-xl text-sm disabled:opacity-40 transition-all hover:scale-[1.02] shadow-lg shadow-gold-500/10"
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

          {!isState3Member && !isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-gold-500/10 to-gold-600/5 border border-gold-500/20 text-center shadow-xl backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/30">
                <Lock size={32} className="text-gold-500" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-text-primary mb-3">
                {t("voting_cta_text")}
              </h3>
              <p className="text-text-secondary mb-8 text-sm max-w-sm mx-auto">
                Tylko Członkowie posiadający Paszport NFT mogą brać czynny udział w zarządzaniu klubem i decydować o kluczowych etapach rozwoju.
              </p>
              <button
                onClick={() => {
                  const registerSection = document.getElementById('register');
                  if (registerSection) registerSection.scrollIntoView({ behavior: 'smooth' });
                  else window.location.href = '/?tab=register';
                }}
                className="px-10 py-4 bg-gold-500 text-forest-900 font-black rounded-xl hover:bg-gold-400 transition-all shadow-btn-primary hover:shadow-[0_0_20px_rgba(201,168,76,0.6)] transform hover:scale-105"
              >
                {t("voting_cta_btn")}
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
