var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var postController = require('../controllers/postController');

/* GET about listing. */
router.get('/detail/:id', postController.detail);
router.get('/:page', postController.list);

module.exports = router;
