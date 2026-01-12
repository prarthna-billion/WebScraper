const { scrapeTotalWine } = require('../services/totalwine.scraper');

const twSpiritsController = async (req, res) => {
    res.send('<h1>TotalWine SPIRITS scraping started. Check terminal.</h1>');

    await scrapeTotalWine(
        'https://www.totalwine.com/spirits/c/c0030',
        'spirits',
        'TW_Spirits.xlsx'
    );
};

module.exports = { twSpiritsController };
