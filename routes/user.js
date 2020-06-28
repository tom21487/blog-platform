var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var userController = require('../controllers/userController.js');

router.get('/', userController.index);
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.createAccount);
router.get('/login', userController.logInPage);
router.post('/login', userController.checkUser);

module.exports = router;
