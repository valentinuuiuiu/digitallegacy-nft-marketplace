const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Try ports 3000, 3001, 3002 in sequence if previous ones are in use
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.ethers.io https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://cdn.tailwindcss.com; " +
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.tailwindcss.com; " +
        "font-src 'self' https://cdnjs.cloudflare.com; " +
        "img-src 'self' data: https: http:; " +
        "connect-src 'self' http://localhost:8545 https://sepolia.infura.io https://openrouter.ai ws://localhost:8545 wss://sepolia.infura.io; " +
        "default-src 'self';"
    );
    next();
});

// Serve static files
app.use(express.static(__dirname));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server with fallback ports
const startServer = (port) => {
  const server = app.listen(port).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.on('listening', () => {
    const actualPort = server.address().port;
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   DigitalLegacy NFT Marketplace Server                     ║
║                                                            ║
║   Server is running on port ${actualPort}                   ║
║   Local:   http://localhost:${actualPort}                   ║
║                                                            ║
║   Press Ctrl + C to stop the server                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
  });
};

startServer(PORT);
