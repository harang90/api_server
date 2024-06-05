
const express = require('express');
const router = express.Router();
const commentController = require('../controller/comment.controller');

router.get('/:itemId', commentController.getCommentByItemId);
router.post('/:itemId', commentController.createComment);

module.exports = router;

