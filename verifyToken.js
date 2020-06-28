const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.send("no token found in browser cookie");
  var decoded = jwt.verify(token, "secretkey");
  if (!decoded) return res.send("invalid token");
  req.userId = decoded._id;
  next();
}

module.exports = verifyToken;