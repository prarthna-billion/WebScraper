const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { specsWineController } = require('../controllers/specsWcont');

router.get('/', asyncHandler(specsWineController));

module.exports = router;
