var express = require('express');
var router = express.Router();
const userHandle = require('../router_handle/user_handle')

router.post('/register',userHandle.register)

router.get('/login',userHandle.login)
module.exports = router;
