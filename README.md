# DigitalLegacy NFT Marketplace 🎨

A modern, full-stack NFT marketplace built with Ethereum blockchain integration. Create, buy, sell, and trade digital assets with ease.

![DigitalLegacy Banner](https://via.placeholder.com/1200x400/8B5CF6/FFFFFF?text=DigitalLegacy+NFT+Marketplace)

## ✨ Features

### 🎯 Core Functionality
- **Create NFTs**: Upload images, videos, or audio files and mint them as NFTs
- **Marketplace**: Browse and purchase NFTs from other creators
- **Profile Management**: View your owned and created NFTs
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **IPFS Storage**: Decentralized storage for NFT metadata and files

### 🛠 Technical Features
- **Smart Contracts**: Solidity-based NFT contracts with royalty support
- **Web3 Integration**: Ethers.js for blockchain interactions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Dynamic marketplace updates
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/valentinuuiuiu/digitallegacy-nft-marketplace.git
   cd digitallegacy-nft-marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   
   # Edit the .env files with your configuration
   ```

4. **Deploy smart contracts (Local Development)**
   ```bash
   cd backend
   npx hardhat node  # Start local blockchain
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Start the application**
   ```bash
   # Start frontend (in one terminal)
   cd frontend
   npm start
   
   # The app will be available at http://localhost:3000
   ```

## 📁 Project Structure

```
digitallegacy-nft-marketplace/
├── backend/                 # Smart contracts and blockchain logic
│   ├── contracts/          # Solidity smart contracts
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Contract tests
│   └── hardhat.config.js  # Hardhat configuration
├── frontend/               # Web application
│   ├── src/               # Source code
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   ├── index.html         # Main HTML file
│   └── package.json       # Dependencies
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

#### Backend (.env)
```bash
INFURA_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Supported Networks
- **Localhost**: Development (Hardhat Network)
- **Sepolia**: Ethereum Testnet
- **Mainnet**: Ethereum Mainnet (Production)

## 🎨 Usage

### Creating an NFT
1. Connect your wallet
2. Navigate to "Create NFT"
3. Upload your file (image, video, or audio)
4. Fill in the details (name, description, category)
5. Set price and royalty percentage
6. Click "Create NFT" and confirm the transaction

### Buying an NFT
1. Browse the marketplace
2. Click on an NFT you want to purchase
3. Click "Buy Now" and confirm the transaction
4. The NFT will appear in your profile

### Managing Your Collection
1. Go to your Profile page
2. View your owned and created NFTs
3. List NFTs for sale or remove them from sale
4. Track your earnings and activity

## 🧪 Testing

### Smart Contract Tests
```bash
cd backend
npx hardhat test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Smart Contract Deployment

#### Testnet (Sepolia)
```bash
cd backend
npx hardhat run scripts/deploy.js --network sepolia
```

#### Mainnet
```bash
cd backend
npx hardhat run scripts/deploy.js --network mainnet
```

### Frontend Deployment

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

#### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Test on multiple browsers and devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://digitallegacy-nft.vercel.app](https://digitallegacy-nft.vercel.app)
- **Documentation**: [Wiki](https://github.com/yourusername/digitallegacy-nft-marketplace/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/digitallegacy-nft-marketplace/issues)

## 📞 Support

- **Email**: support@digitallegacy.com
- **Discord**: [Join our community](https://discord.gg/digitallegacy)
- **Twitter**: [@DigitalLegacyNFT](https://twitter.com/DigitalLegacyNFT)

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Ethers.js for Web3 integration
- Tailwind CSS for beautiful styling
- IPFS for decentralized storage
- Hardhat for development framework

---

**Built with ❤️ by the DigitalLegacy Team**

*Preserve your digital creations for generations to come.*
