var blogsCollection = require('../mongo').getBlogs();

exports.index = function(req, res, next) {
  blogsCollection.find().toArray(function(err, blogs) {
    if (err) {
      return next(err);
    }
    console.log(blogs);
    res.render('blog', {
      title: 'Tom\'s site - blog',
      blogs: blogs,
    });
  });
}