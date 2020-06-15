var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Tom\'s site - home',
    page: 'home',
    language: req.params.language
  });
});

module.exports = router;
