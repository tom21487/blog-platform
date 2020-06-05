var express = require('express');
var router = express.Router();

// Require controller modules
var projectController = require('../controllers/projectController.js');

router.get('/', projectController.index);
router.get('/:id', projectController.detail);

module.exports = router;
