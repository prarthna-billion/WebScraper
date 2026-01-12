const { runSpecs } = require('../services/specsonline.scraper');

const specsSpiritsController = async (req, res) => {
    res.send('<h1>Specs Online SPIRITS scraping started. Check terminal.</h1>');

    await runSpecs(
        'https://specsonline.com/product-category/spirits/',
        225,
        'Specs_Spirits.xlsx'
    );
};

module.exports = { specsSpiritsController };
