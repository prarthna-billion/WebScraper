const express = require("express");
const { scrapeTotalWine } = require("../scrapers/totalwine.scraper");
const router = express.Router();

router.get("/tw-spirits", async (req, res) => {
    await scrapeTotalWine("https://www.totalwine.com/spirits/c/c0030", "spirits");
    res.json({ success: true, message: "Spirits scraping completed!" });
});

module.exports = router;
