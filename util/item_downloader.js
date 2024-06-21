
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

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
        await page.goto(link, { waitUntil: 'networkidle0' });


        const comments = await this._downloadComments(page);
        const links = await this._extractFileLinksFromLink(page);
        const paths = await this._downloadFiles(links);

        await page.close();
        await this.closeBrowser();

        return { paths: paths, comments: comments }
    }

    async _downloadComments(page) {
        const content = await page.content();
        return this._parseComments(content);
    }

    async _parseComments(content) {
        const $ = cheerio.load(content);
        const comments = [];

        $('.cmt.r0').each((index, element) => {
            const $element = $(element);
            const id = $element.attr('w_idx');
            const text = $element.find('.content').text().trim();
            const author = $element.find('.nick').text().trim();
            const likes = parseInt($element.find('.up u').text().trim()) || 0;
            const parentId = $element.hasClass('r1') ? $element.prevAll('.cmt.r0:first').attr('w_idx') : null;

            comments.push({
                id,
                text,
                author,
                likes,
                parentId
            });
        });

        $('.cmt.r1').each((index, element) => {
            const $element = $(element);
            const id = $element.attr('w_idx');
            const text = $element.find('.content').text().trim();
            const author = $element.find('.nick').text().trim();
            const likes = parseInt($element.find('.up u').text().trim()) || 0;
            const parentId = $element.hasClass('r2') ? $element.prevAll('.cmt.r1:first').attr('w_idx') : null;

            comments.push({
                id,
                text,
                author,
                likes,
                parentId
            });
        });

        $('.cmt.r2').each((index, element) => {
            const $element = $(element);
            const id = $element.attr('w_idx');
            const text = $element.find('.content').text().trim();
            const author = $element.find('.nick').text().trim();
            const likes = parseInt($element.find('.up u').text().trim()) || 0;
            const parentId = $element.hasClass('r3') ? $element.prevAll('.cmt.r2:first').attr('w_idx') : null;

            comments.push({
                id,
                text,
                author,
                likes,
                parentId
            });
        });

        $('.cmt.r3').each((index, element) => {
            const $element = $(element);
            const id = $element.attr('w_idx');
            const text = $element.find('.content').text().trim();
            const author = $element.find('.nick').text().trim();
            const likes = parseInt($element.find('.up u').text().trim()) || 0;
            const parentId = $element.hasClass('r4') ? $element.prevAll('.cmt.r3:first').attr('w_idx') : null;

            comments.push({
                id,
                text,
                author,
                likes,
                parentId
            });
        });

        return comments;
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
