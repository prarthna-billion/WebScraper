const { runSpecs } = require('../services/specsonline.scraper');

const specsWineController = async (req, res) => {
    res.send('<h1>Specs Online WINE scraping started. Check terminal.</h1>');

    await runSpecs(
        'https://specsonline.com/product-category/wine/',
        225,
        'Specs_Wine.xlsx'
    );
};

module.exports = { specsWineController };
