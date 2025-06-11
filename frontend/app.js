// Web3 and Contract Configuration
let provider;
let signer;
let contract;
let userAddress;

// Contract Info
let contractAddress;
let contractABI;

// Network Configuration
const SUPPORTED_NETWORKS = {
    11155111: {
        name: 'Sepolia',
        rpcUrl: 'https://sepolia.infura.io/v3/your-infura-key',
        blockExplorer: 'https://sepolia.etherscan.io',
        contractAddress: '' // This will be updated after deployment
    },
    1337: {
        name: 'Local Network',
        rpcUrl: 'http://localhost:8545',
        blockExplorer: '',
        contractAddress: '' // This will be updated from contract-info.json
    }
};

// Initialize Web3 and Contract
async function initWeb3() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            throw new Error('Please install MetaMask to use this application.');
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Load contract info
        const response = await fetch('./contract-info.json');
        const contractInfo = await response.json();
        contractAddress = contractInfo.address;
        contractABI = contractInfo.abi;
        
        // Update contract addresses in network config
        const network = await provider.getNetwork();
        if (SUPPORTED_NETWORKS[network.chainId]) {
            SUPPORTED_NETWORKS[network.chainId].contractAddress = contractAddress;
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', handleDisconnect);

        // Update UI based on connection status
        updateConnectionUI();
        
        // Check if already connected
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            await connectWallet();
        }
    } catch (error) {
        console.error('Failed to initialize Web3:', error);
        showError(error.message);
    }
}

// Handle chain changes
async function handleChainChanged() {
    // Reload the page
    window.location.reload();
}

// Connect Wallet
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
        
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        // Get current network
        const network = await provider.getNetwork();
        const chainId = network.chainId;

        // Check if we're on a supported network
        if (!SUPPORTED_NETWORKS[chainId]) {
            const switchToSepolia = confirm('Please switch to Sepolia network. Would you like to switch now?');
            if (switchToSepolia) {
                await switchToSepoliaNetwork();
            }
            return;
        }
        
        // Initialize the contract with the correct address for the current network
        contract = new ethers.Contract(
            SUPPORTED_NETWORKS[chainId].contractAddress,
            contractABI,
            signer
        );
        
        // Update UI
        updateConnectionUI();
        await updateBalance();
        await updateNetworkInfo();
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        showError('Failed to connect wallet. Please try again.');
    }
}

// Switch to Sepolia Network
async function switchToSepoliaNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0xaa36a7', // 11155111 in hex
                        chainName: 'Sepolia Test Network',
                        nativeCurrency: {
                            name: 'Sepolia ETH',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://sepolia.infura.io/v3/your-infura-key'],
                        blockExplorerUrls: ['https://sepolia.etherscan.io']
                    }]
                });
            } catch (addError) {
                console.error('Failed to add Sepolia network:', addError);
                showError('Failed to add Sepolia network to MetaMask');
            }
        } else {
            console.error('Failed to switch to Sepolia network:', switchError);
            showError('Failed to switch network');
        }
    }
}

// Update network information in UI
async function updateNetworkInfo() {
    const network = await provider.getNetwork();
    const networkInfo = SUPPORTED_NETWORKS[network.chainId];
    
    const networkName = document.getElementById('networkName');
    const networkIndicator = document.getElementById('networkIndicator');
    
    if (networkInfo) {
        networkName.textContent = networkInfo.name;
        networkIndicator.classList.add('bg-green-500');
        networkIndicator.classList.remove('bg-red-500');
    } else {
        networkName.textContent = 'Unsupported Network';
        networkIndicator.classList.add('bg-red-500');
        networkIndicator.classList.remove('bg-green-500');
    }
}

// NFT Management Functions
const NFTManager = {
    async mintNFT(tokenURI, price, category, royaltyPercentage) {
        if (!contract) throw new Error('Contract not initialized');
        
        try {
            const tx = await contract.mintNFT(
                tokenURI,
                ethers.utils.parseEther(price.toString()),
                category,
                Math.floor(royaltyPercentage * 100), // Convert percentage to basis points
                { gasLimit: 500000 }
            );
            
            showNotification('Minting NFT... Please wait for confirmation.');
            const receipt = await tx.wait();
            
            // Get the tokenId from the event
            const event = receipt.events.find(e => e.event === 'NFTMinted');
            const tokenId = event.args.tokenId;
            
            showNotification('NFT Minted Successfully!', 'success');
            return tokenId;
        } catch (error) {
            console.error('Error minting NFT:', error);
            showError(error.message);
            throw error;
        }
    },

    async listNFTForSale(tokenId, price) {
        if (!contract) throw new Error('Contract not initialized');
        
        try {
            const tx = await contract.listForSale(
                tokenId,
                ethers.utils.parseEther(price.toString()),
                { gasLimit: 200000 }
            );
            
            showNotification('Listing NFT... Please wait for confirmation.');
            await tx.wait();
            showNotification('NFT Listed Successfully!', 'success');
        } catch (error) {
            console.error('Error listing NFT:', error);
            showError(error.message);
            throw error;
        }
    },

    async buyNFT(tokenId, price) {
        if (!contract) throw new Error('Contract not initialized');
        
        try {
            const tx = await contract.buyNFT(tokenId, {
                value: ethers.utils.parseEther(price.toString()),
                gasLimit: 300000
            });
            
            showNotification('Buying NFT... Please wait for confirmation.');
            await tx.wait();
            showNotification('NFT Purchased Successfully!', 'success');
        } catch (error) {
            console.error('Error buying NFT:', error);
            showError(error.message);
            throw error;
        }
    },

    async getNFTDetails(tokenId) {
        if (!contract) throw new Error('Contract not initialized');
        
        try {
            const nft = await contract.nftItems(tokenId);
            const uri = await contract.tokenURI(tokenId);
            
            return {
                tokenId: nft.tokenId.toString(),
                creator: nft.creator,
                owner: nft.owner,
                price: ethers.utils.formatEther(nft.price),
                forSale: nft.forSale,
                category: nft.category,
                royaltyPercentage: nft.royaltyPercentage.toString() / 100,
                createdAt: new Date(nft.createdAt.toNumber() * 1000),
                metadata: uri
            };
        } catch (error) {
            console.error('Error fetching NFT details:', error);
            throw error;
        }
    },

    async getCreatorNFTs(address) {
        if (!contract) throw new Error('Contract not initialized');
        
        try {
            const tokenIds = await contract.getCreatorTokens(address);
            const nfts = await Promise.all(
                tokenIds.map(id => this.getNFTDetails(id))
            );
            return nfts;
        } catch (error) {
            console.error('Error fetching creator NFTs:', error);
            throw error;
        }
    },

    async getAllNFTsForSale() {
        if (!contract) throw new Error('Contract not initialized');
        
        try {
            const nfts = await contract.getAllNFTsForSale();
            return nfts.map(nft => ({
                tokenId: nft.tokenId.toString(),
                creator: nft.creator,
                owner: nft.owner,
                price: ethers.utils.formatEther(nft.price),
                forSale: nft.forSale,
                category: nft.category,
                royaltyPercentage: nft.royaltyPercentage.toString() / 100,
                createdAt: new Date(nft.createdAt.toNumber() * 1000)
            }));
        } catch (error) {
            console.error('Error fetching NFTs for sale:', error);
            throw error;
        }
    }
};

// Notification system
function showNotification(message, type = 'info') {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white`;
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);
    setTimeout(() => notificationDiv.remove(), 5000);
}

// Export NFTManager for use in other files
window.NFTManager = NFTManager;

// ... rest of your existing code ...
