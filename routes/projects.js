var express = require('express');
var router = express.Router();

// Require controller modules
var projectController = require('../controllers/projectController.js');

/* GET about listing. */
router.get('/', projectController.index);

module.exports = router;
