var mongo = require('../mongo');
var db = mongo.getDb();

exports.list = function(req, res, next) {
  if (req.body.type == "projects" || req.body.type == undefined) {
    db.collection("projects").find().toArray(function(err, projects) {
      if (err) return next(err);
      res.render('change', {
        posts: projects,
        type: 'project'
      });
    });
  } else if (req.body.type == "blogs") {
    db.collection("blogs").find().toArray(function(err, blogs) {
      if (err) return next(err);
      res.render('change', {
        posts: blogs,
        type: 'blog'
      });
    });
  }
}

exports.confirmation = function(req, res, next) {
  let collectionString = req.params.type + "s";
  db.collection(collectionString).findOne({_id: req.params.id},function(err, post) {
    if (err) return next(err);
    res.render('post_delete', {
      post: post
    });
  });
}

exports.removeFromDb = function(req, res, next) {
  if (req.body.result == "yes") {
    let collectionString = req.params.type + "s";
    db.collection(collectionString).deleteOne({_id: req.params.id}, function(err, result) {
      if (err) return next(err);
      if (result.deletedCount != 1) {
        var err = new Error('Incorrect deletedCount');
        err.status = 404;
        return next(err);
      }
      res.redirect('/control/change');
    });
  } else if (req.body.result == "no") {
    res.redirect('/control/change');
  }
}