class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentPage = null;
        
        // Use hash-based routing for compatibility
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]') || e.target.matches('a[href^="/"]')) {
                e.preventDefault();
                let href = e.target.getAttribute('href');
                if (href.startsWith('/')) {
                    href = '#' + href;
                }
                this.navigate(href);
            }
        });
    }

    async handleRoute() {
        let path = window.location.hash.slice(1) || '/';
        
        // Handle empty hash or just #
        if (!path || path === '') {
            path = '/';
        }
        
        const route = this.routes[path] || this.routes['/404'];
        
        if (!route) {
            console.error('No route found for path:', path);
            return;
        }
        
        // Clean up current page if needed
        if (this.currentPage && this.currentPage.cleanup) {
            this.currentPage.cleanup();
        }
        
        // Initialize new page
        this.currentPage = route.component;
        document.title = route.title;
        
        try {
            // Render page - check both containers for compatibility
            const appContainer = document.getElementById('app');
            const mainContainer = document.getElementById('main');
            
            if (this.currentPage.render) {
                this.currentPage.render();
            }
            
            // Initialize page if needed
            if (this.currentPage.initialize) {
                await this.currentPage.initialize();
            }
        } catch (error) {
            console.error('Error rendering route:', error);
            this.showError('Failed to load page');
        }
    }

    navigate(path) {
        if (!path.startsWith('#')) {
            path = '#' + path;
        }
        window.location.hash = path;
    }
    
    showError(message) {
        const container = document.getElementById('app') || document.getElementById('main');
        if (container) {
            container.innerHTML = `
                <div class="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                        <h2 class="text-2xl font-bold text-white mb-2">Error</h2>
                        <p class="text-gray-400">${message}</p>
                        <button onclick="window.location.reload()" class="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
                            Reload Page
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Note: Routes are defined in app.js when instantiating the Router
// The router will be initialized in app.js
