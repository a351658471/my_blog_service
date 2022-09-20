var express = require('express');
var router = express.Router();
const notesHandle = require('../router_handle/notes_handle')
router.post('/addNote',notesHandle.addNote)
module.exports = router;