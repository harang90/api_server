
const puppeteer = require('puppeteer');

class ItemDownloader {

    async downloadItem(link) {
        const links = await this._extractFileLinksFromLink(link);
        const paths = await this._downloadFiles(links);

        return paths;
    }
}