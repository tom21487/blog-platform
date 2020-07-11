const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.send("no token found in browser cookie");
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Error handling middleware currently takes care of:
  // invalid and expired token errors
  req.userId = decoded._id;
  /* console.log("req.userId");
  console.log(req.userId); */
  next();
}

module.exports = verifyToken;