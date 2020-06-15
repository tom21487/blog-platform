var express = require('express');
var router = express.Router({mergeParams: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.params);
  res.render('index', {
    title: 'Tom\'s site - home',
    page: 'home',
    language: req.params.language
  });
});

module.exports = router;
