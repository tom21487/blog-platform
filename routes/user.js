var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var userController = require('../controllers/userController.js');

router.get('/', userController.index);

module.exports = router;
