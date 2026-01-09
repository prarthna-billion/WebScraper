const puppeteer = require('puppeteer-core');
const ExcelJS = require('exceljs');

async function runTotalWine(categoryUrl, maxPages, fileName) {
  // CONNECT TO REAL CHROME
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  console.log('✅ Connected to real Chrome');

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const allData = [];

  for (let i = 1; i <= maxPages; i++) {
    const url = i === 1 ? categoryUrl : `${categoryUrl}?page=${i}`;
    console.log(`\n🌐 Opening Page ${i}: ${url}`);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 0
    });

    console.log(`
================================================
🛑 MANUAL STEP REQUIRED
1️⃣ Solve CAPTCHA if shown
2️⃣ Ensure product list is visible
3️⃣ DO NOT change page number
================================================
Waiting...
`);

    // 🔑 WAIT UNTIL PRODUCTS APPEAR (NO TIMEOUT)
    await page.waitForFunction(
      () =>
        document.querySelectorAll(
          'article[data-testid="product-tile"]'
        ).length > 0,
      { timeout: 0 }
    );

    console.log('✅ Products detected, scraping...');

    // HUMAN-LIKE SCROLL
    await page.evaluate(async () => {
      for (let i = 0; i < 5; i++) {
        window.scrollBy(0, 500);
        await new Promise(r => setTimeout(r, 500));
      }
    });

    const items = await page.evaluate(() => {
      const data = [];
      const tiles = document.querySelectorAll(
        'article[data-testid="product-tile"]'
      );

      tiles.forEach(tile => {
        const name = tile.querySelector('h2')?.innerText.trim();
        const id = tile.getAttribute('data-productid') || 'N/A';

        const priceMatch = tile.innerText.match(/\$\d+(\.\d+)?/);
        const sizeEl =
          tile.querySelector('[class*="size"]') ||
          tile.querySelector('[data-testid="product-size"]');

        if (name) {
          data.push({
            id,
            name,
            size: sizeEl ? sizeEl.innerText.trim() : 'N/A',
            price: priceMatch ? priceMatch[0].replace('$', '') : 'N/A'
          });
        }
      });

      return data;
    });

    console.log(`📦 Page ${i}: ${items.length} items scraped`);
    allData.push(...items);

    // SAVE TO EXCEL (REAL-TIME)
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('TotalWine');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 15 },
      { header: 'Name', key: 'name', width: 45 },
      { header: 'Size', key: 'size', width: 15 },
      { header: 'Price', key: 'price', width: 15 }
    ];

    sheet.addRows(allData);
    await workbook.xlsx.writeFile(fileName);

    console.log(`💾 Excel updated (${allData.length} total items)`);
  }

  console.log('🏁 Scraping complete. Chrome left open.');
}

module.exports = { runTotalWine };
