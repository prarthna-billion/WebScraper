const express = require('express');
const router = express.Router();
const { runSpecs } = require('../scrapers/specsonline.scraper');
router.get('/', async (req, res) => {
    res.send("<h1>Specs Online WINE Started! Check Terminal.</h1>");
    await runSpecs("https://specsonline.com/product-category/wine/", 225, "Specs_Wine.xlsx");
});

module.exports = router;