// Check if ethers is loaded
if (typeof ethers === 'undefined') {
    console.error('Ethers.js is not loaded! Please check the script tag in index.html');
    throw new Error('Ethers.js library is required but not loaded');
}

console.log('Ethers.js loaded successfully, version:', ethers.version);

// Web3 and Contract Configuration
let provider;
let signer;
let contract;
let userAddress;

// Contract Info
let contractAddress;
let contractABI;

// Helper Functions
function showError(message, duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast bg-red-500 text-white p-4 rounded shadow-lg mb-3';
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, duration);
}

function showNotification(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white p-4 rounded shadow-lg mb-3`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, duration);
}

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
        // Load contract info first
        try {
            const response = await fetch('/contract-info.json');
            const contractInfo = await response.json();
            contractAddress = contractInfo.address;
            contractABI = contractInfo.abi;
            console.log('Contract info loaded:', contractAddress);
        } catch (error) {
            console.warn('Failed to load contract info:', error);
            // Create empty placeholders so the UI can still load
            contractAddress = '0x0000000000000000000000000000000000000000';
            contractABI = [];
        }
        
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            console.warn('MetaMask not detected. Some features will be disabled.');
            // Still continue to load the UI, just with limited functionality
            return;
        }
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Update contract addresses in network config for local network
        SUPPORTED_NETWORKS[1337].contractAddress = contractAddress;
        
        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('disconnect', handleDisconnect);
        }

        // Update UI based on connection status
        updateConnectionUI();
        
        // Check if already connected
        try {
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.log('Not connected to wallet yet');
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

// Handle account changes
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected their wallet
        userAddress = null;
        contract = null;
        signer = null;
        updateConnectionUI();
        showNotification('Wallet disconnected');
    } else if (accounts[0] !== userAddress) {
        userAddress = accounts[0];
        signer = provider.getSigner();
        
        // Initialize the contract with the correct address for the current network
        const network = await provider.getNetwork();
        if (SUPPORTED_NETWORKS[network.chainId] && SUPPORTED_NETWORKS[network.chainId].contractAddress) {
            contract = new ethers.Contract(
                SUPPORTED_NETWORKS[network.chainId].contractAddress,
                contractABI,
                signer
            );
        }
        
        updateConnectionUI();
        await updateBalance();
        showNotification('Wallet connected: ' + userAddress.substring(0, 6) + '...' + userAddress.substring(userAddress.length - 4));
    }
}

// Handle disconnect
function handleDisconnect() {
    userAddress = null;
    contract = null;
    signer = null;
    updateConnectionUI();
    showNotification('Wallet disconnected');
}

// Update connection UI
function updateConnectionUI() {
    const networkInfo = document.getElementById('networkInfo');
    const balanceInfo = document.getElementById('balanceInfo');
    const connectWalletBtn = document.getElementById('connectWallet');
    
    if (networkInfo && balanceInfo) {
        if (userAddress) {
            networkInfo.classList.remove('hidden');
            networkInfo.classList.add('flex');
            balanceInfo.classList.remove('hidden');
            balanceInfo.classList.add('flex');
            
            if (connectWalletBtn) {
                connectWalletBtn.textContent = 'Connected';
                connectWalletBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
                connectWalletBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            }
        } else {
            networkInfo.classList.add('hidden');
            networkInfo.classList.remove('flex');
            balanceInfo.classList.add('hidden');
            balanceInfo.classList.remove('flex');
        }
    }
}

// Update user's balance
async function updateBalance() {
    if (!userAddress) return;
    
    try {
        const balance = await provider.getBalance(userAddress);
        const ethBalance = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
        
        const balanceElement = document.getElementById('ethBalance');
        if (balanceElement) {
            balanceElement.textContent = ethBalance;
        }
    } catch (error) {
        console.error('Error updating balance:', error);
    }
}

// Connect Wallet
async function connectWallet() {
    try {
        if (!window.ethereum) {
            showError('MetaMask not detected. Please install MetaMask.');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length === 0) {
            showError('No accounts found. Please connect to MetaMask.');
            return;
        }
        
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        // Get current network
        const network = await provider.getNetwork();
        const chainId = network.chainId;
        console.log('Connected to network:', chainId);

        // Check if we're on a supported network
        if (!SUPPORTED_NETWORKS[chainId]) {
            showError(`Unsupported network. Please switch to Local Network (Chain ID: 1337) or Sepolia (Chain ID: 11155111)`);
            return;
        }
        
        // Use the contract address we loaded from contract-info.json
        const contractAddr = SUPPORTED_NETWORKS[chainId].contractAddress || contractAddress;
        
        if (!contractAddr || contractAddr === '0x0000000000000000000000000000000000000000') {
            showError('Contract not deployed on this network. Please deploy the contract first.');
            return;
        }
        
        // Initialize the contract
        contract = new ethers.Contract(contractAddr, contractABI, signer);
        console.log('Contract initialized:', contractAddr);
        
        // Update UI
        updateConnectionUI();
        await updateBalance();
        await updateNetworkInfo();
        
        showNotification('Wallet connected successfully!', 'success');
        
        // Refresh marketplace if we're on the marketplace page
        if (window.marketplace && typeof window.marketplace.initialize === 'function') {
            setTimeout(() => {
                window.marketplace.initialize();
            }, 1000);
        }
    } catch (error) {
        console.error('Failed to connect wallet:', error);
        showError('Failed to connect wallet: ' + error.message);
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
    // Check if contract is ready
    isContractReady() {
        // Check if we're in demo mode
        if (window.isDemoMode) {
            return false;
        }
        return !!(contract && contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000');
    },

    // Get contract status info
    getContractStatus() {
        return {
            hasContract: !!contract,
            hasAddress: !!contractAddress,
            isValidAddress: contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
            hasProvider: !!provider,
            hasUserAddress: !!userAddress
        };
    },

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
        if (!this.isContractReady()) {
            // Handle sample data purchase
            if (window.sampleDataService && userAddress) {
                const success = window.sampleDataService.buySampleNFT(tokenId, userAddress);
                if (success) {
                    showNotification('Sample NFT "purchased" successfully! (Demo mode)', 'success');
                    return true;
                } else {
                    throw new Error('NFT not available for purchase');
                }
            }
            throw new Error('Contract not initialized and no sample data available');
        }
        
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

    async fetchNFTMetadata(tokenURI) {
        try {
            if (!tokenURI) {
                console.warn('No token URI provided');
                return null;
            }

            // Handle IPFS URIs
            let metadataUrl = tokenURI;
            if (tokenURI.startsWith('ipfs://') && window.ipfsService) {
                metadataUrl = ipfsService.getHttpUrl(tokenURI);
            }

            const response = await fetch(metadataUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch metadata: ${response.statusText}`);
            }

            const metadata = await response.json();
            
            // Validate metadata structure
            if (!metadata.name && !metadata.description) {
                console.warn('Invalid metadata structure:', metadata);
                return null;
            }

            // Convert IPFS image URLs to HTTP
            if (metadata.image && metadata.image.startsWith('ipfs://') && window.ipfsService) {
                metadata.imageUrl = ipfsService.getHttpUrl(metadata.image);
            } else {
                metadata.imageUrl = metadata.image;
            }

            return metadata;
        } catch (error) {
            console.error('Error fetching NFT metadata:', error);
            return null;
        }
    },

    async getNFTDetailsWithMetadata(tokenId) {
        try {
            const nftDetails = await this.getNFTDetails(tokenId);
            const metadata = await this.fetchNFTMetadata(nftDetails.tokenURI);
            
            return {
                ...nftDetails,
                metadata: metadata,
                name: metadata?.name || `NFT #${tokenId}`,
                description: metadata?.description || 'No description available',
                image: metadata?.imageUrl || metadata?.image || '',
                attributes: metadata?.attributes || []
            };
        } catch (error) {
            console.error('Error getting NFT details with metadata:', error);
            throw error;
        }
    },

    async getUserNFTs(address) {
        if (!this.isContractReady()) {
            console.warn('Contract not ready. Using sample data for demo.');
            // Use sample data when contract is not available
            if (window.sampleDataService) {
                return window.sampleDataService.getSampleNFTsByOwner(address);
            }
            return []; // Return empty array if no sample data
        }
        
        try {
            const tokenIds = await contract.getOwnerTokens(address);
            const nfts = await Promise.all(
                tokenIds.map(id => this.getNFTDetails(id))
            );
            return nfts;
        } catch (error) {
            console.error('Error fetching user NFTs:', error);
            // Fallback to sample data on error
            if (window.sampleDataService) {
                return window.sampleDataService.getSampleNFTsByOwner(address);
            }
            return [];
        }
    },

    async getCreatorNFTs(address) {
        if (!this.isContractReady()) {
            console.warn('Contract not ready. Using sample data for demo.');
            // Use sample data when contract is not available
            if (window.sampleDataService) {
                return window.sampleDataService.getSampleNFTsByOwner(address);
            }
            return []; // Return empty array if no sample data
        }
        
        try {
            const tokenIds = await contract.getCreatorTokens(address);
            const nfts = await Promise.all(
                tokenIds.map(id => this.getNFTDetails(id))
            );
            return nfts;
        } catch (error) {
            console.error('Error fetching creator NFTs:', error);
            // Fallback to sample data on error
            if (window.sampleDataService) {
                return window.sampleDataService.getSampleNFTsByOwner(address);
            }
            return [];
        }
    },

    async getAllNFTsForSale() {
        if (!this.isContractReady()) {
            console.warn('Contract not ready. Using sample data for demo.');
            // Use sample data when contract is not available
            if (window.sampleDataService) {
                return window.sampleDataService.getSampleNFTsForSale();
            }
            return []; // Return empty array if no sample data
        }
        
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
            // Fallback to sample data on error
            if (window.sampleDataService) {
                return window.sampleDataService.getSampleNFTsForSale();
            }
            return []; // Return empty array on error
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

// Error notification function
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-red-500 text-white';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
    console.error(message); // Also log to console
}

