
const express = require('express');
const router = express.Router();
const itemController = require('../controller/item.controller');

router.get('/', itemController.getItems);
router.get('/updateItems', itemController.updateItems);
router.get('/randomItem', itemController.getRandomItem);

module.exports = router;