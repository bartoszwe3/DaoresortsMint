// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DAOBeaverPassport is ERC721, ERC721Enumerable, Ownable {
    uint256 public mintPrice = 0; // Ustawione na 0 (FREE)
    uint256 public maxSupply = 5000;
    uint256 private _currentId;
    string public baseTokenURI;

    struct PassportInfo {
        uint256 tokenId;
        uint256 photoId;
        uint256 mintTimestamp;
        string memberName;
    }

    mapping(uint256 => uint256) public tokenToPhoto;
    mapping(uint256 => string) public memberNames;
    mapping(uint256 => uint256) public mintTimestamps;
    mapping(uint256 => bool) public photoUsed;

    constructor(
        string memory _initialBaseURI
    ) ERC721("DAOResorts Passport", "BEAVER") {
        baseTokenURI = _initialBaseURI;
    }

    // Overrides required by Solidity
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Zmieniona funkcja: przyjmuje adres 'to', żeby backend mógł wysłać NFT użytkownikowi
    function mintPassport(
        address _to,
        uint256 _photoId,
        string memory _name
    ) public onlyOwner {
        require(_photoId >= 1 && _photoId <= maxSupply, "Bledne ID");
        require(!photoUsed[_photoId], "Zajete");
        require(_currentId < maxSupply, "Koniec kolekcji");

        _currentId++;
        uint256 newTokenId = _currentId;

        photoUsed[_photoId] = true;
        tokenToPhoto[newTokenId] = _photoId;
        memberNames[newTokenId] = _name;
        mintTimestamps[newTokenId] = block.timestamp;

        _safeMint(_to, newTokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseTokenURI = _newBaseURI;
    }

    function getBatchTokenStatus(
        uint256 startId,
        uint256 endId
    ) external view returns (bool[] memory) {
        require(startId <= endId, "Invalid range");
        uint256 length = endId - startId + 1;
        bool[] memory statuses = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            statuses[i] = photoUsed[startId + i];
        }

        return statuses;
    }

    function getOwnedBeavers(
        address user
    ) external view returns (PassportInfo[] memory) {
        uint256 tokenCount = balanceOf(user);
        if (tokenCount == 0) {
            return new PassportInfo[](0);
        }

        PassportInfo[] memory ownedInfo = new PassportInfo[](tokenCount);
        uint256 currentIndex = 0;
        uint256 currentId = _currentId;

        for (uint256 i = 1; i <= currentId; i++) {
            if (_exists(i) && ownerOf(i) == user) {
                ownedInfo[currentIndex] = PassportInfo({
                    tokenId: i,
                    photoId: tokenToPhoto[i],
                    mintTimestamp: mintTimestamps[i],
                    memberName: memberNames[i]
                });
                currentIndex++;
            }
        }
        return ownedInfo;
    }
}
