var express = require('express');
var router = express.Router();
const multer = require('multer')
const uploadHandle = require('../router_handle/upload_handle')
const upload = multer({dest:"uploads/"}) //指定图片的储存位置
//新增笔记
router.post('/uploadImg',upload.array('files',1),uploadHandle.upload)

module.exports = router;