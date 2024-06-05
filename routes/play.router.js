
const express = require('express');
const router = express.Router();
const playcontroller = require('../controller/play.controller');

router.get('/video/:filename', playcontroller.playVideo);
router.get('/image/:filename', playcontroller.playImage);

module.exports = router;