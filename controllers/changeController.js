var mongo = require('../mongo');
var db = mongo.getDb();

exports.list = function(req, res, next) {
  db.collection("projects").find().toArray(function(err, projects) {
    if (err) return next(err);
    db.collection("blogs").find().toArray(function(err, blogs) {
      if (err) return next(err);
      res.render('change', {
        projects: projects,
        blogs: blogs
      });
    });
  });
}

exports.update = function(req, res, next) {}
exports.delete = function(req, res, next) {
  res.render('post_delete');
}