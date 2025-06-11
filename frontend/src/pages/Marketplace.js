class MarketplacePage {
    constructor() {
        this.nfts = [];
        this.filters = {
            category: 'all',
            sortBy: 'latest',
            minPrice: '',
            maxPrice: ''
        };
    }

    async initialize() {
        try {
            // Always try to get NFTs (will use sample data if contract not ready)
            this.nfts = await NFTManager.getAllNFTsForSale();
            
            // If we have NFTs, enhance them with metadata (for real contracts)
            // Sample data already has metadata, so we can skip this step for sample data
            if (this.nfts.length > 0 && window.NFTManager && window.NFTManager.isContractReady()) {
                // Enhance NFTs with metadata for real contract data
                this.nfts = await Promise.all(
                    this.nfts.map(async (nft) => {
                        try {
                            const nftWithMetadata = await NFTManager.getNFTDetailsWithMetadata(nft.tokenId);
                            return {
                                ...nft,
                                ...nftWithMetadata,
                                // Ensure price is from the sale info
                                price: nft.price
                            };
                        } catch (error) {
                            console.warn(`Failed to load metadata for NFT ${nft.tokenId}:`, error);
                            return {
                                ...nft,
                                name: `NFT #${nft.tokenId}`,
                                description: 'Metadata unavailable',
                                image: '',
                                attributes: []
                            };
                        }
                    })
                );
            }
            
            this.render();
            this.attachEventListeners();
        } catch (error) {
            console.error('Error initializing marketplace:', error);
            this.nfts = [];
            this.render();
            this.attachEventListeners();
            showError('Failed to load NFTs. Please connect your wallet and ensure you\'re on the correct network.');
        }
    }

    showContractNotReady() {
        // Add a message about connecting wallet
        const nftGrid = document.getElementById('nftGrid');
        if (nftGrid) {
            nftGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-wallet text-4xl text-gray-500 mb-4"></i>
                    <p class="text-gray-400 mb-4">Please connect your wallet to view NFTs</p>
                    <button onclick="connectWallet()" class="btn-primary px-6 py-2">
                        Connect Wallet
                    </button>
                </div>
            `;
        }
    }

    render() {
        const appContainer = document.getElementById('app') || document.getElementById('main');
        if (!appContainer) return;
        
        const content = `
        <div class="min-h-screen bg-gray-50">
            <!-- Hero Section -->
            <section class="hero-gradient py-20 px-4 sm:px-6 lg:px-8 text-white">
                <div class="max-w-7xl mx-auto text-center">
                    <div class="floating">
                        <h1 class="text-4xl md:text-5xl font-bold mb-4">Discover Amazing NFTs</h1>
                        <p class="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">Explore, collect, and trade unique digital assets from talented creators around the world</p>
                    </div>
                    <div class="flex justify-center space-x-4 mb-8">
                        <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-6 py-3">
                            <div class="text-2xl font-bold">${this.nfts.length}</div>
                            <div class="text-sm text-purple-200">NFTs Available</div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-6 py-3">
                            <div class="text-2xl font-bold">${new Set(this.nfts.map(n => n.creator)).size}</div>
                            <div class="text-sm text-purple-200">Artists</div>
                        </div>
                        <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-6 py-3">
                            <div class="text-2xl font-bold">${this.nfts.reduce((sum, nft) => sum + parseFloat(nft.price || 0), 0).toFixed(2)}</div>
                            <div class="text-sm text-purple-200">Total Value (ETH)</div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <!-- Demo Notice -->
                ${!window.NFTManager || !window.NFTManager.isContractReady() ? `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <div class="flex items-center">
                        <i class="fas fa-info-circle text-blue-500 mr-3"></i>
                        <div>
                            <h4 class="text-sm font-medium text-blue-800">Demo Mode</h4>
                            <p class="text-sm text-blue-600">You're viewing sample NFTs. Connect your wallet to access the full marketplace.</p>
                        </div>
                        <button onclick="connectWallet()" class="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                            Connect Wallet
                        </button>
                    </div>
                </div>
                ` : ''}
                
                <!-- Filters Section -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter & Sort</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Category</label>
                            <select id="categoryFilter" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md">
                                <option value="all">All Categories</option>
                                <option value="art">Art</option>
                                <option value="music">Music</option>
                                <option value="photography">Photography</option>
                                <option value="gaming">Gaming</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Sort By</label>
                            <select id="sortFilter" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md">
                                <option value="latest">Latest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Min Price (ETH)</label>
                            <input type="number" id="minPriceFilter" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md" placeholder="0.00">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Max Price (ETH)</label>
                            <input type="number" id="maxPriceFilter" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 rounded-md" placeholder="0.00">
                        </div>
                    </div>
                </div>

                <!-- NFT Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="nftGrid">
                    ${this.renderNFTs()}
                </div>
            </div>
        </div>
        `;

        appContainer.innerHTML = content;
    }

    renderNFTs() {
        if (this.nfts.length === 0) {
            return `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-box-open text-4xl text-gray-500 mb-4"></i>
                    <p class="text-gray-400">No NFTs found</p>
                </div>
            `;
        }

        return this.nfts.map(nft => this.renderNFTCard(nft)).join('');
    }

    renderNFTCard(nft) {
        // Multiple fallback options for images
        const imageUrl = nft.image || nft.metadata || `https://via.placeholder.com/400x400/6366f1/ffffff?text=NFT+${nft.tokenId}`;
        const fallbackUrl = nft.fallbackImage || `https://via.placeholder.com/400x400/8b5cf6/ffffff?text=${encodeURIComponent(nft.name || 'NFT')}`;
        const patternClass = nft.patternClass || 'nft-pattern-1';
        
        return `
        <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-3d">
            <div class="relative pb-2/3 ${patternClass}">
                <img src="${imageUrl}" 
                     alt="${nft.name || 'NFT'}" 
                     class="absolute h-full w-full object-cover z-10" 
                     onerror="this.src='${fallbackUrl}'; this.onerror=function(){this.style.display='none';};"
                     onload="this.style.display='block';">
                <div class="absolute inset-0 flex items-center justify-center text-white font-bold text-lg z-5">
                    <div class="text-center">
                        <i class="fas fa-gem text-4xl mb-2 opacity-75"></i>
                        <div class="text-xl">${nft.name}</div>
                        <div class="text-sm opacity-75">NFT #${nft.tokenId}</div>
                    </div>
                </div>
                <div class="absolute top-3 right-3 z-20">
                    <span class="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        ${nft.price} ETH
                    </span>
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 truncate">${nft.name || `NFT #${nft.tokenId}`}</h3>
                        <p class="text-sm text-gray-600">by ${this.shortenAddress(nft.creator || nft.owner)}</p>
                    </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${nft.description || 'No description available'}</p>
                
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-2xl font-bold text-gray-900">${nft.price} ETH</p>
                        <p class="text-sm text-gray-500">≈ $${(parseFloat(nft.price) * 2000).toFixed(2)} USD</p>
                    </div>
                    <button 
                        class="btn-primary px-6 py-2"
                        onclick="window.marketplace.buyNFT('${nft.tokenId}')"
                        ${!userAddress ? 'disabled title="Connect wallet to buy"' : ''}
                    >
                        ${!userAddress ? 'Connect Wallet' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    attachEventListeners() {
        // Filter event listeners
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        const minPriceFilter = document.getElementById('minPriceFilter');
        const maxPriceFilter = document.getElementById('maxPriceFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.applyFilters());
        }
        if (minPriceFilter) {
            minPriceFilter.addEventListener('input', () => this.applyFilters());
        }
        if (maxPriceFilter) {
            maxPriceFilter.addEventListener('input', () => this.applyFilters());
        }
    }

    applyFilters() {
        // Get filter values
        this.filters.category = document.getElementById('categoryFilter')?.value || 'all';
        this.filters.sortBy = document.getElementById('sortFilter')?.value || 'latest';
        this.filters.minPrice = document.getElementById('minPriceFilter')?.value || '';
        this.filters.maxPrice = document.getElementById('maxPriceFilter')?.value || '';

        // Apply filters
        let filteredNFTs = [...this.nfts];

        // Price filters
        if (this.filters.minPrice) {
            filteredNFTs = filteredNFTs.filter(nft => parseFloat(nft.price) >= parseFloat(this.filters.minPrice));
        }
        if (this.filters.maxPrice) {
            filteredNFTs = filteredNFTs.filter(nft => parseFloat(nft.price) <= parseFloat(this.filters.maxPrice));
        }

        // Sort
        switch (this.filters.sortBy) {
            case 'price-low':
                filteredNFTs.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-high':
                filteredNFTs.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'oldest':
                filteredNFTs.sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId));
                break;
            case 'latest':
            default:
                filteredNFTs.sort((a, b) => parseInt(b.tokenId) - parseInt(a.tokenId));
                break;
        }

        // Update display
        const nftGrid = document.getElementById('nftGrid');
        if (nftGrid) {
            if (filteredNFTs.length === 0) {
                nftGrid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-filter text-4xl text-gray-500 mb-4"></i>
                        <p class="text-gray-400">No NFTs match your filters</p>
                    </div>
                `;
            } else {
                nftGrid.innerHTML = filteredNFTs.map(nft => this.renderNFTCard(nft)).join('');
            }
        }
    }

    async buyNFT(tokenId) {
        if (!userAddress) {
            showError('Please connect your wallet first');
            return;
        }

        const nft = this.nfts.find(n => n.tokenId === tokenId);
        if (!nft) {
            showError('NFT not found');
            return;
        }

        try {
            showLoadingOverlay(true, 'Processing purchase...');
            await NFTManager.buyNFT(tokenId, nft.price);
            showSuccess('NFT purchased successfully!');
            await this.initialize(); // Refresh the marketplace
        } catch (error) {
            console.error('Error buying NFT:', error);
            showError('Failed to buy NFT: ' + error.message);
        } finally {
            showLoadingOverlay(false);
        }
    }

    shortenAddress(address) {
        if (!address) return 'Unknown';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
}
