// Initialize application after DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Document content loaded, initializing application');
    await initApp();
});

// Main application initialization
async function initApp() {
    try {
        // Check if already initialized
        if (window.appInitialized) {
            console.warn('Application already initialized');
            return;
        }
        
        // Mark as initialized
        window.appInitialized = true;
        
        // Ensure all required components are defined
        if (typeof Router === 'undefined') {
            throw new Error('Router not found. Check script loading order.');
        }
        
        if (typeof MarketplacePage === 'undefined' || 
            typeof CreatePage === 'undefined' || 
            typeof ProfilePage === 'undefined') {
            throw new Error('Required page components not found. Check script loading order.');
        }
        
        // Initialize router with routes
        window.router = new Router({
            '/marketplace': {
                component: 'Marketplace',
                init: async () => {
                    if (typeof MarketplacePage === 'undefined') {
                        throw new Error('MarketplacePage not defined. Check script loading order.');
                    }
                    window.marketplace = new MarketplacePage();
                    await window.marketplace.initialize();
                }
            },
            '/create': {
                component: 'Create',
                init: async () => {
                    if (typeof CreatePage === 'undefined') {
                        throw new Error('CreatePage not defined. Check script loading order.');
                    }
                    window.createPage = new CreatePage();
                    window.createPage.initialize();
                }
            },
            '/profile': {
                component: 'Profile',
                init: async () => {
                    if (typeof ProfilePage === 'undefined') {
                        throw new Error('ProfilePage not defined. Check script loading order.');
                    }
                    window.profilePage = new ProfilePage();
                    await window.profilePage.initialize();
                }
            },
            '/': {
                redirect: '/marketplace'
            }
        });
        
        // Start routing
        window.router.start();
        
        // Set up global event listeners
        setupEventListeners();
        
        // Initialize page if loaded directly
        if (window.location.hash) {
            setTimeout(() => {
                const fakeEvent = { target: { hash: window.location.hash } };
                handleNavClick(fakeEvent);
            }, 100);
        }
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorUI();
    }
}

// Set up global event listeners
function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
        link.removeEventListener('click', handleNavClick);
        link.addEventListener('click', handleNavClick);
    });
    
    // Wallet events
    setupWalletEvents();
    
    // Offline/Online events
    setupNetworkEvents();
}

// Handle navigation clicks with debounce
function handleNavClick(e) {
    try {
        e.preventDefault();
        
        // Get the hash from the clicked element's href
        const hash = e.target.hash || (e.target.closest('a') ? e.target.closest('a').hash : null);
        
        if (!hash) {
            console.warn('No hash found in navigation click');
            return;
        }
        
        // Debounce navigation
        if (window.lastNavClick && Date.now() - window.lastNavClick < 500) {
            console.log('Debounced navigation');
            return;
        }
        
        window.lastNavClick = Date.now();
        
        // Update active navigation
        document.querySelectorAll('[data-nav]').forEach(link => {
            link.classList.remove('text-purple-600');
            link.classList.add('text-gray-700');
        });
        
        const currentLink = document.querySelector(`[data-nav='${hash.substring(1)}']`);
        if (currentLink) {
            currentLink.classList.add('text-purple-600');
            currentLink.classList.remove('text-gray-700');
        }
        
        // Navigate
        window.router.goto(hash);
    } catch (error) {
        console.error('Navigation error:', error);
        showError('Navigation failed. Please try again.');
    }
}

// Setup wallet connection events
function setupWalletEvents() {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const connectButton = document.getElementById('connectWallet');
            if (connectButton) {
                connectButton.removeEventListener('click', connectWallet);
                connectButton.addEventListener('click', connectWallet);
            }
        });
    } else {
        const connectButton = document.getElementById('connectWallet');
        if (connectButton) {
            connectButton.removeEventListener('click', connectWallet);
            connectButton.addEventListener('click', connectWallet);
        }
    }
    
    // Handle wallet disconnection
    if (window.ethersProvider) {
        window.ethersProvider.on('disconnect', () => {
            console.log('Wallet disconnected');
            updateWalletUI();
        });
    }
}

// Handle network connectivity changes
function setupNetworkEvents() {
    window.addEventListener('online', () => {
        console.log('Network connection restored');
        showNotification('Connected to the internet', 'success');
        updateWalletUI();
    });
    
    window.addEventListener('offline', () => {
        console.log('Network connection lost');
        showNotification('You are offline', 'error');
        updateWalletUI();
    });
}

// Error UI for critical errors
function showErrorUI(message = 'Failed to load application. Please reload the page.') {
    const main = document.getElementById('app') || document.createElement('div');
    main.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center p-4">
            <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                <div class="text-red-500 text-4xl mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-4">Application Error</h1>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="location.reload()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                    Reload Page
                </button>
                <div class="mt-6 text-sm text-gray-500">
                    <p>Code: APP_INIT_FAILED</p>
                    <p>Technical Details:</p>
                    <pre class="mt-2 text-left overflow-auto max-h-40 text-xs bg-gray-50 p-2 rounded">${new Error().stack}</pre>
                </div>
            </div>
        </div>
    `;
    
    // Replace app content if needed
    if (!document.getElementById('app')) {
        document.body.appendChild(main);
    }
}