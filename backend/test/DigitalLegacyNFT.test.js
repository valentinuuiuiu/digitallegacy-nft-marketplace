const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalLegacyNFT", function () {
  let DigitalLegacyNFT, digitalLegacyNFT, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const DigitalLegacyNFTFactory = await ethers.getContractFactory("DigitalLegacyNFT");
    digitalLegacyNFT = await DigitalLegacyNFTFactory.deploy();
    await digitalLegacyNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await digitalLegacyNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      await digitalLegacyNFT.mintNFT("testURI", 100, "Art", 500);
      expect(await digitalLegacyNFT.ownerOf(0)).to.equal(owner.address);
    });
  });

  describe("Buying", function () {
    it("Should allow a user to buy an NFT", async function () {
      await digitalLegacyNFT.mintNFT("testURI", 100, "Art", 500);
      await digitalLegacyNFT.connect(addr1).buyNFT(0, { value: 100 });
      expect(await digitalLegacyNFT.ownerOf(0)).to.equal(addr1.address);
    });
  });

  describe("Royalties", function () {
    it("Should emit a RoyaltyPaid event with the correct amount", async function () {
        const price = ethers.parseEther("1");
        const royaltyPercentage = 500; // 5%
        await digitalLegacyNFT.mintNFT("testURI", price, "Art", royaltyPercentage);

        const royalty = (price * BigInt(royaltyPercentage)) / BigInt(10000);

        await expect(digitalLegacyNFT.connect(addr1).buyNFT(0, { value: price }))
            .to.emit(digitalLegacyNFT, "RoyaltyPaid")
            .withArgs(0, owner.address, royalty);
    });
  });

  describe("Licensing", function () {
    it("Should allow a user to purchase a license", async function () {
      await digitalLegacyNFT.mintNFT("testURI", 100, "Art", 500);
      await digitalLegacyNFT.connect(addr1).purchaseLicense(0, "personal", { value: ethers.parseEther("0.01") });
      const licenses = await digitalLegacyNFT.getTokenLicenses(0);
      expect(licenses.length).to.equal(1);
      expect(licenses[0].licensee).to.equal(addr1.address);
    });
  });

  describe("Burning", function () {
    it("Should allow the owner to burn an NFT", async function () {
      await digitalLegacyNFT.mintNFT("testURI", 100, "Art", 500);
      await digitalLegacyNFT.burn(0);
      await expect(digitalLegacyNFT.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
});
