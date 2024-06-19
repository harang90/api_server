const { Comment } = require('../database');
const geoip = require('geoip-lite');

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
    const clientIp = req.ip || req.connection.remoteAddress; // Get client IP address
    const geo = geoip.lookup(clientIp); // Lookup the geolocation information

    console.log("Client IP:", clientIp); // Log the IP address
    console.log("Country:", geo ? geo.country : "Unknown"); // Log the country or show Unknown if not found

    const comment = {
        itemId: req.params.itemId,
        text: req.body.text,
        author: req.body.author,
        country: geo ? geo.country : "KR" // Store the country if available
    };
    const newComment = await Comment.create(comment);
    res.json(newComment);
}

module.exports = { getCommentByItemId, createComment, likeComment };
