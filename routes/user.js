var express = require('express');
var router = express.Router({mergeParams: true});

// Require controller modules
var verifyToken = require("../verifyToken");
var userController = require('../controllers/userController.js');

router.get('/', verifyToken.restrictAccess, userController.index);
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.createAccount);
router.get('/login', verifyToken.checkLoginState, userController.logInPage);
router.post('/login', userController.checkUser);

module.exports = router;
