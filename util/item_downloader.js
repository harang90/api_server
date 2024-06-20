
const puppeteer = require('puppeteer');

class ItemDownloader {
    constructor() {
        this.browser = null;
    }

    async initBrowser(link) {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true
            });
        }
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async downloadItem(link) {
        await this.initBrowser(link);

        const page = await this.browser.newPage();
        await page.goto(link);

        const comments = await this._downloadComments(page);
        const links = await this._extractFileLinksFromLink(page);
        const paths = await this._downloadFiles(links);

        await page.close();
        await this.closeBrowser();

        return { paths: paths, comments: comments }
    }

    async _downloadComments(page) {

    }

    async _extractFileLinksFromLink(page) {
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

        return links;
    }

    async _downloadFiles(links) {
        const axios = require('axios');
        const fs = require('fs');
        const path = require('path');

        const _downloadFilesFromLinks = async (links) => {
            const downloadPromises = links.map(async (url, index) => {
                const response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'arraybuffer'
                });
                const urlPath = new URL(url).pathname;
                const fileName = path.basename(urlPath);
                const filePath = path.resolve(__dirname, '../uploads/', fileName);
                fs.writeFileSync(filePath, response.data);
                return fileName;
            });
            return Promise.all(downloadPromises);
        };

        const downloadedFileNames = await _downloadFilesFromLinks(links);        
        return downloadedFileNames;
    }
}

module.exports = ItemDownloader;
