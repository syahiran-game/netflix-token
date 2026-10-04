// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Untuk serve fail HTML/CSS/JS

// --- KOD ASAL ANDA (Diubah suai untuk API) ---
const CONFIG = Object.freeze({
    baseUrl: 'https://token-netflix.vercel.app',
    endpoint: '/api/generate',
    timeout: 60000,
    userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0',
        'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    ]
});

const randomUA = () => CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];

// Fungsi untuk generate token (dipanggil oleh API)
async function generateTokenAPI() {
    try {
        const res = await axios.post(
            `${CONFIG.baseUrl}${CONFIG.endpoint}`,
            { count: 1, stream: false },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': randomUA(),
                    Accept: 'application/json',
                    Origin: CONFIG.baseUrl,
                    Referer: CONFIG.baseUrl + '/'
                },
                timeout: CONFIG.timeout
            }
        );
        return (res.data.data || [])[0]; // Return token object
    } catch (e) {
        throw new Error(e.message);
    }
}

// API Endpoint untuk frontend panggil
app.post('/api/generate-token', async (req, res) => {
    try {
        const tokenData = await generateTokenAPI();
        if (!tokenData) {
            return res.status(500).json({ error: 'No token returned' });
        }
        res.json(tokenData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});