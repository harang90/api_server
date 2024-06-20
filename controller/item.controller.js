
const fs = require('fs').promises;

const ItemDownloader = require('../util/item_downloader');
const sheetController = require('./sheet.controller');

const { Item } = require('../database');

async function getItems(req, res) {
  const result = await Item.findAll();
  res.status(200).json({ result });
}

async function syncItems(req, res) {
  await sheetController.sheetToJson(req, res);
  await updateItems(req, res);
  await downloadItems(req, res);
}

async function downloadItems(req, res) {
  const result = await Item.findAll();

  result.forEach(async (item) => {
    if (!(item.resource === null)) {

    } else {
      const itemDownloader = new ItemDownloader();
      const paths = await itemDownloader.downloadItem(item.link);

      item.resource = paths;
      await item.save();
    }
  });

  res.status(200).json({ result });
}

async function updateItems(req, res) {

  const params = req.query;
  const file = params.file;
  let jsonObject = {};

  try {
    const data = await fs.readFile(file, 'utf8');
    jsonObject = JSON.parse(data);

  } catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).send('Error reading or parsing file:', error);
  }

  try {
    const items = jsonObject;
    if (Array.isArray(items)) {
      const upsertPromises = items.map(async (item) => {
        const [updatedItem, created] = await Item.upsert(item, {
          returning: true
        });
        return updatedItem.get({ plain: true });
      });
      const upsertedItems = await Promise.all(upsertPromises);
      res.status(200).json({ upsertedItems });
    } else {
      throw new Error('Invalid items format: Expected an array of items');
    }
  } catch (error) {
    console.error('Error upserting items:', error);
    res.status(500).send('Error upserting items');
  }

}

async function getRandomItem(req, res) {

  try {

    const itemIds = await Item.findAll({
      attributes: ['id']
    });

    if (itemIds.length === 0) {

      res.status(404).send('No items');

    } else {

      const randomIndex = Math.floor(Math.random() * itemIds.length);
      const randomItemId = itemIds[randomIndex].id;
      const randomItem = await Item.findByPk(randomItemId);
      
      if (!(randomItem.resource === null)) {

      } else {
        const link = randomItem.link;
        const itemDownloader = new ItemDownloader();
        const paths = await itemDownloader.downloadImage(link);

        randomItem.resource = paths;
        await randomItem.save();
      }

      res.status(200).json(randomItem);

    }
  } catch (error) {
    console.error('Error fetching random item:', error);
    res.status(500).send('Error fetching random item');
  }

}

module.exports = {
  getItems,
  syncItems,
  downloadItems,
  updateItems,
  getRandomItem,
};
