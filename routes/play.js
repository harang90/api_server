
const express = require('express');
const router = express.Router();
const playController = require('../controller/play.controller');

router.get('/video/:filename', playController.playVideo);
router.get('/image/:filename', playController.playImage);

module.exports = router;