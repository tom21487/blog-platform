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

async function createAccount(req, res, next) {
  try {
    // Hash password
    let hashPassword = bcrypt.hash(req.body.password, 10);
    let hash = await hashPassword;
    // Create token
    const token = jwt.sign({ _id: req.body.username }, process.env.JWT_SECRET, {
      expiresIn: "2d"});
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    // Create user
    let user = {
      _id: req.body.username,
      password: hash,
      token: token
    }
    let insertUser = db.collection("users").insertOne(user);
    let result = await insertUser;
    return res.render('user_in', {
      title: req.params.language == 'en' ? 'User system' : '用户系统',
      page: 'user',
      language: req.params.language,
      username: req.body.username
    });
  } catch(err) {
    let errCode = err.message.substring(0, 6);
    if (errCode == "E11000") {
      return res.render("user_dup", {
	title: req.params.language == "en" ? "Alert" : "警告",
	page: "user",
	language: req.params.language,
	username: req.body.username
      });
    }
    return next(err);
  }
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
      expiresIn: "1d"});
    // Store token in browser cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    // Update token entry for user
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { token: token }
      });
    return res.render('user_in', {
      title: req.params.language == 'en' ? 'User system' : '用户系统',
      page: 'user',
      language: req.params.language,
      username: req.body.username
    });
  } catch (err) {
    return next(err);
  }
}

function logout(req, res, next) {
  let didReset = false;
  try {
    // Clear user db token entry
    const token = req.cookies.token;
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(err) {
    console.log("[userController::logout]: invalid token during logout, " +
                "resetting db token entry for all users");
    didReset = true;
    db.collection("users").updateMany({}, { $set: { token: null } });
  }
  console.log("[userController:logout]: cleaning 'token' cookie.");
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  if (!didReset) {
    console.log("[userController:logout]: resetting db token entry for correct user");
    db.collection("users").updateOne({ _id: decoded._id }, { $set: { token: null } });
  }
  return res.render("user_out", {
    title: req.params.language == "en" ? "Access user account" : "访问用户账号",
    page: 'user',
    language: req.params.language
  });
}
