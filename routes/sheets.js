
const express = require('express');
const router = express.Router();
const sheetController = require('../controller/sheet.controller');

router.get('/', sheetController.sheetToJson);

module.exports = router;