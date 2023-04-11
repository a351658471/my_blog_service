var express = require('express');
var router = express.Router();
const tagsHandle = require('../router_handle/tags_handle')

//新增笔记
router.post('/addTag',tagsHandle.addTag)

//笔记编辑
router.post('/editTag',tagsHandle.editTag)

//删除编辑
router.delete('/deleteTag/:id',tagsHandle.deleteTag)

//查询笔记
router.get('/queryTag',tagsHandle.queryTag)

module.exports = router;