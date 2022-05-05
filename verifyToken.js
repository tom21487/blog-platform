const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
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

module.exports = verifyToken;
