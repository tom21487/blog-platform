var express = require('express');
var router = express.Router();

// Require controller modules
var blogController = require('../controllers/blogController.js');

/* GET about listing. */
router.get('/', blogController.index);

module.exports = router;
