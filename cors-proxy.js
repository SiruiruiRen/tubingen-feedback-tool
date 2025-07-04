// Simple local CORS proxy for development
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, './')));

// Proxy middleware options
const options = {
  target: 'https://api.openai.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/openai': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add the API key to the request header
    if (OPENAI_API_KEY) {
      proxyReq.setHeader('Authorization', `Bearer ${OPENAI_API_KEY}`);
    }
  },
  logLevel: 'debug',
};

// Create the proxy middleware
const apiProxy = createProxyMiddleware('/api/openai', options);

// Use the proxy middleware
app.use('/api/openai', apiProxy);

// Main route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all other routes (for SPA) - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`CORS proxy server running at http://localhost:${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}/index.html`);
});
