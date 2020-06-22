var mongo = require('../mongo');
var db = mongo.getDb();

exports.list = function(req, res, next) {
  let queryObject = req.query.tag ? {tags: req.query.tag} : {};
  db.collection('blogs').find(queryObject).toArray(function(err, blogs) {
    if (err) return next(err);
    db.collection('tags').find().toArray(function(err, tags) {
      if (err) return next(err);
      res.render('post_list', {
        title: 'Tom\'s site - blog',
        posts: blogs,
        page: 'blog',
        tags: tags,
        language: req.params.language
      });
    });
  });
}

exports.detail = function(req, res, next) {
  db.collection('blogs').findOne({_id: req.params.id}, function(err, blog) {
    if (err) return next(err);
    let title = "";
    if (req.params.language == "en") {
      title = "Blog - " + blog.titleEn;
    } else if (req.params.language == "cn") {
      title = "博客 - " + blog.titleCn;
    }
    res.render('post_detail', {
      title: title,
      post: blog,
      page: 'blog',
      language: req.params.language
    });
  });
}