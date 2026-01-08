const express = require('express');
const app = express();

// 1. IMPORT THE 4 SEPARATE ROUTE FILES
// Ensure these filenames match exactly what is in your src/routes folder
const twWineRoute = require('./routes/twWine');
const twSpiritsRoute = require('./routes/twSpirits');
const specsWineRoute = require('./routes/specsWine');
const specsSpiritsRoute = require('./routes/specsSpirits');

// 2. MIDDLEWARE (Optional but good practice)
app.use(express.json());

// 3. REGISTER THE ROUTES
// This defines the "Entrance" for each scraper
app.use('/scrape/tw-wine', twWineRoute);
app.use('/scrape/tw-spirits', twSpiritsRoute);
app.use('/scrape/specs-wine', specsWineRoute);
app.use('/scrape/specs-spirits', specsSpiritsRoute);

// 4. HOME ROUTE (So you see something at http://localhost:3000)
app.get('/', (req, res) => {
    res.send(`
        <h1>🍷 Scraper Control Panel</h1>
        <ul>
            <li><a href="/scrape/tw-wine">Total Wine: Wine Section</a></li>
            <li><a href="/scrape/tw-spirits">Total Wine: Spirits Section</a></li>
            <li><a href="/scrape/specs-wine">Specs Online: Wine Section</a></li>
            <li><a href="/scrape/specs-spirits">Specs Online: Spirits Section</a></li>
        </ul>
        <p>Check your Terminal after clicking a link!</p>
    `);
});

// 5. START THE SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n================================================`);
    console.log(`🚀 SERVER IS LIVE: http://localhost:${PORT}`);
    console.log(`================================================`);
    console.log(`🍷 TOTAL WINE WINE:    http://localhost:${PORT}/scrape/tw-wine`);
    console.log(`🥃 TOTAL WINE SPIRITS: http://localhost:${PORT}/scrape/tw-spirits`);
    console.log(`🥂 SPECS WINE:         http://localhost:${PORT}/scrape/specs-wine`);
    console.log(`🍸 SPECS SPIRITS:      http://localhost:${PORT}/scrape/specs-spirits`);
    console.log(`================================================\n`);
});