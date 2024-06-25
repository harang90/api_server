const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class ItemDownloader {
    constructor() {
        this.browser = null;
    }

    async initBrowser(link) {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: false
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
        await page.waitForSelector('div#comment.icomment');
        await page.evaluate(() => {
            if (!!document.querySelector('div.moretext')) {
                document.querySelector('div.moretext').click();
            }
        });
        await page.evaluate(() => {
            if (!!document.querySelector('div.cmt_memo p')) {
                document.querySelector('div.cmt_memo p').click();
            }
        });
        await page.waitForSelector('div.cmt.r1');
        const content = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('div#comment.icomment')).map(el => el.outerHTML).join('');
        });
        return this._parseComments(content);
    }

    async _parseComments(content) {
        console.log("content: ", content);

        const $ = cheerio.load(content);
        const comments = [];

        const parseComment = (selector, parentClass) => {
            $(selector).each((index, element) => {
                const $element = $(element);
                const id = $element.attr('w_idx');
                const text = $element.find('.content').html();
                const author = $element.find('.nick').text().trim();
                const likes = parseInt($element.find('.up u').text().trim()) || 0;
                const parentId = $element.hasClass(parentClass) ? $element.prevAll(`${parentClass}:first`).attr('w_idx') : null;

                comments.push({
                    id,
                    text,
                    author,
                    likes,
                    parentId
                });
            });
        };

        for (let i = 0; i < 10; i++) {
            parseComment(`.cmt.r${i}`, `r${i - 1}`);
        }

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
