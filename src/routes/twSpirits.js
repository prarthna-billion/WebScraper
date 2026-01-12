const express = require("express");
const { scrapeSpirits } = require("../controllers/twScont");

const router = express.Router();

router.get("/", scrapeSpirits);

module.exports = router;
