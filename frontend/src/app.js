// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Starting DigitalLegacy app initialization...');
        
        // Initialize Web3
        console.log('📡 Initializing Web3...');
        await initWeb3();
        
        // Check if classes are defined before instantiating
        console.log('🔍 Checking component classes...');
        if (typeof MarketplacePage === 'undefined') {
            throw new Error('MarketplacePage is not defined. Check script loading order.');
        }
        if (typeof CreateNFTPage === 'undefined') {
            throw new Error('CreateNFTPage is not defined. Check script loading order.');
        }
        if (typeof ProfilePage === 'undefined') {
            throw new Error('ProfilePage is not defined. Check script loading order.');
        }
        
        // Initialize pages
        console.log('📄 Initializing page components...');
        window.marketplace = new MarketplacePage();
        window.createPage = new CreateNFTPage();
        window.profile = new ProfilePage();
        
        console.log('✅ All components initialized successfully');
        
        // Initialize router with routes - using new #app container
        const routes = {
            '/': {
                title: 'DigitalLegacy - Preserve Your Digital Creations',
                component: window.marketplace
            },
            '/marketplace': {
                title: 'DigitalLegacy - Marketplace',
                component: window.marketplace
            },
            '/create': {
                title: 'DigitalLegacy - Create NFT',
                component: window.createPage
            },
            '/profile': {
                title: 'DigitalLegacy - Profile',
                component: window.profile
            },
            '/my-collection': {
                title: 'DigitalLegacy - My Collection',
                component: window.profile  // Reuse the profile component for now
            },
            '/404': {
                title: 'DigitalLegacy - Page Not Found',
                component: {
                    render: () => {
                        const appContainer = document.getElementById('app');
                        if (appContainer) {
                            appContainer.innerHTML = `
                                <div class="min-h-screen flex items-center justify-center bg-gray-50">
                                    <div class="text-center">
                                        <div class="mb-8">
                                            <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
                                            <h1 class="text-6xl font-bold gradient-text mb-4">404</h1>
                                            <p class="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
                                        </div>
                                        <div class="space-x-4">
                                            <a href="/" class="btn-primary">
                                                <i class="fas fa-home mr-2"></i>
                                                Go Home
                                            </a>
                                            <a href="/marketplace" class="btn-secondary">
                                                <i class="fas fa-store mr-2"></i>
                                                Browse Marketplace
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    }
                }
            }
        };

        // Initialize router
        console.log('🛣️  Initializing router...');
        window.router = new Router(routes);
        
        // Setup navigation click handlers
        setupNavigation();
        
        // Handle initial route
        console.log('🎯 Starting initial route...');
        window.router.handleRoute();
        
        // Connect wallet button handler
        const connectWalletBtn = document.getElementById('connectWallet');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', async () => {
                if (!userAddress) {
                    showLoadingOverlay(true);
                    try {
                        await connectWallet();
                        showSuccess('Wallet connected successfully!');
                    } catch (error) {
                        showError('Failed to connect wallet: ' + error.message);
                    } finally {
                        showLoadingOverlay(false);
                    }
                }
            });
        }
        
        // Initialize animations after everything is loaded
        setTimeout(() => {
            initializeAnimations();
        }, 100);
        
        console.log('🎉 App initialization complete!');
        
        // Hide initial loader
        const initialLoader = document.getElementById('initialLoader');
        if (initialLoader) {
            initialLoader.style.transition = 'opacity 0.5s ease';
            initialLoader.style.opacity = '0';
            setTimeout(() => {
                initialLoader.remove();
            }, 500);
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        
        // Show error page
        const container = document.getElementById('app') || document.getElementById('main') || document.body;
        container.innerHTML = `
            <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div class="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
                    <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-6"></i>
                    <h1 class="text-2xl font-bold text-white mb-4">App Failed to Load</h1>
                    <p class="text-gray-400 mb-6">${error.message}</p>
                    <div class="space-y-3">
                        <button onclick="window.location.reload()" class="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                            <i class="fas fa-redo mr-2"></i>
                            Reload Page
                        </button>
                        <button onclick="console.error('Debug info:', error)" class="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                            <i class="fas fa-bug mr-2"></i>
                            Show Debug Info
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
});

// Create compatibility layer - if pages render to #main, copy to #app
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'main' && mutation.type === 'childList') {
            const mainContainer = document.getElementById('main');
            const appContainer = document.getElementById('app');
            if (mainContainer && appContainer && mainContainer.innerHTML.trim()) {
                appContainer.innerHTML = mainContainer.innerHTML;
                // Show the main container for compatibility
                mainContainer.style.display = 'block';
                mainContainer.classList.remove('hidden');
                appContainer.style.display = 'none';
            }
        }
    });
});

const mainContainer = document.getElementById('main');
if (mainContainer) {
    observer.observe(mainContainer, { childList: true, subtree: true });
}

// Auto-enable demo mode if URL contains ?demo
if (window.location.search.includes('demo') || window.location.search.includes('sample')) {
    window.isDemoMode = true;
    console.log('Demo mode enabled via URL parameter');
}

// Setup navigation handlers
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('href').substring(1); // Remove #
            router.navigate(path || '/');
        });
    });
}

// Enhanced buy NFT function with better UI feedback
async function buyNFT(tokenId, price) {
    if (!userAddress) {
        showWarning('Please connect your wallet first');
        return;
    }
    
    try {
        showLoadingOverlay(true);
        showNotification('Preparing to buy NFT...', 'info');
        
        await NFTManager.buyNFT(tokenId, price);
        
        showSuccess(`Successfully purchased NFT #${tokenId}!`);
        
        // Refresh the current page to show updated data
        if (window.router) {
            router.handleRoute();
        }
        
    } catch (error) {
        console.error('Error buying NFT:', error);
        showError('Failed to buy NFT: ' + error.message);
    } finally {
        showLoadingOverlay(false);
    }
}

// Make buyNFT globally available
window.buyNFT = buyNFT;
