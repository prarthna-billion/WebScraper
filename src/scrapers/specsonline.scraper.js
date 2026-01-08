const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const ExcelJS = require('exceljs');
const readline = require('readline');

puppeteer.use(StealthPlugin());

const waitForEnter = (page) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(`\n🚀 [SPECS PAGE ${page}] PRESS ENTER WHEN LOADED...`, (ans) => {
        rl.close();
        resolve(ans);
    }));
};

async function runSpecs(categoryUrl, maxPages, fileName) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let allData = [];

    try {
        for (let i = 1; i <= maxPages; i++) {
            // Specs pagination uses /page/2/
            const url = i === 1 ? categoryUrl : `${categoryUrl}page/${i}/`;
            console.log(`\n📡 Loading Specs Page ${i}...`);
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            await waitForEnter(i);

            const items = await page.evaluate(() => {
                const results = [];
                // Specs specific selectors
                document.querySelectorAll('.product-inner').forEach(el => {
                    const name = el.querySelector('.woocommerce-loop-product__title')?.innerText.trim();
                    const price = el.querySelector('.price')?.innerText.replace(/[^\d.]/g, '');
                    if (name) {
                        results.push({ name, price: price || 'N/A' });
                    }
                });
                return results;
            });

            allData.push(...items);
            
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('SpecsData');
            sheet.addRows(allData);
            await workbook.xlsx.writeFile(fileName);
            console.log(`✅ Saved ${items.length} items to ${fileName}`);
        }
    } catch (err) {
        console.error("❌ Specs Error:", err.message);
    } finally {
        await browser.close();
    }
}

module.exports = { runSpecs };