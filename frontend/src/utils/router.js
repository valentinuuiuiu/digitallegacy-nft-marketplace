cat <<EOF > /home/shiva/deepflow/frontend/src/utils/router.js
import React from "react";
import { createRoot } from "react-dom/client";

class Router {
  constructor(routes) {
    this.routes = routes || {
      "/marketplace": React.lazy(() => import("../pages/Marketplace.jsx")),
      "/create": React.lazy(() => import("../pages/Create.jsx")),
      "/profile": React.lazy(() => import("../pages/Profile.jsx")),
    };
    this.currentRoute = null;
  }

  start() {
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash.replace("#", "") || "/marketplace";

    if (this.routes[hash] && this.routes[hash].redirect) {
      window.location.hash = this.routes[hash].redirect;
      return;
    }

    if (this.currentRoute !== hash) {
      this.currentRoute = hash;
      this.loadComponent(hash);
    }
  }

  loadComponent(hash) {
    const routeConfig = this.routes[hash];

    if (!routeConfig) {
      console.error(\`Route not found: \${hash}\`);
      this.showErrorPage();
      return;
    }

    try {
      const main = document.getElementById("app");
      if (main) {
        main.innerHTML = ""; // Clear existing content

        const container = document.createElement("div");
        container.className = "app-container";
        main.appendChild(container);

        // Render React component
        const Component = routeConfig;
        createRoot(container).render(
          <React.StrictMode>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Component />
            </React.Suspense>
          </React.StrictMode>
        );
      }
    } catch (error) {
      console.error(\`Error loading route \${hash}:\`, error);
      this.showErrorPage();
    }
  }

  showErrorPage() {
    const main = document.getElementById("app");
    if (main) {
      main.innerHTML = \`
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
            <p class="text-gray-600 mb-6">The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <a href="#/marketplace" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Back to Marketplace</a>
          </div>
        </div>
      \`;
    }
  }
}

export default Router;
EOF