const express = require("express");
const { scrapeWine } = require("../controllers/twWcont");

const router = express.Router();

router.get("/", scrapeWine);

module.exports = router;
