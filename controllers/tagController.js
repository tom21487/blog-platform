var mongo = require('../mongo');
var db = mongo.getDb();

exports.showTags = function(req, res, next) {
  db.collection("tags").find().toArray(function(err, tags) {
    if (err) return next(err);
    res.render('tags', {
      title: 'Tom\'s site - tags',
      tags: tags
    });
  });
}

exports.showForm = function(req, res, next) {
  if (err) return next(err);
  res.render('tag_form', {
    title: 'Create new tag'
  });
}