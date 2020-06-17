var mongo = require('../mongo');
var db = mongo.getDb();

exports.index = function(req, res, next) {
  // maybe limit can only be called after skip?
  db.collection("projects").find().sort({'$natural':-1}).limit(2).toArray(function(err, projects) {
    if (err) return next(err);
    db.collection("blogs").find().sort({'$natural':-1}).limit(2).toArray(function(err, blogs) {
      if (err) return next(err);
      res.render('index', {
        title: 'Tom\'s site - home',
        page: 'home',
        language: req.params.language,
        projects: projects,
        blogs: blogs
      });
    });
  });
}