const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { twSpiritsController } = require('../controllers/twScont');

router.get('/', asyncHandler(twSpiritsController));

module.exports = router;
