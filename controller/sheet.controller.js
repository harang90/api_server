
const SheetApiClientFactory = require('../util/sheet_api_client_factory');
const SheetDownloader = require('../util/sheet_downloader');

async function sheetToJson(req, res) {
  
  try {
    const params = req.query;
    console.log(params);

    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);

    const object = await downloader.getRowsToObject(params.id, params.name, params.file);

    res.json(object);

  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  sheetToJson,
};