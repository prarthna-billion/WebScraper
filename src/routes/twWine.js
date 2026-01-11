const express = require("express");
const { scrapeTotalWine } = require("../scrapers/totalwine.scraper");
const router = express.Router();

router.get("/", async (req, res) => {
    await scrapeTotalWine("https://www.totalwine.com/wine/c/c0020", "wine");
    res.json({ success: true, message: "wine scraping completed!" });
});

module.exports = router;
