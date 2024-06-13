
const puppeteer = require('puppeteer');

class ItemDownloader {

    async downloadImage(link) {
        const links = await this._extractFileLinksFromLink(link);
        const paths = await this._downloadFiles(links);

        return paths;
    }

    async _extractFileLinksFromLink(link) {

        const browser = await puppeteer.launch({
            headless: true
        });
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

    async _downloadFiles(links) {
        const axios = require('axios');
        const fs = require('fs');
        const path = require('path');

        // const _downloadFilesFromLinks = async (links) => {
        //     const downloadPromises = links.map(async (url, index) => {
        //         const response = await axios({
        //             url,
        //             method: 'GET',
        //             responseType: 'arraybuffer'
        //         });
        //         const urlPath = new URL(url).pathname;
        //         const fileName = path.basename(urlPath);
        //         const filePath = path.resolve(__dirname, '../uploads/', fileName);
        //         fs.writeFileSync(filePath, response.data);
        //         return fileName;
        //     });
        //     return Promise.all(downloadPromises);
        // };

        const _extractFileNamesFromLinks = async (links) => {
            const fileNames = links.map(async (url, index) => {
                const urlPath = new URL(url).pathname;
                const fileName = path.basename(urlPath);
                return fileName;
            });
            return fileNames;
        };

        const fileNames = await _extractFileNamesFromLinks(links);        
        return fileNames;
    }
}

module.exports = ItemDownloader;