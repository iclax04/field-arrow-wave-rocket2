// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// Agora Gallery NFTs.
/// The platform minter creates the token. A resale sends ETH in, pays the
/// artist royalty and the platform fee, then pays the seller. Checks happen
/// before any external call, and the guard blocks reentrancy.
contract AgoraGallery is ERC721URIStorage, ERC2981, Ownable, ReentrancyGuard {
    uint256 public nextId = 1;
    uint96 public platformFeeBps;
    address public platformReceiver;
    mapping(uint256 => address) public creators;

    event Minted(uint256 indexed tokenId, address indexed to, string tokenURI, uint96 royaltyBps);
    event Resale(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 royaltyPaid,
        uint256 platformFee
    );

    error FeeTooHigh();
    error RoyaltyTooHigh();
    error NotSeller();
    error NoPayment();
    error SplitExceedsPrice();
    error TransferFailed();

    constructor(address receiver, uint96 feeBps) ERC721("Agora Gallery NFTs", "AGORA") Ownable(msg.sender) {
        if (feeBps > 1000) revert FeeTooHigh();
        if (receiver == address(0)) revert TransferFailed();
        platformFeeBps = feeBps;
        platformReceiver = receiver;
    }

    function setPlatform(address receiver, uint96 feeBps) external onlyOwner {
        if (feeBps > 1000) revert FeeTooHigh();
        if (receiver == address(0)) revert TransferFailed();
        platformFeeBps = feeBps;
        platformReceiver = receiver;
    }

    /// Royalty is capped at 10%. `to` is both the first holder and the royalty recipient.
    function mint(address to, string calldata uri, uint96 royaltyBps) external onlyOwner returns (uint256 tokenId) {
        if (to == address(0)) revert TransferFailed();
        if (royaltyBps > 1000) revert RoyaltyTooHigh();
        tokenId = nextId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokenRoyalty(tokenId, to, royaltyBps);
        creators[tokenId] = to;
        emit Minted(tokenId, to, uri, royaltyBps);
    }

    /// Buyer calls this with the price in ETH. Seller must still hold the token.
    function settle(uint256 tokenId, address seller) external payable nonReentrant {
        if (seller == address(0) || ownerOf(tokenId) != seller) revert NotSeller();
        if (msg.value == 0) revert NoPayment();

        (address royaltyTo, uint256 royalty) = royaltyInfo(tokenId, msg.value);
        uint256 fee = (msg.value * platformFeeBps) / 10_000;
        if (royalty + fee > msg.value) revert SplitExceedsPrice();
        uint256 rest = msg.value - royalty - fee;

        _transfer(seller, msg.sender, tokenId);

        _pay(royaltyTo, royalty);
        _pay(platformReceiver, fee);
        _pay(seller, rest);

        emit Resale(tokenId, seller, msg.sender, msg.value, royalty, fee);
    }

    function _pay(address to, uint256 amount) internal {
        if (amount == 0 || to == address(0)) return;
        (bool ok, ) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
