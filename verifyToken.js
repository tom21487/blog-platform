var mongo = require('./mongo');
var db = mongo.getDb();
const jwt = require("jsonwebtoken");

exports.restrictAccess = async function(req, res, next) {
  // Prepare user_out rendering
  let userOut = {
    title: req.params.language == "en" ? "Access user account" : "访问用户账号",
    page: 'user',
    language: req.params.language
  }
  // [check] error type 0: no token
  const token = req.cookies.token;
  // [handle] error type 0: no token
  console.log("[verifyToken::restrictAccess]: token: ")
  console.log(token);
  if (!token) {
    console.log("[verifyToken::restrictAccess]: no token, rendering user_out");
    return res.render("user_out", userOut);
  }
  try {
    // [check] error type 1: invalid token
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    // [check] error type 2: db mismatch
    let user = await db.collection("users").findOne({ _id: decoded._id });
    if (user.token != token) {
      // [handle] error type 2: db mismatch
      console.log("[verifyToken::restrictAccess]: db mismatch, deleting cookie " +
                  "and rendering user_out");
      res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
      return res.render("user_out", userOut);
    }
    // Pass all checks: send username to next function
    req.userId = decoded._id;
    // req.userObj = user;
  } catch(err) {
    // [handle] error type 1: invalid token
    if (err.message == "invalid signature") {
      console.log("[verifyToken::restrictAccess]: invalid token, deleting cookie " +
                  "and rendering user_out");
      res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
      return res.render("user_out", userOut);
    }
    return next(err);
  }
  next();
}

exports.checkLoginState = async function(req, res, next) {
  // [check] error type 0: no token
  const token = req.cookies.token;
  // [handle] error type 0: no token
  if (!token) {
    console.log("[verifyToken::checkLoginState]: no token, proceeding to next()");
    return next();
  }
  try {
    // [check] error type 1: invalid token
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    // [check] error type 2: db mismatch
    let user = await db.collection("users").findOne({ _id: decoded._id });
    if (user.token != token) {
      // [handle] error type 2: db mismatch
      console.log("[verifyToken::restrictAccess]: db mismatch, deleting cookie " +
                  "and proceeding to next()");
      res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
      return next();
    }
  } catch(err) {
    // [handle] error type 1: invalid token
    if (err.message == "invalid signature") {
      console.log("[verifyToken::checkLoginState]: invalid token, deleting cookie " +
                  "and proceeding to next()");
      res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
      return next();
    }
  }
  // Pass all checks: display user reminder
  return res.render("user_reminder", {
    title: req.params.language == "en" ? "You have already logged in!" :
      "您已登陆！",
    page: 'user',
    language: req.params.language
  });
}
