var mongo = require('../mongo');
var db = mongo.getDb();
var tagsCollection = db.collection('tags');

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
  console.log(req.body);
  res.redirect('/create');
}