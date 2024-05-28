
const puppeteer = require('puppeteer');

class ItemDownloader {

    async downloadImage(link) {
        const links = await this._extractLinksFromLink(link);

        return links;
    }

    async _downloadFiles(links) {
        const fetch = require('node-fetch');
        const fs = require('fs');
        const path = require('path');

        const downloadFiles = async (links) => {
            const downloadPromises = links.map(async (url, index) => {
                const response = await fetch(url);
                const buffer = await response.buffer();
                const filePath = path.resolve(__dirname, `downloaded_image_${index}.jpg`);
                fs.writeFileSync(filePath, buffer);
                return filePath;
            });
            return Promise.all(downloadPromises);
        };

        const downloadedFilePaths = await downloadFiles(links);        
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