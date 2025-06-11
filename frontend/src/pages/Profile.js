class ProfilePage {
    constructor() {
        this.userNFTs = [];
        this.createdNFTs = [];
    }

    async initialize() {
        if (!userAddress) {
            this.renderWalletConnection();
            return;
        }

        try {
            // Show loading state
            this.renderLoading();
            
            // Get NFTs owned by the user
            this.userNFTs = await this.getUserNFTs();
            
            // Get NFTs created by the user
            this.createdNFTs = await NFTManager.getCreatorNFTs(userAddress);
            
            this.render();
            this.attachEventListeners();
        } catch (error) {
            console.error('Error initializing profile:', error);
            this.renderError('Failed to load profile data. Please try again.');
        }
    }

    async getUserNFTs() {
        // Use NFTManager to get user's NFTs
        return await NFTManager.getUserNFTs(userAddress);
    }

    render() {
        const content = `
        <div class="min-h-screen bg-gray-900 pt-20 pb-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Profile Header -->
                <div class="bg-gray-800 rounded-lg p-6 mb-8">
                    <div class="flex items-center space-x-4">
                        <div class="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center">
                            <i class="fas fa-user text-3xl text-white"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-white">${this.shortenAddress(userAddress)}</h2>
                            <p class="text-gray-400">Joined ${this.formatDate(new Date())}</p>
                        </div>
                    </div>
                    
                    <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div class="bg-gray-700 rounded-lg p-4">
                            <p class="text-sm text-gray-400">NFTs Owned</p>
                            <p class="text-2xl font-bold text-white">${this.userNFTs.length}</p>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-4">
                            <p class="text-sm text-gray-400">NFTs Created</p>
                            <p class="text-2xl font-bold text-white">${this.createdNFTs.length}</p>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-4">
                            <p class="text-sm text-gray-400">Total Value</p>
                            <p class="text-2xl font-bold text-white">${this.calculateTotalValue()} ETH</p>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-4">
                            <p class="text-sm text-gray-400">Royalties Earned</p>
                            <p class="text-2xl font-bold text-white">${this.calculateRoyalties()} ETH</p>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="mb-8">
                    <div class="border-b border-gray-700">
                        <nav class="-mb-px flex space-x-8">
                            <button class="tab-button active" data-tab="owned">
                                NFTs Owned
                            </button>
                            <button class="tab-button" data-tab="created">
                                NFTs Created
                            </button>
                            <button class="tab-button" data-tab="activity">
                                Activity
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Tab Content -->
                <div id="tabContent">
                    <!-- Content will be loaded dynamically -->
                </div>
            </div>
        </div>
        `;

        document.getElementById('main').innerHTML = content;
        this.showTab('owned'); // Show owned NFTs by default
    }

    showTab(tabName) {
        const tabContent = document.getElementById('tabContent');
        
        // Update tab button styles
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('border-purple-500', 'text-purple-500');
            button.classList.add('border-transparent', 'text-gray-400');
            if (button.dataset.tab === tabName) {
                button.classList.add('border-purple-500', 'text-purple-500');
                button.classList.remove('border-transparent', 'text-gray-400');
            }
        });

        // Render tab content
        switch (tabName) {
            case 'owned':
                tabContent.innerHTML = this.renderOwnedNFTs();
                break;
            case 'created':
                tabContent.innerHTML = this.renderCreatedNFTs();
                break;
            case 'activity':
                tabContent.innerHTML = this.renderActivity();
                break;
        }
    }

    renderOwnedNFTs() {
        if (this.userNFTs.length === 0) {
            return this.renderEmptyState('You don\'t own any NFTs yet. Visit the marketplace to buy some!');
        }

        return `
        <div class="profile-nft-grid">
            ${this.userNFTs.map(nft => this.renderNFTCard(nft, true)).join('')}
        </div>
        `;
    }

    renderCreatedNFTs() {
        if (this.createdNFTs.length === 0) {
            return this.renderEmptyState('You haven\'t created any NFTs yet. <a href="/create" class="text-purple-500 hover:text-purple-400">Create your first NFT!</a>');
        }

        return `
        <div class="profile-nft-grid">
            ${this.createdNFTs.map(nft => this.renderNFTCard(nft, false)).join('')}
        </div>
        `;
    }

    renderActivity() {
        // Implementation will depend on your event tracking
        return this.renderEmptyState('No recent activity');
    }

    renderNFTCard(nft, isOwned) {
        // Get proper image URL from metadata
        const imageUrl = this.getImageUrl(nft);
        const fallbackImage = '/src/assets/images/nft-placeholder.svg';
        
        return `
        <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg profile-nft-card">
            <div class="relative pb-[75%]">
                <img 
                    src="${imageUrl}" 
                    alt="${nft.name || 'NFT'}" 
                    class="absolute h-full w-full object-cover"
                    onerror="this.src='${fallbackImage}'"
                    loading="lazy"
                >
                ${nft.forSale ? '<div class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">FOR SALE</div>' : ''}
            </div>
            
            <div class="p-4">
                <h3 class="text-lg font-semibold text-white mb-2 truncate">${nft.name || 'Untitled NFT'}</h3>
                
                <div class="flex justify-between items-center mb-4">
                    <div class="text-sm text-gray-400">
                        <span>${isOwned ? 'Creator' : 'Owner'}</span>
                        <p class="text-purple-500">${this.shortenAddress(isOwned ? nft.creator : nft.owner)}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-sm text-gray-400">Price</span>
                        <p class="text-lg font-bold text-white">${nft.price || '0'} ETH</p>
                    </div>
                </div>
                
                ${isOwned ? this.renderOwnerActions(nft) : ''}
            </div>
        </div>
        `;
    }

    getImageUrl(nft) {
        // Handle different metadata formats
        if (nft.image) {
            return nft.image.startsWith('ipfs://') ? 
                window.ipfsService.getHttpUrl(nft.image) : 
                nft.image;
        }
        
        if (nft.metadata && typeof nft.metadata === 'object' && nft.metadata.image) {
            return nft.metadata.image.startsWith('ipfs://') ? 
                window.ipfsService.getHttpUrl(nft.metadata.image) : 
                nft.metadata.image;
        }
        
        if (nft.tokenURI) {
            // This might be a metadata URL, we'd need to fetch it
            return nft.tokenURI.startsWith('ipfs://') ? 
                window.ipfsService.getHttpUrl(nft.tokenURI) : 
                nft.tokenURI;
        }
        
        return '/src/assets/images/nft-placeholder.svg';
    }

    renderOwnerActions(nft) {
        if (nft.forSale) {
            return `
            <button 
                onclick="window.profile.removeFromSale('${nft.tokenId}')"
                class="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
                Remove from Sale
            </button>
            `;
        }

        return `
        <button 
            onclick="window.profile.listForSale('${nft.tokenId}')"
            class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200"
        >
            List for Sale
        </button>
        `;
    }

    renderEmptyState(message) {
        return `
        <div class="text-center py-12">
            <i class="fas fa-box-open text-4xl text-gray-500 mb-4"></i>
            <p class="text-gray-400">${message}</p>
        </div>
        `;
    }

    async listForSale(tokenId) {
        try {
            const price = prompt('Enter price in ETH:');
            if (!price) return;

            await NFTManager.listNFTForSale(tokenId, price);
            await this.initialize(); // Refresh the page
        } catch (error) {
            console.error('Error listing NFT:', error);
            showError(error.message);
        }
    }

    async removeFromSale(tokenId) {
        try {
            await contract.removeFromSale(tokenId);
            await this.initialize(); // Refresh the page
        } catch (error) {
            console.error('Error removing from sale:', error);
            showError(error.message);
        }
    }

    attachEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked tab
                e.target.classList.add('active');
                
                // Show corresponding tab content
                const tabName = e.target.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
    }

    calculateTotalValue() {
        const ownedValue = this.userNFTs.reduce((sum, nft) => sum + parseFloat(nft.price), 0);
        return ownedValue.toFixed(3);
    }

    calculateRoyalties() {
        // Implementation will depend on your royalty tracking
        return '0.000';
    }

    shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    renderWalletConnection() {
        const content = `
        <div class="min-h-screen bg-gray-900 pt-20 pb-12 flex items-center justify-center">
            <div class="max-w-md mx-auto text-center">
                <div class="bg-gray-800 rounded-lg p-8">
                    <i class="fas fa-wallet text-6xl text-purple-500 mb-6"></i>
                    <h2 class="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                    <p class="text-gray-400 mb-6">You need to connect your wallet to view your profile and NFTs.</p>
                    <button onclick="connectWallet()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </div>
        `;
        document.getElementById('main').innerHTML = content;
    }

    renderLoading() {
        const content = `
        <div class="min-h-screen bg-gray-900 pt-20 pb-12 flex items-center justify-center">
            <div class="text-center">
                <i class="fas fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
                <p class="text-white text-lg">Loading your profile...</p>
            </div>
        </div>
        `;
        document.getElementById('main').innerHTML = content;
    }

    renderError(message) {
        const content = `
        <div class="min-h-screen bg-gray-900 pt-20 pb-12 flex items-center justify-center">
            <div class="max-w-md mx-auto text-center">
                <div class="bg-gray-800 rounded-lg p-8">
                    <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-6"></i>
                    <h2 class="text-2xl font-bold text-white mb-4">Error</h2>
                    <p class="text-gray-400 mb-6">${message}</p>
                    <button onclick="window.profile.initialize()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
        `;
        document.getElementById('main').innerHTML = content;
    }

    // Method to refresh profile when wallet connects/disconnects
    refresh() {
        this.userNFTs = [];
        this.createdNFTs = [];
        this.initialize();
    }

    // Cleanup method
    cleanup() {
        // Clean up any event listeners or timers if needed
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.removeEventListener('click', () => {});
        });
    }
}
