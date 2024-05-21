
const SheetDownloader = require('../util/sheet.downloader');

async function sheetToJson(req, res) {
  const params = req.query;
  console.log(params);

  const sheetApiClient
  const downloader = new SheetDownloader(sheetApiClient);

  downloader.getValues(params.id, params.range)
}

module.exports = {
  sheetToJson,
};