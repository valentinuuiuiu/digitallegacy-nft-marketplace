class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
    }

    start() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    async handleRoute() {
        const hash = window.location.hash.replace('#', '') || '/';
        
        // Handle redirects
        if (this.routes[hash] && this.routes[hash].redirect) {
            window.location.hash = this.routes[hash].redirect;
            return;
        }
        
        // Load component if changed
        if (this.currentRoute !== hash) {
            this.currentRoute = hash;
            await this.loadComponent(hash);
        }
    }

    async loadComponent(hash) {
        const routeConfig = this.routes[hash];
        
        if (!routeConfig) {
            console.error(`Route not found: ${hash}`);
            return;
        }

        try {
            // Show loading indicator
            const main = document.getElementById('app');
            if (main) {
                main.innerHTML = `
                    <div class="min-h-screen flex items-center justify-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                `;
            }

            // Load component template
            const response = await fetch(`/src/pages/${routeConfig.component}.html`);
            if (!response.ok) throw new Error(`Failed to load ${routeConfig.component} template`);
            
            const template = await response.text();
            
            // Insert template into main content area
            if (main) {
                main.innerHTML = template;
            }
            
            // Execute route initialization if defined
            if (routeConfig.init) {
                await routeConfig.init();
            }
        } catch (error) {
            console.error(`Error loading route ${hash}:`, error);
            this.showErrorPage();
        }
    }

    showErrorPage() {
        const main = document.getElementById('app');
        if (main) {
            main.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center p-8 bg-white rounded-lg shadow-lg">
                        <h1 class="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                        <p class="text-gray-600 mb-6">The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                        <a href="#/marketplace" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Back to Marketplace</a>
                    </div>
                </div>
            `;
        }
    }
}