var express = require('express');
var router = express.Router();
const chatgptHandle = require('../router_handle/chatgpt_handle')

//新增评论
router.post('/sendMessage',chatgptHandle.sendMessage)

module.exports = router;