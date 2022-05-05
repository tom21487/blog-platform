var mongo = require('../mongo');
var db = mongo.getDb();

exports.showTags = function(req, res, next) {
  db.collection("tags").find({name: {'$ne': 'not tagged'}}).toArray(function(err, tags) {
    if (err) return next(err);
    res.render('tag_list', {
        title: req.params.language == 'en' ? 'Control panel' : '控制面板',
        page: 'user',
        language: req.params.language,
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
    res.redirect('/'+req.params.language+'/control/tags');
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
      res.redirect('/'+req.params.language+'/control/tags');
    }
  );
}

exports.confirmation = async function(req, res, next) {
  try {
    // Find posts for matching tags
    let findTag = db.collection("tags").findOne({ _id: mongo.getObjectID(req.params.id) });
    let queryObject = { tags: mongo.getObjectID(req.params.id) };
    let findProjects = db.collection("projects").find(queryObject).toArray();
    let findBlogs = db.collection("blogs").find(queryObject).toArray();
    let [tag, projects, blogs] = await Promise.all([findTag, findProjects, findBlogs]);
    res.render("tag_delete", {
      title: req.params.language == "en" ? "Confirm delete tab" : "确认删除标签",
      language: req.params.language,
      tag: tag,
      projects: projects,
      blogs: blogs
    });
  } catch(err) {
    return next(err);
  }
}

exports.removeFromDb = async function(req, res, next) {
  try {
    if (req.body.result == "yes") {
      await db.collection("tags").deleteOne({ _id: mongo.getObjectID(req.params.id) });
      res.redirect("/"+req.params.language+"/control/tags");
    } else if (req.body.result == "no") {
      res.redirect("/"+req.params.language+"/control/tags");
    }
  } catch(err) {
    return next(err);
  }
}

// Update is easy
// Delete requires deleting all posts that are related to tag first (make posts store tag id, not tag name (in case name changes!))
