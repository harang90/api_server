
const fs = require('fs').promises;

const { Item } = require('../database');

async function getItems(req, res) {
  const result = await Item.findAll();
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

}

module.exports = {
  getItems,
  updateItems,
  getRandomItem,
};
