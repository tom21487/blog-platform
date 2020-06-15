var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var blogController = require('../controllers/blogController.js');

/* GET about listing. */
router.get('/', blogController.list);
router.get('/:id', blogController.detail);

module.exports = router;
