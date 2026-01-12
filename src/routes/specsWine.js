const express = require('express');
const { scrapeSpecsWine } = require('../controllers/specsWcont');

const router = express.Router();

router.get('/', scrapeSpecsWine);

module.exports = router;
