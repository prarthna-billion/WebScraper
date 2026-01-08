const express = require('express');
const router = express.Router();
const { runTotalWine } = require('../scrapers/totalwine.scraper');
const { saveToExcel } = require('../utils/excel.util');

router.get('/total-wine', async (req, res) => {
    const { url, pages } = req.query;
    try {
        const data = await runTotalWine(url, parseInt(pages) || 1);
        const fileName = `manual_totalwine_${Date.now()}.xlsx`;
        saveToExcel(data, fileName);

        res.json({ success: true, count: data.length, file: fileName });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;