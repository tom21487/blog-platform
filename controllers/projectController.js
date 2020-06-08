var mongo = require('../mongo');
var db = mongo.getDb();
var projectsCollection = db.collection('projects');
var tagsCollection = db.collection('tags');

exports.index = function(req, res, next) {
  // Run these asynchronously in the future: https://codehandbook.org/how-to-run-javascript-promises-in-parallel/
  projectsCollection.find().toArray(function(err, projects) {
    if (err) return next(err);
    tagsCollection.find().toArray(function(err, tags) {
      if (err) return next(err);
      res.render('projects', {
        title: 'Tom\'s site - projects',
        projects: projects,
        page: 'projects',
        tags: tags
      });
    });
  });
}

exports.detail = function(req, res, next) {
  console.log(req.params.id);
  projectsCollection.findOne({formattedName: req.params.id}, function(err, project) {
    if (err) {
      return next(err);
    }
    res.render('project_detail', {
      title: 'Project - ' + project.title,
      project: project,
      page: 'projects'
    });
  });
}
