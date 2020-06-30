var mongo = require('../mongo');
var db = mongo.getDb();

exports.list = function(req, res, next) {
  let queryObject = req.query.tag ? {tags: req.query.tag} : {};
  let n = (req.params.type == "projects") ? (10) : ((req.params.type == "blogs") ? (5) : (0));
  let findPosts = db.collection(req.params.type).find(queryObject).sort({$natural:-1}).skip((req.params.page-1)*10).limit(n).toArray();
  let findTags = db.collection('tags').find().toArray();
  let countDocuments = db.collection(req.params.type).countDocuments();
  Promise.all([findPosts, findTags, countDocuments])
  .then(function(values) {
    // Returned values will be in order of the Promises passed, regardless of completion order.
    console.log(values);
    // values[0] = posts
    // values[1] = tags
    // values[2] = document count
  })
  .catch(function(err) {
    return next(err);
  });
}

/*exports.list = function(req, res, next) {
  let queryObject = req.query.tag ? {tags: req.query.tag} : {};
  let n = (req.params.type == "projects") ? (10) : ((req.params.type == "blogs") ? (5) : (0));
  db.collection(req.params.type).find(queryObject).sort({$natural:-1}).skip((req.params.page-1)*10).limit(n).toArray(function(err, posts) {
    if (err) return next(err);
    db.collection('tags').find().toArray(function(err, tags) {
      if (err) return next(err);
      db.collection(req.params.type).countDocuments(function(err, count) {
        if (err) return next(err);
        res.render('post_list', {
          title: `Tom\'s site - ${req.params.type}`,
          posts: posts,
          page: req.params.type,
          tags: tags,
          language: req.params.language,
          documentCount: count
        });
      });
    });
  });
}*/

exports.detail = function(req, res, next) {
  db.collection(req.params.type).findOne({_id: req.params.id}, function(err, post) {
    if (err) return next(err);
    let title = "";
    if (req.params.language == "en") {
      title = `${(req.params.type == "projects") ? ("Project") : ((req.params.type == "blogs") ? ("Blog") : (""))} - ${post.titleEn}`;
    } else if (req.params.language == "cn") {
      title = `${(req.params.type == "projects") ? ("项目") : ((req.params.type == "blogs") ? ("博客") : (""))} - ${post.titleCn}`;
    }
    res.render('post_detail', {
      title: title,
      post: post,
      page: req.params.type,
      language: req.params.language
    });
  });
}