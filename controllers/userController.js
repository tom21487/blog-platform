var mongo = require('../mongo');
var db = mongo.getDb();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET /:lang/user
exports.index = function(req, res, next) {
    return res.render('user_in', {
      title: req.params.language == 'en' ? 'User system' : '用户系统',
      page: 'user',
      language: req.params.language,
      username: req.userId
    });
}

// POST /:lang/user
exports.handleRequestMode = function(req, res, next) {
  if (req.body.requestMode == "signup") {
    createAccount(req, res, next);
  } else if (req.body.requestMode == "login") {
    checkUser(req, res, next);
  } else {
    logout(req, res, next);
  }
}

exports.signUpPage = function(req, res, next) {
  res.render('signup', {
      title: req.params.language == 'en' ? 'Sign up' : '注册'
  });
}

function createAccount(req, res, next) {
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

async function checkUser(req, res, next) {
  try {
    // Check username
    let findUser = db.collection("users").findOne({ _id: req.body.username });
    let user = await findUser;
    if (!user) return res.send("username does not exist");
    // Check password
    let checkPwd = bcrypt.compare(req.body.password, user.password);
    let result = await checkPwd;
    if (!result) return res.send("invalid password");
    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d"});
    // Store token in browser cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    return res.render('user_in', {
      title: req.params.language == 'en' ? 'User system' : '用户系统',
      page: 'user',
      language: req.params.language,
      username: req.body.username
    });
    // TODO tell user_in the username (through URL?)
  } catch (err) {
    return next(err);
  }
}

function logout(req, res, next) {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  return res.render("user_out", {
    title: req.params.language == "en" ? "Access user account" : "访问用户账号",
    page: 'user',
    language: req.params.language
  });
}
