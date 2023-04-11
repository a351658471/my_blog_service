var express = require('express');
var router = express.Router();
const notesHandle = require('../router_handle/notes_handle')

//新增笔记
router.post('/addNote',notesHandle.addNote)

//笔记编辑
router.post('/editNote',notesHandle.editNote)

//赞
router.put('/noteStarChange',notesHandle.noteStarChange)

//删除编辑
router.delete('/deleteNote/:id',notesHandle.deleteNote)

//查询笔记
router.get('/queryNotes',notesHandle.queryNotes)

//根据id获取笔记 
router.get('/article', notesHandle.article)

module.exports = router;