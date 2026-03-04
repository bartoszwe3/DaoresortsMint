// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTWhitelist is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(address => bool) public whitelist;
    mapping(address => bool) public hasMinted;
    
    string private _baseTokenURI;
    uint256 public maxSupply = 10000;

    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);
    event NFTMinted(address indexed to, uint256 tokenId);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI_;
    }

    function addToWhitelist(address account) external onlyOwner {
        whitelist[account] = true;
        emit AddressWhitelisted(account);
    }

    function addMultipleToWhitelist(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelist[accounts[i]] = true;
            emit AddressWhitelisted(accounts[i]);
        }
    }

    function removeFromWhitelist(address account) external onlyOwner {
        whitelist[account] = false;
        emit AddressRemovedFromWhitelist(account);
    }

    function isWhitelisted(address account) external view returns (bool) {
        return whitelist[account];
    }

    function mint() external {
        require(whitelist[msg.sender], "Address not whitelisted");
        require(!hasMinted[msg.sender], "Already minted");
        require(_tokenIdCounter.current() < maxSupply, "Max supply reached");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        hasMinted[msg.sender] = true;
        
        _safeMint(msg.sender, tokenId);
        emit NFTMinted(msg.sender, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseTokenURI_) external onlyOwner {
        _baseTokenURI = baseTokenURI_;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
