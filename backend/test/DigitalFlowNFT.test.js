const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalLegacyNFT", function () {
  let DigitalLegacyNFT, digitalLegacyNFT, owner, addr1, addr2;

  beforeEach(async function () {
    DigitalLegacyNFT = await ethers.getContractFactory("DigitalLegacyNFT");
    [owner, addr1, addr2] = await ethers.getSigners();
    digitalLegacyNFT = await DigitalLegacyNFT.deploy();
    await digitalLegacyNFT.deployed();
  });

  describe("Minting", function () {
    it("Should mint NFT successfully", async function () {
      const tokenURI = "https://example.com/token/1";
      const price = ethers.utils.parseEther("1");
      
      await digitalLegacyNFT.connect(addr1).mintNFT(tokenURI, price, "art", 250);
      
      expect(await digitalLegacyNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await digitalLegacyNFT.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should track creator tokens", async function () {
      const tokenURI = "https://example.com/token/1";
      const price = ethers.utils.parseEther("1");
      
      await digitalLegacyNFT.connect(addr1).mintNFT(tokenURI, price, "art", 250);
      
      const creatorTokens = await digitalLegacyNFT.getCreatorTokens(addr1.address);
      expect(creatorTokens.length).to.equal(1);
      expect(creatorTokens[0]).to.equal(0);
    });
  });

  describe("Buying and Selling", function () {
    beforeEach(async function () {
      const tokenURI = "https://example.com/token/1";
      const price = ethers.utils.parseEther("1");
      await digitalLegacyNFT.connect(addr1).mintNFT(tokenURI, price, "art", 250);
    });

    it("Should buy NFT successfully", async function () {
      const price = ethers.utils.parseEther("1");
      
      await digitalLegacyNFT.connect(addr2).buyNFT(0, { value: price });
      
      expect(await digitalLegacyNFT.ownerOf(0)).to.equal(addr2.address);
    });

    it("Should pay royalties correctly", async function () {
      const price = ethers.utils.parseEther("1");
      const initialCreatorBalance = await addr1.getBalance();
      
      await digitalLegacyNFT.connect(addr2).buyNFT(0, { value: price });
      
      const finalCreatorBalance = await addr1.getBalance();
      const royalty = price.mul(250).div(10000); // 2.5%
      const sellerAmount = price.sub(royalty);
      
      expect(finalCreatorBalance.sub(initialCreatorBalance)).to.equal(sellerAmount);
    });
  });

  describe("Licensing", function () {
    beforeEach(async function () {
      const tokenURI = "https://example.com/token/1";
      const price = ethers.utils.parseEther("1");
      await digitalLegacyNFT.connect(addr1).mintNFT(tokenURI, price, "art", 250);
    });

    it("Should purchase license successfully", async function () {
      const licensePrice = ethers.utils.parseEther("0.01");
      
      await digitalLegacyNFT.connect(addr2).purchaseLicense(0, "personal", { value: licensePrice });
      
      const licenses = await digitalLegacyNFT.getTokenLicenses(0);
      expect(licenses.length).to.equal(1);
      expect(licenses[0].licensee).to.equal(addr2.address);
      expect(licenses[0].licenseType).to.equal("personal");
    });
  });
});
