const express = require('express');
const { runTotalWine } = require('./scraper'); // Look for scraper.js
const app = express();

app.get('/api/total-wine', async (req, res) => {
    const targetUrl = "https://www.totalwine.com/spirits/c/c0030";
    try {
        console.log("🚀 Starting 225-page run...");
        await runTotalWine(targetUrl, 225);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));