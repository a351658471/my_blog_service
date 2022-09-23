var express = require('express');
var router = express.Router();
const uploadHandle = require('../router_handle/upload_handle')
const uploads = multer({dest:"uploads/"}) //指定图片的储存位置
//新增笔记
router.post('/upload',uploads.single('imges'),uploadHandle.upload)

module.exports = router;