const { scrapeTotalWine } = require('../services/totalwine.scraper');

const twWineController = async (req, res) => {
  await scrapeTotalWine(
    'https://www.totalwine.com/wine/c/c0020',
    'wine'
  );

  res.json({
    success: true,
    message: 'TotalWine Wine scraping started',
  });
};

module.exports = twWineController;
