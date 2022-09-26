var express = require('express');
var router = express.Router();
const profileHandle = require('../router_handle/profile_handle')

router.post('/saveProfile',profileHandle.saveProfile)

router.get('/getProfile',profileHandle.getProfile)