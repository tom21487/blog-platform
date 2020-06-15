var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var projectController = require('../controllers/projectController.js');

router.get('/', projectController.list);
router.get('/:id', projectController.detail);

module.exports = router;
