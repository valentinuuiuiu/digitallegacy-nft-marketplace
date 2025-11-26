const { ethers } = require("hardhat");
const path = require('path');
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  // Deploy DigitalLegacyNFT
  console.log("Deploying DigitalLegacyNFT Contract...");
  const DigitalLegacyNFT = await ethers.getContractFactory("DigitalLegacyNFT");
  const digitalLegacyNFT = await DigitalLegacyNFT.deploy();
  await digitalLegacyNFT.waitForDeployment();
  console.log("DigitalLegacyNFT deployed to:", digitalLegacyNFT.target);

  // Deploy DigitalToken
  console.log("Deploying DigitalToken Contract...");
  const DigitalToken = await ethers.getContractFactory("DigitalToken");
  const digitalToken = await DigitalToken.deploy();
  await digitalToken.waitForDeployment();
  console.log("DigitalToken deployed to:", digitalToken.target);

  // Save contract info for frontend
  const frontendPath = path.join(__dirname, '..', '..', 'frontend');
  const contractsInfoPath = path.join(frontendPath, 'contracts-info.json');

  const contractsInfo = {
    DigitalLegacyNFT: {
      address: digitalLegacyNFT.target,
      abi: JSON.parse(JSON.stringify(DigitalLegacyNFT.interface.fragments))
    },
    DigitalToken: {
      address: digitalToken.target,
      abi: JSON.parse(JSON.stringify(DigitalToken.interface.fragments))
    }
  };

  fs.writeFileSync(
    contractsInfoPath,
    JSON.stringify(contractsInfo, null, 2)
  );

  console.log("Contracts info saved to", contractsInfoPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
