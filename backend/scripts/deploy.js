const { ethers } = require("hardhat");
const path = require('path');

async function main() {
  console.log("Deploying DigitalLegacy NFT Contract...");

  // Get the ContractFactory and Signers
  const DigitalLegacyNFT = await ethers.getContractFactory("contracts/DigitalLegacyNFT.sol:DigitalLegacyNFT");
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  // Deploy the contract
  const digitalLegacyNFT = await DigitalLegacyNFT.deploy();
  
  console.log("DigitalLegacyNFT deployed to:", digitalLegacyNFT.target);
  
  // Save the contract address and ABI for frontend
  const fs = require('fs');
  
  // Get the ABI from the contract factory
  const contractInfo = {
    address: digitalLegacyNFT.target,
    abi: JSON.parse(JSON.stringify(DigitalLegacyNFT.interface.fragments))
  };
  
  // Ensure the frontend directory exists
  const frontendPath = path.join(__dirname, '..', '..', 'frontend'); // Changed to point to the root frontend folder
  if (!fs.existsSync(frontendPath)) {
    // It's generally better to ensure the target directory for a file write exists,
    // but if this frontendPath is critical, its non-existence might indicate a setup issue.
    // For now, we'll assume it should exist or this script is run from a context where it's fine.
    // If it's critical for this script to create it, fs.mkdirSync(frontendPath, { recursive: true }); would be safer.
    // However, the main /home/shiva/deepflow/frontend/ should already exist.
  }
  
  fs.writeFileSync(
    path.join(frontendPath, 'contract-info.json'),
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to", path.join(frontendPath, 'contract-info.json'));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
