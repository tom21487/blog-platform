var mongo = require('../mongo');
var db = mongo.getDb();
var tagsCollection = db.collection('tags');
var projectsCollection = db.collection('projects');
var Project = require('../models/project');

exports.index = function(req, res, next) {
  tagsCollection.find({title: {'$ne': 'not tagged'}}).toArray(function(err, tags) {
    if (err) return next(err);
    res.render('create_form', {
      title: 'Create new post',
      page: 'home',
      tags: tags
    });
  });
}

exports.sendToDb = function(req, res, next) {
  // Manual tags array conversion
  let tags = req.body.tags;
  if (!req.body.tags) {
    tags = new Array("not tagged");
  } else if (!(req.body.tags instanceof Array)) {
    tags = new Array(req.body.tags);
  }

  let project = new Project({
    title: req.body.title,
    tags: tags,
    description: req.body.description,
  });

  projectsCollection.insertOne(project, function(err, result) {
    if (err) return next(err);
    res.redirect(project.url);
  });
}

