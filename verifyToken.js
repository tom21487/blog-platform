const jwt = require("jsonwebtoken");

exports.restrictAccess = function(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.render("user_out", {
    title: req.params.language == "en" ? "Access user account" : "访问用户账号",
    page: 'user',
    language: req.params.language
  });
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Error handling middleware currently takes care of:
  // invalid and expired token errors
  req.userId = decoded._id;
  /* console.log("req.userId");
  console.log(req.userId); */
  next();
}

exports.checkLoginState = function(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next();
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Error handling middleware currently takes care of:
  // invalid and expired token errors
  return res.render("user_reminder", {
    title: req.params.language == "en" ? "You have already logged in!" :
      "您已登陆！",
    page: 'user',
    language: req.params.language
  });
}
