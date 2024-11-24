const puppeteer = require('puppeteer');
const url = 'https://prezenta.roaep.ro/prezidentiale24112024/pv/romania/results/';
async function getResults() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const results = {};
    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('div.candidate-color-square', { timeout: 10000 });
        const candidates = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div.candidate-color-square + span'))
                .map(element => element.textContent.trim());
        });
        const votes = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('td:has(div.flex-center-vertical) ~ td:nth-of-type(3) div.text-right'))
                .map(element => parseFloat(element.textContent.replace(',', '.').replace('%', '').trim()));
        });
        let i = 0;
        while (i < candidates.length && i < votes.length) {
            results[candidates[i]] = votes[i];
            i++;
        }
    } catch (error) {
        console.error('Error while scraping:', error.message);
    } finally {
        await browser.close();
    }
    return results;
};
module.exports = getResults;