const puppeteer = require("puppeteer");
const fs = require("fs");
const XLSX = require("xlsx");

// Save Excel dynamically
function saveExcel(data, excelFile, sheetName) {
  let workbook;
  if (fs.existsSync(excelFile)) {
    workbook = XLSX.readFile(excelFile);
  } else {
    workbook = XLSX.utils.book_new();
  }

  let worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    worksheet = XLSX.utils.json_to_sheet([], {
      header: Object.keys(data[0] || {}),
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  XLSX.utils.sheet_add_json(worksheet, data, { skipHeader: true, origin: -1 });
  XLSX.writeFile(workbook, excelFile);
}

// Save JSON fully at the end
function saveJSON(data, jsonFile) {
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), "utf-8");
}

// -------------------------
// TotalWine Scraper (Tile-wise)
async function scrapeTotalWine(baseURL, type = "wine", excelFile = `TW_${type}.xlsx`) {
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
  let allProducts = [];
  let pageNum = 1;

  while (true) {
    const url = pageNum === 1 ? baseURL : `${baseURL}?page=${pageNum}&pageSize=24`;
    console.log(`[TotalWine-${type}] Page ${pageNum}: ${url}`);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    // Scroll for lazy-loading tiles
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 4000));

    try {
      await page.waitForSelector(".productCard__bcfe4485", { timeout: 60000 });
    } catch {
      console.log("No products found. Ending scraper.");
      break;
    }

    // Tile-wise scraping only
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

    allProducts.push(...pageProducts);

    // Save dynamically after each page
    saveExcel(pageProducts, excelFile, `${type} Products`);
    console.log(`✅ Page ${pageNum} scraped. Total so far: ${allProducts.length}`);

    // Pagination check
    const hasNext = await page.evaluate(() => {
      const btn = document.querySelector('[data-at="product-search-pagination-nextlink"]');
      return btn && !btn.hasAttribute("disabled");
    });

    if (!hasNext) break;
    pageNum++;
  }

  saveJSON(allProducts, `totalwine_${type}.json`);
  console.log(`🎉 Scraping done. Total products: ${allProducts.length}`);

  await browser.close();
  return allProducts;
}

// Export for routes
module.exports = { scrapeTotalWine };
