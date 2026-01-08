const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const ExcelJS = require('exceljs');
const readline = require('readline');

puppeteer.use(StealthPlugin());

// Helper to pause the script
const waitForEnter = () => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question('🚀 Solve the Captcha in the browser, then press ENTER here to scrape...', (ans) => {
        rl.close();
        resolve(ans);
    }));
};

async function runTotalWine(baseUrl, maxPages = 24) {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreDefaultArgs: ['--enable-automation'],
        args: ['--no-sandbox', '--disable-blink-features=AutomationControlled', '--window-size=1280,1000']
    });

    const page = await browser.newPage();
    let allData = [];

    try {
        for (let i = 1; i <= maxPages; i++) {
            const separator = baseUrl.includes('?') ? '&' : '?';
            const pageUrl = i === 1 ? baseUrl : `${baseUrl}${separator}page=${i}`;
            
            console.log(`\n--- 📄 PAGE ${i} OF ${maxPages} ---`);
            await page.goto(pageUrl, { waitUntil: 'networkidle2' });

            // THE MANUAL STOP
            // If the site shows a captcha, solve it. 
            // If it doesn't, just wait for the wine to load.
            await waitForEnter(); 

            console.log("🧐 Scraping data now...");
            
            const items = await page.evaluate(() => {
                const results = [];
                document.querySelectorAll('article').forEach(el => {
                    const text = el.innerText;
                    const priceMatch = text.match(/\$\d+\.\d+/);
                    const name = el.querySelector('h2')?.innerText.trim();
                    if (name && priceMatch) {
                        results.push({
                            name: name,
                            price: parseFloat(priceMatch[0].replace('$', '')),
                            size: text.match(/\d+(ml|L|oz)/i)?.[0] || "Standard",
                            id: el.getAttribute('data-productid') || "N/A"
                        });
                    }
                });
                return results;
            });

            allData.push(...items);
            console.log(`✅ Extracted ${items.length} items. Total: ${allData.length}`);
        }

        // --- SAVE TO EXCEL ---
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Wine Data');
        worksheet.columns = [
            { header: 'ID', key: 'id' }, { header: 'Name', key: 'name' },
            { header: 'Size', key: 'size' }, { header: 'Price', key: 'price' }
        ];
        worksheet.addRows(allData);
        await workbook.xlsx.writeFile('TotalWine_Final.xlsx');
        console.log("\n📁 FILE READY: TotalWine_Final.xlsx");

    } finally {
        await browser.close();
    }
}

module.exports = { runTotalWine };