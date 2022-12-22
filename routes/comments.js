var express = require('express');
var router = express.Router();
const commentsHandle = require('../router_handle/comments_handle')

//新增评论
router.post('/addComment',commentsHandle.addComment)
//获取评论
router.get('/queryComment',commentsHandle.queryComment)
module.exports = router;