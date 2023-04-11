var express = require('express');
var router = express.Router();
const commentsHandle = require('../router_handle/comments_handle')

//新增评论
router.post('/addComment',commentsHandle.addComment)

module.exports = router;