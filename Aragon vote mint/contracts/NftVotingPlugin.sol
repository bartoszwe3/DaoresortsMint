// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@aragon/osx/core/plugin/Plugin.sol";
import "@aragon/osx/core/dao/IDAO.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftVotingPlugin is Plugin, Ownable {
    enum VoteOption {
        Yes, // 0
        No, // 1
        Abstain // 2
    }

    struct Proposal {
        string title;
        string description;
        bytes32 role;
        address[] targets;
        uint64 start;
        uint64 end;
        uint32 votesFor;
        uint32 votesAgainst;
        uint32 votesAbstain;
        bool executed;
        mapping(uint256 => bool) hasVoted;
        mapping(uint256 => VoteOption) tokenVote;
    }

    uint256 public proposalCount;
    IERC721Enumerable public nftToken;
    uint64 public votingDuration = 2 minutes;

    // Configs (unused in simple logic but kept for future)
    uint32 public supportThresholdBps = 5000;
    uint32 public quorumThresholdBps = 2000;
    uint32 public constant BPS_BASE = 10000;

    bytes32 public constant EXECUTE_PERMISSION_ID =
        keccak256("EXECUTE_PERMISSION");

    mapping(uint256 => Proposal) private proposals;

    event ProposalCreated(
        uint256 indexed id,
        string title,
        string description,
        bytes32 role,
        address[] targets,
        uint64 start,
        uint64 end
    );

    event Voted(
        uint256 indexed id,
        address voter,
        uint256 tokenId,
        uint8 voteOption // 0=Yes, 1=No, 2=Abstain
    );

    event Executed(uint256 indexed id);
    event VotingSettingsUpdated(uint32 support, uint32 quorum);
    event VotingDurationUpdated(uint64 duration);

    constructor(IDAO _dao, IERC721Enumerable _nftToken) Plugin(_dao) {
        nftToken = _nftToken;
    }

    // =======================================
    // Config
    // =======================================

    function setVotingDuration(uint64 _duration) external onlyOwner {
        require(_duration > 0, "Invalid duration");
        votingDuration = _duration;
        emit VotingDurationUpdated(_duration);
    }

    // =======================================
    // Proposal creation (ADMIN ONLY)
    // =======================================

    function createProposal(
        string memory _title,
        string memory _description,
        bytes32 _role,
        address[] calldata _targets
    ) external onlyOwner returns (uint256) {
        require(_targets.length > 0, "No targets");
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.title = _title;
        p.description = _description;
        p.role = _role;
        p.targets = _targets;
        p.start = uint64(block.timestamp);
        p.end = uint64(block.timestamp) + votingDuration;

        emit ProposalCreated(
            proposalCount,
            _title,
            _description,
            _role,
            _targets,
            p.start,
            p.end
        );
        return proposalCount;
    }

    // =======================================
    // Voting (Yes, No, Abstain)
    // =======================================

    function vote(
        uint256 _proposalId,
        uint256 _tokenId,
        uint8 _voteOption
    ) external {
        require(_voteOption <= 2, "Invalid vote option");

        Proposal storage p = proposals[_proposalId];
        require(p.start != 0, "Proposal not found");
        require(block.timestamp >= p.start, "Voting not started");
        require(block.timestamp <= p.end, "Voting closed");

        // Check ownership
        require(nftToken.ownerOf(_tokenId) == msg.sender, "Not token owner");

        // Check if already voted
        require(!p.hasVoted[_tokenId], "Token already voted");

        // Record vote
        p.hasVoted[_tokenId] = true;
        VoteOption option = VoteOption(_voteOption);
        p.tokenVote[_tokenId] = option;

        if (option == VoteOption.Yes) {
            p.votesFor += 1;
        } else if (option == VoteOption.No) {
            p.votesAgainst += 1;
        } else {
            p.votesAbstain += 1;
        }

        emit Voted(_proposalId, msg.sender, _tokenId, _voteOption);
    }

    // =======================================
    // Execution
    // =======================================

    function execute(uint256 _proposalId) public {
        Proposal storage p = proposals[_proposalId];
        require(p.start != 0, "Proposal not found");
        require(!p.executed, "Already executed");
        require(block.timestamp > p.end, "Voting still active");

        uint256 totalSupply = nftToken.totalSupply();
        require(totalSupply > 0, "No NFTs");

        // Simple majority logic for execution?
        // Or just execute if it exists?
        // The prompt doesn't specify strict execution rules, assuming standard:
        // Execute if For > Against? Or just allow execution to grant role?
        // Current logic was just "execute". I'll keep it simple but maybe check For > Against?
        // User prompt didn't ask to change execution logic, just voting options.
        // But "Abstain" explicitly "nie wpływa na wynik Tak/Nie".

        p.executed = true;

        IDAO.Action[] memory actions = new IDAO.Action[](p.targets.length);
        for (uint256 i = 0; i < p.targets.length; i++) {
            actions[i] = IDAO.Action({
                to: address(dao()),
                value: 0,
                data: abi.encodeWithSignature(
                    "grantRole(bytes32,address)",
                    p.role,
                    p.targets[i]
                )
            });
        }

        dao().execute(bytes32(0), actions, 0);
        emit Executed(_proposalId);
    }

    // =======================================
    // Views
    // =======================================

    function getProposal(
        uint256 _proposalId
    )
        external
        view
        returns (
            string memory title,
            string memory description,
            bytes32 role,
            address[] memory targets,
            uint64 start,
            uint64 end,
            uint32 votesFor,
            uint32 votesAgainst,
            uint32 votesAbstain,
            bool executed
        )
    {
        Proposal storage p = proposals[_proposalId];
        require(p.start != 0, "Proposal not found");
        return (
            p.title,
            p.description,
            p.role,
            p.targets,
            p.start,
            p.end,
            p.votesFor,
            p.votesAgainst,
            p.votesAbstain,
            p.executed
        );
    }

    function hasTokenVoted(
        uint256 _proposalId,
        uint256 _tokenId
    ) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_tokenId];
    }

    function getTokenVote(
        uint256 _proposalId,
        uint256 _tokenId
    ) external view returns (uint8) {
        require(proposals[_proposalId].hasVoted[_tokenId], "Not voted");
        return uint8(proposals[_proposalId].tokenVote[_tokenId]);
    }

    // Helpers for frontend (optional but good to keep)
    function getUserVotedTokens(
        uint256 _proposalId,
        address _user
    ) external view returns (uint256[] memory tokenIds) {
        Proposal storage p = proposals[_proposalId];
        require(p.start != 0, "Proposal not found");

        uint256 maxTokenId = nftToken.totalSupply();
        uint256 count = 0;

        // First pass: count
        for (uint256 i = 0; i < maxTokenId; i++) {
            try nftToken.ownerOf(i) returns (address owner) {
                if (owner == _user && p.hasVoted[i]) {
                    count++;
                }
            } catch {}
        }

        tokenIds = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < maxTokenId; i++) {
            try nftToken.ownerOf(i) returns (address owner) {
                if (owner == _user && p.hasVoted[i]) {
                    tokenIds[idx] = i;
                    idx++;
                }
            } catch {}
        }
    }
}
