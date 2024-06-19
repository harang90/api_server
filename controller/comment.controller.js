
const { Comment } = require('../database');

async function getCommentByItemId(req, res) {
    const itemId = req.params.itemId;
    const comments = await Comment.findAll({ where: { itemId } });

    console.log("found comments: ", comments);
    res.json(comments);
}

async function likeComment(req, res) {
    const commentId = req.params.commentId;
    const comment = await Comment.findByPk(commentId);
    comment.likes += 1;
    await comment.save();
    res.json(comment);
}

async function createComment(req, res) {
    const itemId = req.params.itemId;
    const comment = {
        itemId,
        text: req.body.text,
        author: req.body.author,
    }
    const newComment = await Comment.create(comment);
    res.json(newComment);
}

module.exports = { getCommentByItemId, createComment, likeComment };
