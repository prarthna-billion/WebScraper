const express = require('express');
const { scrapeSpecsSpirits } = require('../controllers/specsScont');

const router = express.Router();

router.get('/', scrapeSpecsSpirits);

module.exports = router;
