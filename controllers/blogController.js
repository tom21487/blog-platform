var mongo = require('../mongo');
var db = mongo.getDb();
var blogsCollection = db.collection('blogs');

exports.index = function(req, res, next) {
  blogsCollection.find().toArray(function(err, blogs) {
    if (err) {
      return next(err);
    }
    console.log(blogs);
    res.render('blog', {
      title: 'Tom\'s site - blog',
      blogs: blogs,
      page: 'blog'
    });
  });
}