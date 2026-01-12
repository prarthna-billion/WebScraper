const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { specsSpiritsController } = require('../controllers/specsScont');

router.get('/', asyncHandler(specsSpiritsController));

module.exports = router;
