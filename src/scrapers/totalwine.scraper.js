const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const ExcelJS = require('exceljs');
const readline = require('readline');

puppeteer.use(StealthPlugin());

const waitForEnter = (page) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(`\n🚀 [TW PAGE ${page}] SOLVE CAPTCHA -> PRESS ENTER TO SCRAPE...`, (ans) => {
        rl.close();
        resolve(ans);
    }));
};

async function runTotalWine(categoryUrl, maxPages, fileName) {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    let allData = [];

    try {
        for (let i = 1; i <= maxPages; i++) {
            const url = i === 1 ? categoryUrl : `${categoryUrl}?page=${i}`;
            console.log(`\n📡 Loading TotalWine Page ${i}...`);
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            await waitForEnter(i); // Manual Bypass

            const items = await page.evaluate(() => {
                const results = [];
                document.querySelectorAll('article').forEach(el => {
                    const name = el.querySelector('h2')?.innerText.trim();
                    const priceMatch = el.innerText.match(/\$\d+\.\d+/);
                    if (name && priceMatch) {
                        results.push({
                            id: el.getAttribute('data-productid') || 'N/A',
                            name: name,
                            price: priceMatch[0].replace('$', '')
                        });
                    }
                });
                return results;
            });

            allData.push(...items);
            
            // Save after every page so you don't lose data
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Data');
            sheet.addRows(allData);
            await workbook.xlsx.writeFile(fileName);
            console.log(`✅ Saved ${items.length} items to ${fileName}`);
        }
    } catch (err) {
        console.error("❌ TW Error:", err.message);
    } finally {
        await browser.close();
    }
}

module.exports = { runTotalWine };