
const { Item } = require('../database');

async function getItems(req, res) {
  const result = await Item.findAll();
  res.status(200).json({ result });
}

module.exports = {
  getItems,
};
