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

exports.showCreate = function(req, res, next) {
  res.render('tag_form', {
    title: 'Create new tag'
  });
}

exports.sendToDb = function(req, res, next) {
  db.collection("tags").insertOne({ _id: encodeURIComponent(req.body.name) }, function(err, result) {
    if (err) return next(err);
    res.redirect("/control/tags");
  });
}

exports.showUpdate = function(req, res, next) {
  db.collection("tags").findOne({ _id: req.params.id }, function(err, tag) {
    res.render("tag_form", {
      title: "Update existing tag",
      tag: tag
    });
  });
}

// Update is easy
// Delete requires deleting all posts that are related to tag first