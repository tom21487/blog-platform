var mongo = require('../mongo');
var db = mongo.getDb();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.index = function(req, res, next) {
  res.render('user_out', {
      title: req.params.language == 'en' ? 'User' : '用户',
      page: 'user',
      language: req.params.language
  });
}

exports.signUpPage = function(req, res, next) {
  res.render('signup', {
      title: req.params.language == 'en' ? 'Sign up' : '注册'
  });
}

exports.createAccount = function(req, res, next) {
  // hash password
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) return next(err);
    console.log("hash:");
    console.log(hash);
    // create user
    let user = {
      _id: req.body.username,
      password: hash
    }
    db.collection("users").insertOne(user, function(err, result) {
      if (err) return next(err);
      res.send("successfully created user");
    });
  });
}

exports.logInPage = function(req, res, next) {
  res.render('login', {
    title: 'Log in'
  });
}

exports.checkUser = function(req, res, next) {
  // check if username exists
  db.collection("users").findOne({_id: req.body.username}, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send("username does not exist");
      // check password
      console.log("req.body.password: " + req.body.password);
      console.log("user.password: " + user.password);
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (err) return next(err);
        if (!result) return res.send("invalid password");
      // create token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d"});
      // store token in browser cookie
      res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
      return res.redirect(req.params.language + "/user");
    });
  });
}
