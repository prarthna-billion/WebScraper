const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const ExcelJS = require('exceljs');
const readline = require('readline');

puppeteer.use(StealthPlugin());

const waitForEnter = () => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question('\n🚀 SOLVE CAPTCHA -> SEE SPIRITS -> PRESS ENTER HERE TO START...', (ans) => {
        rl.close();
        resolve(ans);
    }));
};

async function runSpiritsScraper() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', 
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--start-maximized'
        ]
    });

    const page = await browser.newPage();
    let allData = [];

    try {
        // We start at the Spirits category page
        const categoryUrl = "https://www.totalwine.com/spirits/c/c0030"; 

        for (let i = 1; i <= 24; i++) {
            const url = i === 1 ? categoryUrl : `${categoryUrl}?page=${i}`;
            console.log(`\n📡 Loading Page ${i} of 24...`);
            
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // On Page 1, we wait for you to prove you are human
            if (i === 1) {
                console.log("⚠️  Action Required: If you see a Captcha, solve it. If it fails, Refresh the page.");
                await waitForEnter(); 
            }

            // Scroll down to ensure all 'Lazy Loaded' prices appear
            await page.evaluate(() => window.scrollBy(0, 800));
            await new Promise(r => setTimeout(r, 3000));

            // Extract Name, ID, Size, and Price
            const items = await page.evaluate(() => {
                const results = [];
                document.querySelectorAll('article').forEach(el => {
                    const name = el.querySelector('h2')?.innerText.trim();
                    const priceMatch = el.innerText.match(/\$\d+\.\d+/);
                    
                    if (name && priceMatch) {
                        results.push({
                            id: el.getAttribute('data-productid') || 'N/A',
                            name: name,
                            size: el.innerText.match(/\d+(ml|L|oz)/i)?.[0] || 'Standard',
                            price: priceMatch[0].replace('$', '')
                        });
                    }
                });
                return results;
            });

            allData.push(...items);
            console.log(`✅ Extracted ${items.length} spirits from Page ${i}. Total so far: ${allData.length}`);
            
            // Short random pause so we don't look like a fast bot
            await new Promise(r => setTimeout(r, 2000));
        }

        // --- EXCEL GENERATION ---
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('TotalWine_Spirits');
        sheet.columns = [
            { header: 'Product ID', key: 'id', width: 15 },
            { header: 'Spirit Name', key: 'name', width: 45 },
            { header: 'Size', key: 'size', width: 15 },
            { header: 'Price ($)', key: 'price', width: 15 }
        ];

        sheet.addRows(allData);
        sheet.getRow(1).font = { bold: true };
        
        await workbook.xlsx.writeFile('TotalWine_Spirits_Catalog.xlsx');
        console.log('\n🏁 MISSION COMPLETE: File saved as TotalWine_Spirits_Catalog.xlsx');

    } catch (err) {
        console.error("⛔ Oops! Something went wrong:", err.message);
    } finally {
        await browser.close();
    }
}

runSpiritsScraper();