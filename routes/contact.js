var express = require('express');
var router = express.Router({mergeParams: true});
var contactController = require('../controllers/contactController.js');

router.get('/', contactController.index);

module.exports = router;
