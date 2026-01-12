const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const twWineController = require('../controllers/twWcont');

router.get('/', asyncHandler(twWineController));

module.exports = router;
