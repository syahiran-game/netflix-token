// api/generate-token.js
const axios = require('axios');

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

// Vercel Serverless Handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Hanya benarkan POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await axios.post(
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

        const token = (response.data.data || [])[0];

        if (!token) {
            return res.status(500).json({ error: 'No token returned' });
        }

        return res.status(200).json(token);

    } catch (error) {
        return res.status(500).json({ 
            error: error.message,
            detail: error.response?.data || null
        });
    }
};
