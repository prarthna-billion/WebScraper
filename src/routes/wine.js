app.get('/api/wine', async (req, res) => {
    // The specific Wine Category URL you provided
    const targetUrl = "https://www.totalwine.com/wine/c/c0020";
    
    try {
        console.log("🍷 Starting Wine Scraper (Target: 225 pages)...");
        // We call the runner function (see Step 2)
        await runWineScraper(targetUrl, 225);
        res.json({ success: true, message: "Wine scrape complete. Check terminal." });
    } catch (error) {
        console.error("❌ Route Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});