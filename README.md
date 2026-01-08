# WebScraper 

A Node.js–based web scraping service built using **Express.js** for 4 api routes and **Puppeteer (Stealth Mode)** to extract **wine and spirits product data** from retail websites such as **Total Wine** and **Specs**.

The application runs a local server and exposes browser-accessible routes that trigger scrapers and generate structured **Excel (.xlsx)** files.

---

## 🚀 Features

- 🧠 Puppeteer with **stealth plugin** to bypass bot detection
- 🍷 Wine & 🥃 Spirits scraping
- 🌐 Route-based scraper execution
- 📊 Automatic Excel file generation
- 🧩 Modular scrapers and routes
- 🖥 Headful mode for manual captcha handling

---

## 🧱 Tech Stack

- Node.js
- Express.js
- Puppeteer
- puppeteer-extra
- puppeteer-extra-plugin-stealth
- ExcelJS
- Nodemon

---

## 📁 Project Structure
# 🍷🍾 WebScraper — Wine & Spirits Scraper

A Node.js–based web scraping service built using **Express.js** and **Puppeteer (Stealth Mode)** to extract **wine and spirits product data** from retail websites such as **Total Wine** and **Specs**.

The application runs a local server and exposes browser-accessible routes that trigger scrapers and generate structured **Excel (.xlsx)** files.

---

## 🚀 Features

- 🧠 Puppeteer with **stealth plugin** to bypass bot detection
- 🍷 Wine & 🥃 Spirits scraping
- 🌐 Route-based scraper execution
- 📊 Automatic Excel file generation
- 🧩 Modular scrapers and routes
- 🖥 Headful mode for manual captcha handling

---

## 🧱 Tech Stack

- Node.js
- Express.js
- Puppeteer
- puppeteer-extra
- puppeteer-extra-plugin-stealth
- ExcelJS
- Nodemon

---

## 📁 Project Structure

WebScraper/
│
├── src/
│ ├── index.js # Server entry point
│ ├── routes/
│ │ ├── twWine.js # Total Wine - Wine route
│ │ ├── twSpirits.js # Total Wine - Spirits route
│ │ ├── specsWine.js # Specs - Wine route
│ │ └── specsSpirits.js # Specs - Spirits route
│
│ ├── scrapers/
│ │ ├── totalwine.scraper.js
│ │ └── specsonline.scraper.js
│
├── .gitignore
├── package.json
├── README.md


---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/prarthna-billion/WebScraper.git
cd WebScraper

## Install dependencies
npm install

or manually
npm install express puppeteer puppeteer-extra puppeteer-extra-plugin-stealth exceljs nodemon


▶️ Running the Server
npm run dev

🧪 How It Works
Start the server
Open a scraping route in the browser
Chromium launches via Puppeteer
Solve captcha manually if prompted
Data is extracted page by page
Results are saved into an Excel file

