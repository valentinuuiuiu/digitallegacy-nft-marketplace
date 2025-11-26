const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalToken", function () {
  let DigitalToken, digitalToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const DigitalTokenFactory = await ethers.getContractFactory("DigitalToken");
    digitalToken = await DigitalTokenFactory.deploy();
    await digitalToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await digitalToken.owner()).to.equal(owner.address);
    });
  });

  describe("Staking", function () {
    it("Should allow a user to stake tokens", async function () {
      await digitalToken.mint(addr1.address, 100);
      await digitalToken.connect(addr1).stake(100);
      expect(await digitalToken.stakes(addr1.address)).to.equal(100);
    });
  });

  describe("Governance", function () {
    it("Should allow a staker to create a proposal", async function () {
      await digitalToken.mint(addr1.address, 100);
      await digitalToken.connect(addr1).stake(100);
      await digitalToken.connect(addr1).createProposal("Test Proposal");
      const proposal = await digitalToken.proposals(1);
      expect(proposal.description).to.equal("Test Proposal");
    });

    it("Should not allow a non-staker to create a proposal", async function () {
      await expect(digitalToken.connect(addr1).createProposal("Test Proposal")).to.be.revertedWith("DigitalToken: Must be a staker to create a proposal");
    });

    it("Should allow a staker to vote on a proposal", async function () {
      await digitalToken.mint(addr1.address, 100);
      await digitalToken.connect(addr1).stake(100);
      await digitalToken.connect(addr1).createProposal("Test Proposal");
      await digitalToken.connect(addr1).vote(1, true);
      const proposal = await digitalToken.proposals(1);
      expect(proposal.votesFor).to.equal(100);
    });
  });
});
