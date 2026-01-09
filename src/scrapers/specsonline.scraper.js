const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const ExcelJS = require('exceljs');

puppeteer.use(StealthPlugin());

async function runSpecs(categoryUrl, maxPages, fileName) {
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--start-maximized', '--no-sandbox'] 
    });

    const page = await browser.newPage();
    let allData = [];

    try {
        console.log(`📡 Connecting to: ${categoryUrl}`);
        await page.goto(categoryUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // 1. AUTO-DETECT TOTAL PAGES
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise(r => setTimeout(r, 2000));

        const detectedPages = await page.evaluate(() => {
            const pageLinks = document.querySelectorAll('.page-numbers li');
            const numbers = Array.from(pageLinks).map(p => parseInt(p.innerText)).filter(n => !isNaN(n));
            return numbers.length > 0 ? Math.max(...numbers) : 1;
        });

        const finalPageLimit = Math.max(detectedPages, maxPages);
        console.log(`🚀 Automated Scraping started. Target: ${finalPageLimit} pages.`);

        for (let currentPage = 1; currentPage <= finalPageLimit; currentPage++) {
            const url = currentPage === 1 ? categoryUrl : `${categoryUrl}page/${currentPage}/`;
            
            if (currentPage > 1) {
                console.log(`\n🔄 Moving to Page ${currentPage}...`);
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
            }

            // 2. AUTOMATIC WAIT: Wait for products to load (Max 10 seconds)
            try {
                await page.waitForSelector('.product, li.type-product', { timeout: 10000 });
            } catch (e) {
                console.log("⚠️ Products didn't load automatically. Possible Captcha! Please solve it in the browser.");
                // If products don't load, wait 5 more seconds for you to solve captcha
                await new Promise(r => setTimeout(r, 5000)); 
            }

            // 3. AUTO-SCROLL (Now completely hands-free)
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    let distance = 400;
                    let timer = setInterval(() => {
                        let scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 150);
                });
            });

            // 4. EXTRACT DATA
            const items = await page.evaluate(() => {
                const results = [];
                const productCards = document.querySelectorAll('.product, li.type-product');
                
                productCards.forEach(el => {
                    const nameEl = el.querySelector('.woocommerce-loop-product__title') || el.querySelector('h2');
                    const priceEl = el.querySelector('.price');
                    const btn = el.querySelector('.add_to_cart_button') || el.querySelector('[data-product_id]');
                    
                    if (nameEl) {
                        const fullName = nameEl.innerText.trim();
                        const sizeRegex = /(\d+(\.\d+)?\s?(ML|L|OZ|LITRE|PACK))/i;
                        const sizeMatch = fullName.match(sizeRegex);
                        const size = sizeMatch ? sizeMatch[0] : "Standard";

                        let priceRaw = priceEl ? priceEl.innerText.trim() : 'N/A';
                        const priceMatch = priceRaw.match(/\d+\.\d+/);
                        const cleanPrice = priceMatch ? priceMatch[0] : 'N/A';

                        results.push({
                            id: btn ? btn.getAttribute('data-product_id') : 'N/A',
                            name: fullName.replace(size, '').trim(),
                            size: size,
                            price: cleanPrice
                        });
                    }
                });
                return results;
            });

            if (items.length > 0) {
                allData.push(...items);
                console.log(`✅ Page ${currentPage}: Extracted ${items.length} items. Total: ${allData.length}`);

                // 5. SAVE TO EXCEL
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('SpecsData');
                sheet.columns = [
                    { header: 'ID', key: 'id', width: 15 },
                    { header: 'Product Name', key: 'name', width: 45 },
                    { header: 'Size', key: 'size', width: 15 },
                    { header: 'Price ($)', key: 'price', width: 15 }
                ];
                sheet.addRows(allData);
                await workbook.xlsx.writeFile(fileName);
            } else {
                console.log(`🛑 Stopping: No products found on Page ${currentPage}.`);
                break; 
            }

            // 6. HUMAN-LIKE DELAY (Prevents getting blocked)
            const delay = Math.floor(Math.random() * 2000) + 1000; 
            await new Promise(r => setTimeout(r, delay));
        }
    } catch (err) {
        console.error("❌ Scraper Error:", err.message);
    } finally {
        if (browser) {
            console.log("🏁 Scraper finished. Data saved.");
            await browser.close();
        }
    }
}

module.exports = { runSpecs };