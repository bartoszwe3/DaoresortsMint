/* eslint-disable no-undef */
// src/hooks/useContract.js
import { useCallback } from "react";
import { BrowserProvider, Contract, JsonRpcProvider, id } from "ethers";
import { useAppKitProvider } from "@reown/appkit/react";
import { useAuth } from "../context/AuthContext";
import { magic } from "../config/magic";

import {
  NFT_CONTRACT_ADDRESS,
  NFT_ABI,
  VOTING_CONTRACT_ADDRESS,
  VOTING_ABI,
} from "../contracts/contracts";

// 🔹 Public RPC URL for read-only calls (set your own if needed)
console.log("DEBUG: NFT_CONTRACT_ADDRESS from contracts.js =", NFT_CONTRACT_ADDRESS);
const PUBLIC_RPC_URL = process.env.REACT_APP_RPC_URL || "https://polygon-bor-rpc.publicnode.com";

function useContract() {
  const { walletProvider } = useAppKitProvider("eip155");
  const { user, isAuthenticated } = useAuth();

  const address = user?.address || user?.publicAddress;

  // ---------- PROVIDERS ----------
  const getProvider = useCallback(() => {
    if (user?.type === "magic") {
      return new BrowserProvider(magic.rpcProvider);
    }
    if (walletProvider) {
      return new BrowserProvider(walletProvider);
    }
    return null;
  }, [walletProvider, user]);

  const getRpcProvider = useCallback(() => {
    return new JsonRpcProvider(PUBLIC_RPC_URL);
  }, []);

  const getSigner = useCallback(async () => {
    const provider = getProvider();
    if (!provider) throw new Error("Wallet provider missing");
    return await provider.getSigner();
  }, [getProvider]);

  const getNftContract = useCallback(
    async (withSigner = false) => {
      if (withSigner) {
        const signer = await getSigner();
        return new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
      }
      // Put RPC first to avoid wallet network issues for read-only
      const provider = getRpcProvider();
      return new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
    },
    [getRpcProvider, getSigner]
  );

  const getVotingContract = useCallback(
    async (withSigner = false) => {
      if (withSigner) {
        const signer = await getSigner();
        return new Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer);
      }
      const browserProvider = getProvider();
      const provider = browserProvider ?? getRpcProvider();
      return new Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, provider);
    },
    [getProvider, getRpcProvider, getSigner]
  );

  // =======================================
  // WHITELIST / NFT helpers
  // =======================================
  const isWhitelisted = useCallback(async () => {
    if (!isAuthenticated || !address) throw new Error("Wallet not connected");
    const nft = await getNftContract();
    return await nft.isWhitelisted(address);
  }, [getNftContract, address, isAuthenticated]);

  // safe boolean check if token minted (ownerOf may revert)
  const isTokenMinted = useCallback(
    async (tokenId) => {
      try {
        const nft = await getNftContract();
        const owner = await nft.ownerOf(tokenId);
        return Boolean(owner);
      } catch {
        // ownerOf reverted -> not minted
        return false;
      }
    },
    [getNftContract]
  );

  const mintNft = useCallback(
    async (amount = 1) => {
      if (!isAuthenticated || !address) throw new Error("Wallet not connected");
      const nft = await getNftContract(true);
      let tx;
      if (!amount || Number(amount) === 1) {
        tx = await nft["mint()"]();
      } else {
        tx = await nft["mint(uint256)"](Number(amount));
      }
      const receipt = await tx.wait();
      return extractMintEvent(receipt, nft, address);
    },
    [getNftContract, isAuthenticated, address]
  );

  const mintById = useCallback(
    async (tokenId) => {
      if (!isAuthenticated || !address) throw new Error("Wallet not connected");
      const alreadyMinted = await isTokenMinted(tokenId);
      if (alreadyMinted) throw new Error(`Token ${tokenId} already minted`);
      const nft = await getNftContract(true);
      const tx = await nft.mintById(Number(tokenId));
      const receipt = await tx.wait();
      return extractMintEvent(receipt, nft, address);
    },
    [getNftContract, isAuthenticated, address, isTokenMinted]
  );

  // uses contract's getOwnedBeavers (returns PassportInfo[] structs)
  const getOwnedBeavers = useCallback(async () => {
    if (!isAuthenticated || !address) throw new Error("Wallet not connected");
    const nft = await getNftContract();
    const infos = await nft.getOwnedBeavers(address);
    // Return full structs: { tokenId, photoId, mintTimestamp, memberName }
    return infos;
  }, [getNftContract, isAuthenticated, address]);

  // getTotalMinted removed as contract does not support it (no public totalSupply/totalMinted)


  const getTokenUri = useCallback(
    async (tokenId) => {
      const nft = await getNftContract();
      return await nft.tokenURI(Number(tokenId));
    },
    [getNftContract]
  );

  const getBatchTokenStatus = useCallback(
    async (startId, endId) => {
      const nft = await getNftContract();
      return await nft.getBatchTokenStatus(Number(startId), Number(endId));
    },
    [getNftContract]
  );

  // =======================================
  // VOTING PLUGIN LOGIC
  // =======================================
  const getProposalCount = useCallback(async () => {
    const voting = await getVotingContract();
    const count = await voting.proposalCount();
    return Number(count);
  }, [getVotingContract]);

  const getProposal = useCallback(
    async (proposalId) => {
      const voting = await getVotingContract();
      // solidity: (bytes32 role, address[] targets, uint64 start, uint64 end, uint32 votesFor, uint32 votesAgainst, uint32 votesAbstain, bool executed)
      const res = await voting.getProposal(Number(proposalId));
      const role = res[0];
      const targets = res[1];
      const start = Number(res[2]);
      const end = Number(res[3]);
      const votesFor = Number(res[4]);
      const votesAgainst = Number(res[5]);
      const votesAbstain = Number(res[6]);
      const executed = Boolean(res[7]);

      return {
        role,
        targets,
        start,
        end,
        votesFor,
        votesAgainst,
        votesAbstain,
        executed,
      };
    },
    [getVotingContract]
  );

  const createProposal = useCallback(
    async (roleInput, targets, title = "", description = "") => {
      if (!isAuthenticated || !address) throw new Error("Wallet not connected");
      const voting = await getVotingContract(true);
      let roleBytes;
      if (
        typeof roleInput === "string" &&
        roleInput.startsWith("0x") &&
        roleInput.length === 66
      ) {
        roleBytes = roleInput;
      } else {
        roleBytes = id(roleInput);
      }
      const tx = await voting.createProposal(title, description, targets, roleBytes);
      const receipt = await tx.wait();

      // Parse logs to find ProposalCreated event
      let proposalId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = voting.interface.parseLog(log);
          if (parsed.name === "ProposalCreated") {
            proposalId = Number(parsed.args.id);
            break;
          }
        } catch (e) { }
      }

      return {
        txHash: receipt.hash,
        role: roleBytes,
        targets,
        proposalId
      };
    },
    [getVotingContract, isAuthenticated, address]
  );

  const setVotingDuration = useCallback(async (durationSeconds) => {
    if (!isAuthenticated || !address) throw new Error("Wallet not connected");
    const voting = await getVotingContract(true);
    const tx = await voting.setVotingDuration(BigInt(durationSeconds));
    const receipt = await tx.wait();
    return receipt;
  }, [getVotingContract, isAuthenticated, address]);

  // ---------- helper to safely check if a token can vote ----------
  const canVoteWithToken = useCallback(
    async (proposalId, tokenId) => {
      if (!isAuthenticated || !address)
        return { ok: false, reason: "Wallet not connected" };

      const tid = Number(tokenId);
      if (Number.isNaN(tid)) return { ok: false, reason: "Invalid token id" };

      // 1) minted?
      const minted = await isTokenMinted(tid);
      if (!minted) return { ok: false, reason: `Token #${tid} not minted` };

      // 2) ownership
      try {
        const nft = await getNftContract();
        const owner = await nft.ownerOf(tid);
        if (owner.toLowerCase() !== address.toLowerCase()) {
          return { ok: false, reason: `You are not the owner of token #${tid}` };
        }
      } catch {
        return { ok: false, reason: `Cannot verify owner for token #${tid}` };
      }

      // 3) already voted?
      try {
        const voting = await getVotingContract();
        const voted = await voting.hasTokenVoted(Number(proposalId), tid);
        if (voted)
          return {
            ok: false,
            reason: `Token #${tid} has already voted on proposal ${proposalId}`,
          };
      } catch {
        // ignore if hasTokenVoted not available
      }

      return { ok: true };
    },
    [isTokenMinted, getNftContract, getVotingContract, isAuthenticated, address]
  );

  // IMPORTANT: match vote(uint256,uint256,uint8)
  const voteOnProposal = useCallback(
    async (proposalId, tokenId, voteOption) => {
      if (!isAuthenticated || !address) throw new Error("Wallet not connected");

      const tid = Number(tokenId);
      if (Number.isNaN(tid)) throw new Error("Invalid token id");

      const vOption = Number(voteOption);
      if (Number.isNaN(vOption) || vOption < 0 || vOption > 2) {
        throw new Error("Invalid vote option (0=Yes, 1=No, 2=Abstain)");
      }

      // defensive checks before sending transaction to avoid estimateGas revert
      const minted = await isTokenMinted(tid);
      if (!minted) throw new Error(`Token #${tid} not minted`);

      const nft = await getNftContract();
      const owner = await nft.ownerOf(tid); // should not revert now
      if (owner.toLowerCase() !== address.toLowerCase()) {
        throw new Error(`You are not the owner of token #${tid}`);
      }

      const votingRead = await getVotingContract();
      const already = await votingRead.hasTokenVoted(Number(proposalId), tid);
      if (already)
        throw new Error(
          `Token #${tid} already voted on proposal ${proposalId}`
        );

      // all checks passed, perform vote with signer
      const voting = await getVotingContract(true);

      // matches Solidity: vote(uint256,uint256,uint8)
      const tx = await voting.vote(Number(proposalId), tid, vOption);

      const receipt = await tx.wait();
      return {
        txHash: receipt.hash,
        proposalId: Number(proposalId),
        tokenId: tid,
        voteOption: vOption,
      };
    },
    [getVotingContract, isAuthenticated, address, isTokenMinted, getNftContract]
  );

  const executeProposal = useCallback(
    async (proposalId) => {
      if (!isAuthenticated || !address) throw new Error("Wallet not connected");
      const voting = await getVotingContract(true);
      const tx = await voting.execute(Number(proposalId));
      const receipt = await tx.wait();
      return {
        txHash: receipt.hash,
        proposalId: Number(proposalId),
      };
    },
    [getVotingContract, isAuthenticated, address]
  );

  const getUserVotedTokens = useCallback(
    async (proposalId, userAddress) => {
      const voting = await getVotingContract();
      const ids = await voting.getUserVotedTokens(
        Number(proposalId),
        userAddress
      );
      return ids.map((x) => Number(x));
    },
    [getVotingContract]
  );

  const getTokenVoteCount = useCallback(
    async (tokenId) => {
      const voting = await getVotingContract();
      const count = await voting.getTokenVoteCount(Number(tokenId));
      return Number(count);
    },
    [getVotingContract]
  );

  const getNftTotalVotes = useCallback(
    async (tokenId) => {
      const voting = await getVotingContract();
      const total = await voting.getNftTotalVotes(Number(tokenId));
      return Number(total);
    },
    [getVotingContract]
  );

  const getTokenVotedProposals = useCallback(
    async (tokenId) => {
      const voting = await getVotingContract();
      const ids = await voting.getTokenVotedProposals(Number(tokenId));
      return ids.map((x) => Number(x));
    },
    [getVotingContract]
  );

  const hasTokenVoted = useCallback(
    async (proposalId, tokenId) => {
      const voting = await getVotingContract();
      return await voting.hasTokenVoted(
        Number(proposalId),
        Number(tokenId)
      );
    },
    [getVotingContract]
  );

  // ========= GLOBAL VOTE LOGS (NO WALLET NEEDED) =========
  const getAllVotes = useCallback(async () => {
    const provider = getRpcProvider();
    const voting = new Contract(
      VOTING_CONTRACT_ADDRESS,
      VOTING_ABI,
      provider
    );

    try {
      const filter = voting.filters.Voted();
      const events = await voting.queryFilter(filter, 0, "latest");

      return events.map((ev) => {
        const { args, blockNumber, transactionHash } = ev;

        // assuming event Voted(uint256 id, address voter, uint256 tokenId, bool support)
        const proposalId = Number(args.id ?? args[0]);
        const voter = args.voter ?? args[1];
        const tokenId = Number(args.tokenId ?? args[2]);
        const support = Boolean(args.support ?? args[3]);

        return {
          proposalId,
          voter,
          tokenId,
          support,
          txHash: transactionHash,
          blockNumber: Number(blockNumber),
        };
      });
    } catch (err) {
      console.error("getAllVotes error:", err);
      return [];
    }
  }, [getRpcProvider]);

  // =======================================
  // Parse event helpers
  // =======================================
  const extractMintEvent = (receipt, contract, user) => {
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (
          parsed.name === "Transfer" &&
          parsed.args.to.toLowerCase() === user.toLowerCase()
        ) {
          return {
            txHash: receipt.hash,
            tokenId: parsed.args.tokenId.toString(),
          };
        }
      } catch {
        // ignore non-matching logs
      }
    }
    return { txHash: receipt.hash, tokenId: null };
  };

  // =======================================
  // RETURN API
  // =======================================
  return {
    address,
    isConnected: isAuthenticated,

    // whitelist
    isWhitelisted,

    // minting
    mintNft,
    mintById,

    // info
    isTokenMinted,
    getOwnedBeavers,
    // getTotalMinted removed
    getTokenUri,
    getBatchTokenStatus,

    // contracts
    getNftContract,

    // voting plugin
    getProposalCount,
    getProposal,
    createProposal,
    setVotingDuration,
    voteOnProposal, // (proposalId, tokenId, support)
    executeProposal,
    getUserVotedTokens,
    getTokenVoteCount,
    getNftTotalVotes,
    getTokenVotedProposals,
    hasTokenVoted,
    canVoteWithToken,

    // global voting logs
    getAllVotes,
  };
}

export default useContract;
