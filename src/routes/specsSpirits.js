const express = require('express');
const router = express.Router();
const { runSpecs } = require('../scrapers/specsonline.scraper');

router.get('/', async (req, res) => {
    res.send("<h1>Specs Online SPIRITS Started! Check Terminal.</h1>");
    await runSpecs("https://specsonline.com/product-category/spirits/", 225, "Specs_Spirits.xlsx");
});

module.exports = router;