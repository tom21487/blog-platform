var express = require('express');
var router = express.Router();

// Require controller modules
var createController = require('../controllers/createController.js');

var multer = require('multer');
var upload = multer({dest: './public/'});

router.get('/', createController.index);
router.post('/', upload.array('image'), createController.sendToDb);

module.exports = router;
