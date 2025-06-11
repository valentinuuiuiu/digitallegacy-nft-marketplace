// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DigitalLegacyNFT is ERC721, ERC721URIStorage, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    struct NFTItem {
        uint256 tokenId;
        address creator;
        address owner;
        uint256 price;
        bool forSale;
        string category;
        uint256 royaltyPercentage; // Basis points (e.g., 250 = 2.5%)
        uint256 createdAt;
    }
    
    struct License {
        uint256 tokenId;
        address licensee;
        string licenseType; // "personal", "commercial", "extended"
        uint256 price;
        uint256 expiresAt;
        bool active;
    }
    
    mapping(uint256 => NFTItem) public nftItems;
    mapping(uint256 => License[]) public tokenLicenses;
    mapping(address => uint256[]) public creatorTokens;
    mapping(string => uint256) public licensePrices;
    
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    event LicenseGranted(uint256 indexed tokenId, address indexed licensee, string licenseType, uint256 price);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed creator, uint256 amount);
    
    constructor() ERC721("DigitalLegacy", "DLGCY") {
        // Set default license prices (in wei)
        licensePrices["personal"] = 0.01 ether;
        licensePrices["commercial"] = 0.05 ether;
        licensePrices["extended"] = 0.1 ether;
    }
    
    function mintNFT(
        string memory _tokenURI,
        uint256 price,
        string memory category,
        uint256 royaltyPercentage
    ) public returns (uint256) {
        require(royaltyPercentage <= 1000, "Royalty too high"); // Max 10%
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        nftItems[tokenId] = NFTItem({
            tokenId: tokenId,
            creator: msg.sender,
            owner: msg.sender,
            price: price,
            forSale: price > 0,
            category: category,
            royaltyPercentage: royaltyPercentage,
            createdAt: block.timestamp
        });
        
        creatorTokens[msg.sender].push(tokenId);
        
        emit NFTMinted(tokenId, msg.sender, _tokenURI, price);
        return tokenId;
    }
    
    function buyNFT(uint256 tokenId) public payable nonReentrant {
        NFTItem storage item = nftItems[tokenId];
        require(item.forSale, "NFT not for sale");
        require(msg.value >= item.price, "Insufficient payment");
        require(msg.sender != item.owner, "Cannot buy your own NFT");
        
        address seller = item.owner;
        uint256 salePrice = item.price;
        
        // Calculate royalty
        uint256 royalty = (salePrice * item.royaltyPercentage) / 10000;
        uint256 sellerAmount = salePrice - royalty;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Update item
        item.owner = msg.sender;
        item.forSale = false;
        item.price = 0;
        
        // Pay seller and creator
        payable(seller).transfer(sellerAmount);
        if (royalty > 0) {
            payable(item.creator).transfer(royalty);
            emit RoyaltyPaid(tokenId, item.creator, royalty);
        }
        
        // Refund excess payment
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }
        
        emit NFTSold(tokenId, seller, msg.sender, salePrice);
    }
    
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        
        nftItems[tokenId].price = price;
        nftItems[tokenId].forSale = true;
    }
    
    function removeFromSale(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        
        nftItems[tokenId].forSale = false;
        nftItems[tokenId].price = 0;
    }
    
    function purchaseLicense(uint256 tokenId, string memory licenseType) public payable {
        require(_exists(tokenId), "Token does not exist");
        uint256 licensePrice = licensePrices[licenseType];
        require(licensePrice > 0, "Invalid license type");
        require(msg.value >= licensePrice, "Insufficient payment");
        
        // Create license (valid for 1 year)
        License memory newLicense = License({
            tokenId: tokenId,
            licensee: msg.sender,
            licenseType: licenseType,
            price: licensePrice,
            expiresAt: block.timestamp + 365 days,
            active: true
        });
        
        tokenLicenses[tokenId].push(newLicense);
        
        // Pay creator
        address creator = nftItems[tokenId].creator;
        payable(creator).transfer(licensePrice);
        
        // Refund excess
        if (msg.value > licensePrice) {
            payable(msg.sender).transfer(msg.value - licensePrice);
        }
        
        emit LicenseGranted(tokenId, msg.sender, licenseType, licensePrice);
    }
    
    function setLicensePrice(string memory licenseType, uint256 price) public onlyOwner {
        licensePrices[licenseType] = price;
    }
    
    function getCreatorTokens(address creator) public view returns (uint256[] memory) {
        return creatorTokens[creator];
    }
    
    function getTokenLicenses(uint256 tokenId) public view returns (License[] memory) {
        return tokenLicenses[tokenId];
    }
    
    function getAllNFTsForSale() public view returns (NFTItem[] memory) {
        uint256 totalSupply = _tokenIdCounter.current();
        uint256 forSaleCount = 0;
        
        // Count items for sale
        for (uint256 i = 0; i < totalSupply; i++) {
            if (nftItems[i].forSale) {
                forSaleCount++;
            }
        }
        
        // Create array of items for sale
        NFTItem[] memory forSaleItems = new NFTItem[](forSaleCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalSupply; i++) {
            if (nftItems[i].forSale) {
                forSaleItems[index] = nftItems[i];
                index++;
            }
        }
        
        return forSaleItems;
    }
    
    // Override required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