// Enhanced UI Functions with Beautiful Styling
function showLoadingOverlay(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        } else {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    }
}

function createToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${getToastTypeClass(type)} text-white p-4 rounded-lg shadow-lg mb-3 flex items-center`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon} mr-3"></i>
        <span>${message}</span>
        <button class="ml-auto hover:opacity-75" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);
    
    return toast;
}

function getToastTypeClass(type) {
    const types = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    return types[type] || types.info;
}

function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function createNFTCard(nft) {
    const card = document.createElement('div');
    card.className = 'nft-card cursor-pointer';
    card.onclick = () => openNFTModal(nft);
    
    const imageUrl = nft.image || 'https://via.placeholder.com/300x200?text=NFT';
    const statusClass = nft.forSale ? 'status-for-sale' : 'status-sold';
    const statusText = nft.forSale ? 'For Sale' : 'Sold';
    
    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${imageUrl}" alt="${nft.name || 'NFT'}" class="nft-image">
            <div class="absolute top-4 right-4 ${statusClass}">
                ${statusText}
            </div>
            ${nft.forSale ? `
                <div class="absolute top-4 left-4 price-display">
                    <i class="fas fa-ethereum"></i>
                    ${nft.price}
                </div>
            ` : ''}
        </div>
        <div class="p-6">
            <div class="flex items-start justify-between mb-3">
                <h3 class="text-xl font-bold text-gray-900">${nft.name || 'Untitled NFT'}</h3>
                <span class="category-badge">${nft.category || 'Art'}</span>
            </div>
            <p class="text-gray-600 mb-4 line-clamp-2">${nft.description || 'No description available'}</p>
            <div class="flex justify-between items-center">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <i class="fas fa-user text-purple-600 text-sm"></i>
                    </div>
                    <span class="text-sm text-gray-500">
                        ${nft.creator ? nft.creator.substring(0, 6) + '...' + nft.creator.substring(nft.creator.length - 4) : 'Unknown'}
                    </span>
                </div>
                ${nft.forSale ? `
                    <button class="btn-primary text-sm" onclick="event.stopPropagation(); buyNFT('${nft.tokenId}', '${nft.price}')">
                        Buy Now
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

