var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var createController = require('../controllers/createController.js');

var multer = require('multer');
var upload = multer({dest: './public/images'});

router.get('/', createController.showForm);
router.post('/', upload.array('image'), createController.sendToDb);

module.exports = router;
