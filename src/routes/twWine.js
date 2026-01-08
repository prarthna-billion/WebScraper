const express = require('express');
const router = express.Router();
const { runTotalWine } = require('../scrapers/totalwine.scraper');

router.get('/', async (req, res) => {
    res.send("Starting Total Wine WINE...");
    await runTotalWine("https://www.totalwine.com/wine/c/c0020", 225, "TW_Wine.xlsx");
});

module.exports = router;