function openNFTModal(nft) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    const imageUrl = nft.image || 'https://via.placeholder.com/400x300?text=NFT';
    
    modal.innerHTML = `
        <div class="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-2xl font-bold gradient-text">${nft.name || 'Untitled NFT'}</h2>
                    <button class="text-gray-400 hover:text-gray-600 text-2xl" onclick="this.closest('.modal-backdrop').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <img src="${imageUrl}" alt="${nft.name || 'NFT'}" class="w-full rounded-lg">
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2">Description</h3>
                            <p class="text-gray-600">${nft.description || 'No description available'}</p>
                        </div>
                        
                        <div>
                            <h3 class="font-semibold text-gray-900 mb-2">Details</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Token ID:</span>
                                    <span class="font-mono">${nft.tokenId}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Category:</span>
                                    <span class="category-badge">${nft.category || 'Art'}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Creator:</span>
                                    <span class="font-mono">${nft.creator ? nft.creator.substring(0, 10) + '...' : 'Unknown'}</span>
                                </div>
                                ${nft.royaltyPercentage ? `
                                    <div class="flex justify-between">
                                        <span class="text-gray-500">Royalty:</span>
                                        <span>${nft.royaltyPercentage}%</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${nft.forSale ? `
                            <div class="border-t pt-4">
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-lg font-semibold">Current Price</span>
                                    <div class="price-display text-lg">
                                        <i class="fas fa-ethereum"></i>
                                        ${nft.price} ETH
                                    </div>
                                </div>
                                <button class="btn-primary w-full py-3" onclick="buyNFT('${nft.tokenId}', '${nft.price}'); this.closest('.modal-backdrop').remove();">
                                    <i class="fas fa-shopping-cart mr-2"></i>
                                    Buy NFT
                                </button>
                            </div>
                        ` : `
                            <div class="border-t pt-4 text-center">
                                <span class="status-sold inline-block">Not for Sale</span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Enhanced notification functions
function showError(message, duration = 5000) {
    return createToast(message, 'error', duration);
}

function showNotification(message, type = 'info', duration = 5000) {
    return createToast(message, type, duration);
}

function showSuccess(message, duration = 5000) {
    return createToast(message, 'success', duration);
}

function showWarning(message, duration = 5000) {
    return createToast(message, 'warning', duration);
}

// Enhanced wallet connection UI
function updateConnectionUI() {
    const networkInfo = document.getElementById('networkInfo');
    const balanceInfo = document.getElementById('balanceInfo');
    const connectWalletBtn = document.getElementById('connectWallet');
    const walletConnected = document.getElementById('walletConnected');
    const walletAddress = document.getElementById('walletAddress');
    const networkIndicator = document.getElementById('networkIndicator');
    
    if (userAddress) {
        // Show connected state
        if (networkInfo) {
            networkInfo.classList.remove('hidden');
            networkInfo.classList.add('flex');
        }
        if (balanceInfo) {
            balanceInfo.classList.remove('hidden');
            balanceInfo.classList.add('flex');
        }
        if (connectWalletBtn) {
            connectWalletBtn.textContent = 'Connected';
            connectWalletBtn.classList.remove('btn-primary');
            connectWalletBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            connectWalletBtn.disabled = true;
        }
        if (walletConnected && walletAddress) {
            const shortAddress = userAddress.substring(0, 6) + '...' + userAddress.substring(userAddress.length - 4);
            walletAddress.textContent = shortAddress;
            walletConnected.classList.remove('hidden');
            walletConnected.classList.add('flex');
        }
        if (networkIndicator) {
            networkIndicator.classList.add('connected');
            networkIndicator.classList.remove('disconnected');
        }
    } else {
        // Show disconnected state
        if (networkInfo) {
            networkInfo.classList.add('hidden');
            networkInfo.classList.remove('flex');
        }
        if (balanceInfo) {
            balanceInfo.classList.add('hidden');
            balanceInfo.classList.remove('flex');
        }
        if (connectWalletBtn) {
            connectWalletBtn.textContent = 'Connect Wallet';
            connectWalletBtn.classList.add('btn-primary');
            connectWalletBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            connectWalletBtn.disabled = false;
        }
        if (walletConnected) {
            walletConnected.classList.add('hidden');
            walletConnected.classList.remove('flex');
        }
        if (networkIndicator) {
            networkIndicator.classList.add('disconnected');
            networkIndicator.classList.remove('connected');
        }
    }
}

// Initialize animations and interactions
function initializeAnimations() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card-3d, .nft-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Add CSS animation keyframes
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastSlideOut {
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addAnimationStyles();
    setTimeout(initializeAnimations, 100); // Small delay to ensure elements are rendered
});

// Make functions globally accessible
window.connectWallet = connectWallet;
window.showError = showError;
window.showNotification = showNotification;
window.showSuccess = showNotification;
window.showLoadingOverlay = showLoadingOverlay;

// Export functions and objects for use in other files
window.NFTManager = NFTManager;
window.showNotification = showNotification;
window.showError = showError;

// Export enhanced functions
window.showLoadingOverlay = showLoadingOverlay;
window.createNFTCard = createNFTCard;
window.openNFTModal = openNFTModal;
window.showSuccess = showSuccess;
window.showWarning = showWarning;

// ... rest of your existing code ...
