// src/scrapers/totalwine.scraper.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const { saveExcel } = require("../utils/excel.util");

// Helper: save JSON + Excel
function saveData(data, jsonFile, excelFile, sheetName) {
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), "utf-8");
  return saveExcel(data, excelFile, sheetName);
}

// -------------------------
// TotalWine Wine Scraper
// -------------------------
async function runTotalWine(baseURL, type = "wine", excelFile = "TW_Wine.xlsx") {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();
  let products = [];
  let pageNum = 1;

  while (true) {
    const url =
      pageNum === 1
        ? baseURL
        : `${baseURL}?page=${pageNum}&pageSize=24`;

    console.log(`[TotalWine-${type}] Scraping page ${pageNum}...`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    // Scroll to bottom for lazy-loaded products
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((resolve) => setTimeout(resolve, 4000));

    try {
      await page.waitForSelector(".productCard__bcfe4485", { timeout: 60000 });
    } catch {
      console.log("No products found on this page. Stopping...");
      break;
    }

    // Scrape product info
    const pageProducts = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".productCard__bcfe4485")).map((p) => ({
        name: p.querySelector("h2 a")?.innerText.trim() || null,
        size: p.querySelector("h2 span")?.innerText.trim() || null,
        price: p.querySelector(".price__ff218822")?.innerText.trim() || null,
        sku: p.querySelector("button[data-sku]")?.getAttribute("data-sku") || null,
        link: p.querySelector("h2 a")?.href || null,
      }))
    );

    if (pageProducts.length === 0) break;
    products.push(...pageProducts);

    // Check if next page exists
    const hasNext = await page.evaluate(() => {
      const nextBtn = document.querySelector(
        '[data-at="product-search-pagination-nextlink"]'
      );
      return nextBtn && nextBtn.hasAttribute("href");
    });

    if (!hasNext) break;

    pageNum++;
  }

  console.log(`📦 TOTAL PRODUCTS: ${products.length}`);

  if (products.length > 0) {
    saveData(products, `totalwine_${type}.json`, excelFile, `${type} Products`);
    console.log(`✅ Data saved: totalwine_${type}.json & ${excelFile}`);
  } else {
    console.log("🚨 Nothing scraped. No files saved.");
  }

  await browser.close();
  return products;
}

// -------------------------
// TotalWine Spirits Scraper
// -------------------------
async function runTotalSpirits(baseURL, type = "spirits", excelFile = "TW_Spirits.xlsx") {
  return runTotalWine(baseURL, type, excelFile); // same logic as Wine
}

// Export functions for routes
module.exports = { runTotalWine, runTotalSpirits };
