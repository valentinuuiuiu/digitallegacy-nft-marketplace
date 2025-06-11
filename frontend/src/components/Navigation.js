class Navigation {
    constructor() {
        this.currentPath = window.location.pathname;
    }

    render() {
        return `
        <nav class="fixed w-full bg-gray-900 shadow-lg z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="/" class="flex-shrink-0 flex items-center">
                            <i class="fas fa-cube text-3xl text-purple-500 mr-2"></i>
                            <span class="text-xl font-bold text-white">DigitalLegacy</span>
                        </a>
                    </div>
                    
                    <div class="hidden md:flex md:items-center md:space-x-8">
                        <a href="/marketplace" class="${this.getActiveClass('/marketplace')} px-3 py-2 text-sm font-medium">
                            Marketplace
                        </a>
                        <a href="/create" class="${this.getActiveClass('/create')} px-3 py-2 text-sm font-medium">
                            Create NFT
                        </a>
                        <a href="/my-collection" class="${this.getActiveClass('/my-collection')} px-3 py-2 text-sm font-medium">
                            My Collection
                        </a>
                        <a href="/profile" class="${this.getActiveClass('/profile')} px-3 py-2 text-sm font-medium">
                            Profile
                        </a>
                    </div>

                    <div class="flex items-center space-x-4">
                        <div id="networkInfo" class="hidden items-center px-3 py-1 bg-gray-800 rounded-md text-sm text-white">
                            <div id="networkIndicator" class="w-2 h-2 rounded-full mr-2"></div>
                            <span id="networkName"></span>
                        </div>
                        
                        <div id="balanceInfo" class="hidden items-center px-3 py-1 bg-gray-800 rounded-md text-sm text-white">
                            <i class="fas fa-wallet mr-1"></i>
                            <span id="ethBalance">0.00</span> ETH
                        </div>
                        
                        <button id="connectWallet" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200">
                            Connect Wallet
                        </button>
                        
                        <button onclick="window.sampleDataService?.setDemoUser(); window.isDemoMode = true; location.reload();" class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200">
                            <i class="fas fa-play mr-1"></i>
                            Demo Mode
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        `;
    }

    getActiveClass(path) {
        return this.currentPath === path 
            ? 'text-purple-500 hover:text-purple-400' 
            : 'text-gray-300 hover:text-white';
    }
    
    attachEventListeners() {
        // Connect wallet button
        const connectWalletBtn = document.getElementById('connectWallet');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', async () => {
                try {
                    await connectWallet();
                    connectWalletBtn.textContent = 'Connected';
                    connectWalletBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
                    connectWalletBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                    
                    // Show network info and balance
                    document.getElementById('networkInfo').classList.remove('hidden');
                    document.getElementById('networkInfo').classList.add('flex');
                    document.getElementById('balanceInfo').classList.remove('hidden');
                    document.getElementById('balanceInfo').classList.add('flex');
                } catch (error) {
                    console.error('Failed to connect wallet:', error);
                    showError('Failed to connect wallet');
                }
            });
        }
    }
}
