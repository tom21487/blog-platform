var express = require('express');
var router = express.Router();

// Require controller modules
var aboutController = require('../controllers/aboutController.js');

/* GET about listing. */
router.get('/', aboutController.index);

module.exports = router;
