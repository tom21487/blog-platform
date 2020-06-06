var mongo = require('../mongo');
var db = mongo.getDb();
var projectsCollection = db.collection('projects');
var ObjectID = require('mongodb').ObjectID;

exports.index = function(req, res, next) {
  projectsCollection.find().toArray(function(err, projects) {
    if (err) {
      return next(err);
    }
    res.render('projects', {
      title: 'Tom\'s site - projects',
      projects: projects,
      page: 'projects'
    });
  });
}

exports.detail = function(req, res, next) {
  projectsCollection.findOne({_id: new ObjectID("5ed73f153fbc3a324a80ca31")}, function(err, project) {
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
