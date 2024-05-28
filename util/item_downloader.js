
const puppeteer = require('puppeteer');

class ItemDownloader {

    async downloadImage(link) {
        const links = await this._extractLinksFromLink(link);

        return links;
    }

    async _extractLinksFromLink(link) {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link);

        const buttonSelector = 'div#download_btn';
        await page.waitForSelector(buttonSelector);
        await page.click(buttonSelector);

        const listSelector = 'div#download_list';
        await page.waitForSelector(listSelector);

        const links = await page.evaluate(() => {

            const downloadLinks = document.querySelectorAll('div#download_list a');

            return Array.from(downloadLinks).map(anchor => anchor.href);
        });

        console.log("links: ", links);

        await browser.close();

        return links;
    }

}

module.exports = ItemDownloader;