const { Comment } = require('../models');

async function translateComment(comment) {
    comment.text = await translate(comment.text, 'en', 'ja');
    comment.author = await translate(comment.author, 'en', 'ja');
    comment.country = 'JP';
    return comment;
}

module.exports = {
    translateComment
}