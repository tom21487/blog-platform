var mongo = require('../mongo');
var db = mongo.getDb();
var tagsCollection = db.collection('tags');
var projectsCollection = db.collection('projects');

exports.index = function(req, res, next) {
  tagsCollection.find().toArray(function(err, tags) {
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
  let newProject = {
    title: req.body.title,
    tags: tags,
    description: req.body.description,
    imgURL: '/images/1.jpeg',
    url: '/projects/' + req.body._id
  }
  // Project url should really be /projects/formatted-and-escaped-name
  projectsCollection.insertOne(newProject, function(err, result) {
    res.redirect('/projects'); // should really redirect to newProject's url
  });
}