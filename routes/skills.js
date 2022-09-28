var express = require('express');
var router = express.Router();
const skills_handle = require('../router_handle/skills_handles')

router.post('/saveSkill',skills_handle.saveSkill)

router.get('/getSkills',skills_handle.getSkills)

router.delete('/deleteSkill/:id',skills_handle.deleteSkill)
module.exports = router