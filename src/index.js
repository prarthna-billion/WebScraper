const express = require('express');
const app = express();

const scrapeRoutes = require('./src/routes/scrape.route');
app.use('/api', scrapeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 MANUAL SCRAPER READY`);
    console.log(`🔗 Wine route: http://localhost:3000/api/total-wine?url=<WINE_URL>&pages=1`);
    console.log(`🔗 Spirit route: http://localhost:3000/api/total-spirit?url=<SPIRIT_URL>&pages=1`);
});
