const express = require('express');
const app = express();
const scrapeRoutes = require('./src/routes/scrape.route');

app.use('/api', scrapeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 MANUAL SCRAPER READY`);
    console.log(`🔗 Click here: http://localhost:3000/api/total-wine?url=https://www.totalwine.com/wine/c/c0020&pages=1`);
});