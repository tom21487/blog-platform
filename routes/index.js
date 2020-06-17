var express = require('express');
var router = express.Router({mergeParams: true});
var indexController = require('../controllers/indexController.js');

router.get('/', indexController.index);

module.exports = router;
