// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract InterContinentalBallisticMissile is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Strings for uint256;

    uint8 public constant MAX_SUPPLY = 20;
    uint256 public mintCost = 0.002 ether;
    string private _baseTokenURI;
    bool public mintingEnabled = true;

    event CostUpdated(uint256 newCost);
    event BaseURIUpdated(string newBaseURI);
    event MintingStatusUpdated(bool enabled);
    event NFTMinted(address indexed to, uint256 indexed tokenId);

    constructor(
        address initialOwner,
        string memory baseTokenURI
    ) ERC721("InterContinentalBallisticMissile", "ICBM") Ownable(initialOwner) {
        _baseTokenURI = baseTokenURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function payToMint(address _to) public payable {
        require(mintingEnabled, "Minting is currently disabled");
        require(_to != address(0), "Cannot mint to zero address");
        require(totalSupply() < MAX_SUPPLY, "Maximum supply reached");

        if (_to != owner()) {
            require(msg.value >= mintCost, "Insufficient ETH sent");
        }

        uint256 newTokenId = totalSupply() + 1;
        _safeMint(_to, newTokenId);

        emit NFTMinted(_to, newTokenId);
    }

    // Owner functions
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setMintCost(uint256 _newCost) external onlyOwner {
        mintCost = _newCost;
        emit CostUpdated(_newCost);
    }

    function toggleMinting() external onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingStatusUpdated(mintingEnabled);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Required overrides
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
