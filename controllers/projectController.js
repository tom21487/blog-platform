var projectsCollection = require('../mongo').getProjects();

exports.index = function(req, res, next) {
  projectsCollection.find().toArray(function(err, projects) {
    if (err) {
      return next(err);
    }
    res.render('projects', {
      title: 'Tom\'s site - projects',
      projects: projects,
    });
  });
}