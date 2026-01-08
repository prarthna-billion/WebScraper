const express = require('express');
const router = express.Router();
const { runTotalWine } = require('../scrapers/totalwine.scraper');

router.get('/', async (req, res) => {
    res.send("<h1>Total Wine SPIRITS Started! Check Terminal.</h1>");
    await runTotalWine("https://www.totalwine.com/spirits/c/c0030", 225, "TW_Spirits.xlsx");
});

module.exports = router;