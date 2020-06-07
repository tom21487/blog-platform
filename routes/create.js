var express = require('express');
var router = express.Router();

// Require controller modules
var createController = require('../controllers/createController.js');

router.get('/', createController.index);
router.post('/', createController.sendToDb);
module.exports = router;
