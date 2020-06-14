var mongo = require('../mongo');
var db = mongo.getDb();
var projectsCollection = db.collection('projects');
var tagsCollection = db.collection('tags');

exports.list = function(req, res, next) {
  // Run these asynchronously in the future: https://codehandbook.org/how-to-run-javascript-promises-in-parallel/
  let queryObject = req.query.tag ? {tags: req.query.tag} : {};
  projectsCollection.find(queryObject).toArray(function(err, projects) {
    if (err) return next(err);
    tagsCollection.find().toArray(function(err, tags) {
      if (err) return next(err);
      res.render('projects_list', {
        title: 'Tom\'s site - projects',
        projects: projects,
        page: 'projects',
        tags: tags
      });
    });
  });
}

exports.detail = function(req, res, next) {
  projectsCollection.findOne({_id: req.params.id}, function(err, project) {
    if (err) {
      return next(err);
    }
    res.render('post_detail', {
      title: 'Project - ' + project.title,
      post: project,
      page: 'projects'
    });
  });
}