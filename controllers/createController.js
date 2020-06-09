var mongo = require('../mongo');
var db = mongo.getDb();

var tagsCollection = db.collection('tags');
var projectsCollection = db.collection('projects');

var formidable = require('formidable');
var fs = require('fs');

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
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) return next(err);
    // Manual tags array conversion
    let tags = fields.tags;
    if (!fields.tags) {
      tags = new Array("not tagged");
    } else if (!(fields.tags instanceof Array)) {
      tags = new Array(fields.tags);
    }

    let project = new Project({
      title: fields.title,
      tags: tags,
      description: fields.description,
      image: files.image.name
    });

    projectsCollection.insertOne(project, function(err, result) {
      if (err) return next(err);

      // image upload
      fs.rename(files.image.path, "./public" + project.imgURL, function(err) {
        if (err) return next(err);
        res.redirect(project.url);
      });
    });
  });
}

