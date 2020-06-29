var mongo = require('../mongo');
var db = mongo.getDb();

exports.showTags = function(req, res, next) {
  db.collection("tags").find().toArray(function(err, tags) {
    res.render('tags', {
      title: 'Tom\'s site - tags',
      tags: tags
    });
  });
}