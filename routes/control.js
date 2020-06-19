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
router.post('/change', changeController.list);

//router.get('/change/:type/:id/update', changeController.showForm);
//router.post('/change/:type/:id/update', changeController.updateInDb);

router.get('/change/:type/:id/delete', changeController.confirmation);
router.post('/change/:type/:id/delete', changeController.removeFromDb);

module.exports = router;
