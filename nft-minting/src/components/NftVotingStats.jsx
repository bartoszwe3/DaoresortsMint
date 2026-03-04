// src/components/NftVotingStats.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useContract from "../hooks/useContract"; // reusing your existing hook
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NftVotingStats() {
  const { user, isAuthenticated } = useAuth();
  const { getOwnedBeavers, getProposalCount, hasVoted } = useContract();
  const { t } = useTranslation();

  const address = user?.address || user?.publicAddress;

  const [loading, setLoading] = useState(false);
  // We'll store an array of objects: { tokenId, voteCount, proposals: [id, id...] }
  // "voteCount" is how many proposals this NFT has voted on.
  // "totalVotes" is the sum of votes (if that's what we want) but practically
  // we want to know "Did this NFT vote on proposal X?"
  const [stats, setStats] = useState([]);

  // Fetch Logic
  const fetchStats = async () => {
    if (!isAuthenticated || !address) return;
    setLoading(true);
    setStats([]);

    try {
      // 1. Get all NFTs owned by user
      const owned = await getOwnedBeavers();
      // array of { tokenId, mintTimestamp, ... }

      if (owned.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Get total proposal count
      const proposalCount = await getProposalCount(); // number (e.g. 5)

      // 3. For each NFT, check if it voted on each proposal
      // This might be heavy if you have many proposals & many NFTs.
      // Optimize if needed (Multicall would be better).
      const newStats = [];

      for (const nft of owned) {
        const tokenId = nft.tokenId;
        const votedProposals = [];

        // Check proposal IDs 0 to proposalCount-1
        for (let i = 0; i < Number(proposalCount); i++) {
          const voted = await hasVoted(i, tokenId);
          if (voted) {
            votedProposals.push(i);
          }
        }

        newStats.push({
          tokenId,
          voteCount: votedProposals.length,
          proposals: votedProposals,
          // totalVotes could be weighted if 1 NFT = 1 Vote (which it is)
          totalVotes: votedProposals.length
        });
      }

      setStats(newStats);

    } catch (err) {
      console.error("Error fetching voting stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, address]);

  return (
    <div className="w-full p-6 bg-[#0d1117] border border-white/10 rounded-2xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          {t("stats_title")}
        </h1>
        <button
          onClick={fetchStats}
          className="text-sm bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded transition"
        >
          🔄 {t("stats_reload")}
        </button>
      </div>

      {!isAuthenticated && (
        <p className="text-center text-red-400 text-sm mb-4">
          {t("stats_connect_warn")}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-neon-cyan" size={32} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* If connected but no stats found (and not loading), implies 0 NFTs or check failed */}
          {isAuthenticated && stats.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full">
              {t("stats_no_votes")}
            </p>
          )}

          {stats.map((nft) => (
            <div
              key={nft.tokenId}
              className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-neon-purple/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-neon-cyan font-bold font-mono">
                  Token #{nft.tokenId.toString()}
                </span>
              </div>

              <p className="text-xs text-gray-400">
                {t("stats_proposals_voted")} <span className="text-gray-200">{nft.voteCount}</span>
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {t("stats_total_votes")} <span className="text-gray-200">{nft.totalVotes}</span>
              </p>

              {nft.proposals.length > 0 && (
                <p className="text-[11px] text-gray-400 mt-2">
                  {t("stats_proposal_ids")} <span className="text-gray-200">
                    {nft.proposals.join(", ")}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
