
const SheetDownloader = require('../util/sheet.downloader');

async function sheetToJson(req, res) {
  SheetDownloader.getValues(req.body.spreadsheetId, req.body.range)
}
