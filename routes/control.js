var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var createController = require('../controllers/createController.js');
var changeController = require('../controllers/changeController.js');

var multer = require('multer');
var upload = multer({dest: './public/images'});

router.get('/', function(req, res, next) {
  res.render('control');
});

router.get('/create', createController.showForm);
router.post('/create', upload.array('image'), createController.sendToDb);

router.get('/change', changeController.list);
router.get('/change/update', changeController.update);
router.get('/change/delete', changeController.delete);

module.exports = router;
