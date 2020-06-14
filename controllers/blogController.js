var mongo = require('../mongo');
var db = mongo.getDb();

exports.list = function(req, res, next) {
  let queryObject = req.query.tag ? {tags: req.query.tag} : {};
  db.collection('blogs').find(queryObject).toArray(function(err, blogs) {
    if (err) return next(err);
    db.collection('tags').find().toArray(function(err, tags) {
      if (err) return next(err);
      res.render('blogs_list', {
        title: 'Tom\'s site - blog',
        blogs: blogs,
        page: 'blog',
        tags: tags
      });
    });
  });
}

exports.detail = function(req, res, next) {
  db.collection('blogs').findOne({_id: req.params.id}, function(err, blog) {
    if (err) return next(err);
    res.render('blog_detail', {
      title: 'Blog Post - ' + blog.title,
      blog: blog,
      page: 'blog'
    });
  });
}