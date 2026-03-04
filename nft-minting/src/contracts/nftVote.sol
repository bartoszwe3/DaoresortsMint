// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @dev Extend IERC721 with totalSupply for quorum calculation
interface IERC721WithSupply is IERC721 {
    function totalSupply() external view returns (uint256);
}

interface IAragonDAO {
    function execute(
        bytes32 callId,
        address[] calldata actions,
        uint256[] calldata values,
        bytes[] calldata calldatas
    ) external returns (bytes[] memory);
    
    function grantRole(bytes32 role, address account) external;
}

contract AragonNFTVotingPlugin is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant MANAGER_ROLE  = keccak256("MANAGER_ROLE");
    bytes32 public constant COUNCIL_ROLE  = keccak256("COUNCIL_ROLE");

    IERC721WithSupply public nftContract;
    IAragonDAO public dao;

    struct Proposal {
        uint256 id;
        string title;
        string description;
        address[] targets;       // recipients of the role
        bytes32 roleToGrant;     // role to assign
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        mapping(uint256 => bool) hasVoted; // tokenId => hasVoted
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) private _proposals;
    
    uint256 public votingDuration   = 3 days;
    uint256 public quorumPercentage = 50; // 50% of totalSupply must vote

    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        address[] targets,
        bytes32 roleToGrant,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        uint256 tokenId,
        bool support
    );
    
    event ProposalExecuted(uint256 indexed proposalId);

    constructor(
        address _nftContract,
        address _dao
    ) {
        nftContract = IERC721WithSupply(_nftContract);
        dao = IAragonDAO(_dao);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
    }

    // ============ PROPOSALS ============

    function createProposal(
        string memory title,
        string memory description,
        address[] memory targets,
        bytes32 roleToGrant
    ) external onlyRole(PROPOSER_ROLE) returns (uint256) {
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = _proposals[proposalId];
        
        proposal.id          = proposalId;
        proposal.title       = title;
        proposal.description = description;
        proposal.targets     = targets;
        proposal.roleToGrant = roleToGrant;
        proposal.startTime   = block.timestamp;
        proposal.endTime     = block.timestamp + votingDuration;
        proposal.executed    = false;

        emit ProposalCreated(
            proposalId,
            title,
            targets,
            roleToGrant,
            proposal.endTime
        );

        return proposalId;
    }

    // ============ VOTING ============

    function vote(
        uint256 proposalId,
        uint256 tokenId,
        bool support
    ) external {
        require(proposalId < proposalCount, "Proposal does not exist");
        Proposal storage proposal = _proposals[proposalId];
        
        require(block.timestamp < proposal.endTime, "Voting period ended");
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(!proposal.hasVoted[tokenId], "Token already voted");

        proposal.hasVoted[tokenId] = true;
        
        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit VoteCast(proposalId, msg.sender, tokenId, support);
    }

    // ============ EXECUTION ============

    function executeProposal(uint256 proposalId) external {
        require(proposalId < proposalCount, "Proposal does not exist");
        Proposal storage proposal = _proposals[proposalId];
        
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(_hasReachedQuorum(proposalId), "Quorum not reached");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal did not pass");

        proposal.executed = true;

        // Simple: directly call dao.grantRole for each target
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            dao.grantRole(proposal.roleToGrant, proposal.targets[i]);
        }

        // If you want to use dao.execute(...) instead of direct grantRole,
        // you can build actions + calldatas here and call dao.execute.

        emit ProposalExecuted(proposalId);
    }

    function _hasReachedQuorum(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = _proposals[proposalId];
        uint256 totalVotes  = proposal.votesFor + proposal.votesAgainst;
        uint256 totalSupply = nftContract.totalSupply(); // uses your NFTWhitelist.totalSupply()

        if (totalSupply == 0) return false;

        return (totalVotes * 100) / totalSupply >= quorumPercentage;
    }

    // ============ VIEWS ============

    function getProposal(uint256 proposalId)
        external
        view
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address[] memory targets,
            bytes32 roleToGrant,
            uint256 startTime,
            uint256 endTime,
            uint256 votesFor,
            uint256 votesAgainst,
            bool executed
        )
    {
        require(proposalId < proposalCount, "Proposal does not exist");
        Proposal storage p = _proposals[proposalId];
        
        return (
            p.id,
            p.title,
            p.description,
            p.targets,
            p.roleToGrant,
            p.startTime,
            p.endTime,
            p.votesFor,
            p.votesAgainst,
            p.executed
        );
    }

    function hasVoted(uint256 proposalId, uint256 tokenId) external view returns (bool) {
        require(proposalId < proposalCount, "Proposal does not exist");
        return _proposals[proposalId].hasVoted[tokenId];
    }

    // ============ ADMIN CONFIG ============

    function setVotingDuration(uint256 _duration) external onlyRole(DEFAULT_ADMIN_ROLE) {
        votingDuration = _duration;
    }

    function setQuorumPercentage(uint256 _percentage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_percentage <= 100, "Invalid percentage");
        quorumPercentage = _percentage;
    }
}
