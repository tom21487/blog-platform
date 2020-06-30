var mongo = require('../mongo');
var db = mongo.getDb();

exports.showTags = function(req, res, next) {
  db.collection("tags").find().toArray(function(err, tags) {
    if (err) return next(err);
    res.render('tag_list', {
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
  db.collection("tags").insertOne({ name: encodeURIComponent(req.body.name) }, function(err, result) {
    if (err) return next(err);
    res.redirect("/control/tags");
  });
}

exports.showUpdate = function(req, res, next) {
  db.collection("tags").findOne({ _id: mongo.getObjectID(req.params.id) }, function(err, tag) {
    if (err) return next(err);
    res.render("tag_form", {
      title: "Update existing tag",
      tag: tag
    });
  });
}

exports.updateInDb = function(req, res, next) {
  db.collection("tags").updateOne(
    { _id: mongo.getObjectID(req.params.id) },
    { $set: { name: req.body.name } },
    function(err, result) {
      if (err) return next(err);
      res.redirect("/control/tags");
    }
  );
}

exports.confirmation = function(req, res, next) {
  db.collection("tags").findOne({ _id: mongo.getObjectID(req.params.id) }, function(err, tag) {
    if (err) return next(err);
    res.render("tag_delete", {
      tag: tag
    });
  });
}

exports.removeFromDb = function(req, res, next) {
  if (req.body.result == "yes") {
    db.collection("tags").deleteOne({ _id: mongo.getObjectID(req.params.id) }, function(err, result) {
      if (err) return next(err);
      if (result.deletedCount != 1) {
        var err = new Error('Incorrect deletedCount');
        err.status = 404;
        return next(err);
      }
      res.redirect("/control/tags");
    });
  } else if (req.body.result == "no") {
    res.redirect("/control/tags");
  }
}

// Update is easy
// Delete requires deleting all posts that are related to tag first (make posts store tag id, not tag name (in case name changes!))