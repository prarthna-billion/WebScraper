const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const XLSX = require("xlsx");
const path = require("path");

puppeteer.use(StealthPlugin());

// ================= CONFIG =================
const START_URL = "https://www.totalwine.com/wine/c/c0020?pageSize=10";

const OUTPUT_FILE = path.join(
  process.cwd(),
  `EXTRAWINE_DETAILS_${Date.now()}.xlsx`
);

// ================= EXCEL INIT =================
const workbook = XLSX.utils.book_new();

const worksheet = XLSX.utils.json_to_sheet([], {
  header: [
    "ProductID",
    "Name",
    "Price",
    "Size",
    "Country",
    "State",
    "Brand",
    "Wine Type",
    "Wine Style",
    "ABV",
    "Taste"
  ]
});

XLSX.utils.book_append_sheet(workbook, worksheet, "EXTRAWINE");

// 🔒 CRITICAL: Create file immediately
XLSX.writeFile(workbook, OUTPUT_FILE);
console.log("📁 Excel created:", OUTPUT_FILE);

// ================= UTILS =================
const delay = ms => new Promise(r => setTimeout(r, ms));

// ================= MAIN =================
async function runExtraWine() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox"
    ]
  });

  const listPage = await browser.newPage();
  const detailPage = await browser.newPage();

  let rowIndex = 1;
  const seenIDs = new Set();

  console.log("🚀 ExtraWine scraping started");

  await listPage.goto(START_URL, {
    waitUntil: "domcontentloaded",
    timeout: 0
  });

  // ================= LIST LOOP =================
  while (true) {
    await listPage.waitForSelector(".productCard__bcfe4485");

    const products = await listPage.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".productCard__bcfe4485")
      ).map(card => {
        const idBtn = card.querySelector("button[data-sku]");
        const nameEl = card.querySelector("h2 a");
        const priceEl = card.querySelector(".price__ff218822");
        const linkEl = card.querySelector("a");

        return {
          id: idBtn?.getAttribute("data-sku") || null,
          name: nameEl?.innerText.trim() || null,
          price: priceEl?.innerText.trim() || null,
          url: linkEl?.href || null
        };
      }).filter(p => p.id && p.url);
    });

    console.log(`📦 Products found: ${products.length}`);

    // ================= DETAILS LOOP =================
    for (const product of products) {
      if (seenIDs.has(product.id)) continue;

      console.log(`➡️ Scraping ${product.name}`);

      try {
        await detailPage.goto(product.url, {
          waitUntil: "domcontentloaded",
          timeout: 0
        });

        await detailPage.waitForSelector(
          '[data-at="product-name-title"]',
          { timeout: 15000 }
        );

        const details = await detailPage.evaluate(() => {
          const get = label => {
            const lbl = [...document.querySelectorAll("[class*='odtLabel']")]
              .find(el => el.innerText.trim() === label);
            const val = lbl?.nextElementSibling;
            return val?.innerText.trim() || "N/A";
          };

          return {
            Country: get("Country"),
            State: get("State"),
            Brand: get("Brand"),
            "Wine Type": get("Wine Type"),
            "Wine Style": get("Wine Style"),
            ABV: get("ABV"),
            Taste: get("Taste"),
            Size: get("Bottle Size")
          };
        });

        const row = {
          ProductID: product.id,
          Name: product.name,
          Price: product.price,
          Size: details.Size,
          Country: details.Country,
          State: details.State,
          Brand: details.Brand,
          "Wine Type": details["Wine Type"],
          "Wine Style": details["Wine Style"],
          ABV: details.ABV,
          Taste: details.Taste
        };

        // ================= WRITE ROW =================
        XLSX.utils.sheet_add_json(
          worksheet,
          [row],
          { skipHeader: true, origin: rowIndex }
        );

        XLSX.writeFile(workbook, OUTPUT_FILE);

        rowIndex++;
        seenIDs.add(product.id);
      } catch (err) {
        console.log("❌ Failed:", product.id);
      }

      await delay(1200);
    }

    // ================= NEXT PAGE =================
    const hasNext = await listPage.evaluate(() => {
      const btn = document.querySelector(
        'a[data-at="product-search-pagination-nextlink"]'
      );
      return btn && !btn.hasAttribute("disabled");
    });

    if (!hasNext) {
      console.log("🚫 No more pages");
      break;
    }

    await listPage.evaluate(() => {
      document
        .querySelector('a[data-at="product-search-pagination-nextlink"]')
        .click();
    });

    await delay(3000);
  }

  await browser.close();
  console.log("✅ ExtraWine scraping DONE");
}

runExtraWine();
