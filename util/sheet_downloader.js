
const fs = require('fs');
const path = require('path');

class SheetDownloader {

  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getRowsToObject(spreadsheetId, sheetName, filePath = null) {
    try {
      const result = await this.apiClient.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: sheetName,
      });
      const rows = result.data.values;

      if (rows.length === 0) {
        const message = `No data found`;
        console.error(message);
        return {};
      }

      const object = this._rowsToObject(rows);

      if (filePath) {
        const jsonText = JSON.stringify(object, null, 2);

        const directory = path.dirname(filePath);
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }
        fs.writeFileSync(filePath, jsonText);
        console.log(`Saved to ${filePath}`);
      }

      return object;

    } catch (err) {
      // TODO (developer) - Handle exception
      throw err;
    }
  }

  _rowsToObject(rows) {
    const headerRow = rows.slice(0, 2)[1];
    const dataRows = rows.slice(2, rows.length);

    return dataRows.map((row) => {
      const item = {};
      for (let i = 0; i < headerRow.length; i++) {
        const fieldName = headerRow[i];
        const fieldValue = row[i];
        item[fieldName] = fieldValue;
      }
      return item;
    });
  }

}

module.exports = SheetDownloader;