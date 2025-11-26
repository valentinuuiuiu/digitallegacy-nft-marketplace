// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DigitalToken is ERC20, Ownable {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    uint256 public totalSupplyStaked;

    struct Proposal {
        uint256 id;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public votes;
    uint256 public proposalCount;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event ProposalCreated(uint256 id, string description);
    event Voted(address indexed voter, uint256 proposalId, bool voteFor);

    constructor() ERC20("Digital Token", "DGT") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function stake(uint256 amount) public {
        require(amount > 0, "DigitalToken: Cannot stake 0 tokens");
        _transfer(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
        totalSupplyStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) public {
        require(stakes[msg.sender] >= amount, "DigitalToken: Not enough staked tokens");
        stakes[msg.sender] -= amount;
        totalSupplyStaked -= amount;
        _transfer(address(this), msg.sender, amount);
        emit Unstaked(msg.sender, amount);
    }

    function claimReward() public {
        // This is a placeholder for a real reward calculation.
        // In a real-world scenario, you would calculate rewards based on time staked, APY, etc.
        uint256 reward = stakes[msg.sender] / 10;
        require(reward > 0, "DigitalToken: No rewards to claim");
        rewards[msg.sender] = 0; // Reset rewards after claiming
        _mint(msg.sender, reward);
        emit RewardPaid(msg.sender, reward);
    }

    function createProposal(string memory description) public {
        require(stakes[msg.sender] > 0, "DigitalToken: Must be a staker to create a proposal");
        proposalCount++;
        proposals[proposalCount] = Proposal(proposalCount, description, 0, 0, false);
        emit ProposalCreated(proposalCount, description);
    }

    function vote(uint256 proposalId, bool voteFor) public {
        require(stakes[msg.sender] > 0, "DigitalToken: Must be a staker to vote");
        require(!votes[msg.sender][proposalId], "DigitalToken: Already voted on this proposal");

        Proposal storage proposal = proposals[proposalId];
        if (voteFor) {
            proposal.votesFor += stakes[msg.sender];
        } else {
            proposal.votesAgainst += stakes[msg.sender];
        }
        votes[msg.sender][proposalId] = true;
        emit Voted(msg.sender, proposalId, voteFor);
    }
}
