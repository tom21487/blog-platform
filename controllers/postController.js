var mongo = require('../mongo');
const { query } = require('express');
var db = mongo.getDb();

exports.list = async function(req, res, next) {
  try {
    // 0. Convert req.query.tag to id
    let tagObject = await db.collection("tags").findOne({ name: req.query.tag });
    let tagId = tagObject ? tagObject._id : null;
    
    // 1. Define query parameters
    let queryObject = tagId ? {tags: mongo.getObjectID(tagId)} : {};
    let n = (req.params.type == "projects") ? (10) : ((req.params.type == "blogs") ? (5) : (0));
    
    // 2. Define query actions
    let findPosts = db.collection(req.params.type).find(queryObject).sort({$natural:-1}).skip((req.params.page-1)*n).limit(n).toArray();
    let findTags = db.collection('tags').find().toArray();
    let countDocuments = db.collection(req.params.type).countDocuments();

    // 3. Resolve queries
    let [posts, tags, documentCount] = await Promise.all([findPosts, findTags,
                                                          countDocuments]);
    // 4. Convert post tag ids to tag names
    for (let i = 0; i < posts.length; i++) {
      /*console.log(posts[i].titleEn + "的tags: ");
      console.log(posts[i].tags);*/
      for (let j = 0; j < posts[i].tags.length; j++) {
        // Binary search (find by id) is better than linear search (loop through all tags)
        let postTagObject = await db.collection("tags").findOne({ _id: mongo.getObjectID(posts[i].tags[j]) });
        posts[i].tags[j] = postTagObject.name;
      }
    }

    // 5. Render view
    res.render('post_list', {
        title: req.params.type == 'projects' ?
            (req.params.language == 'en' ? 'Projects' : '项目') :
            (req.params.language == 'en' ? 'Blogs': '博客'),
      posts: posts,
      page: req.params.type,
      tags: tags,
      language: req.params.language,
      documentCount: documentCount
    });
  } catch(err) {
      return next(err);
  }
}

exports.detail = async function(req, res, next) {
  try {
    let findPost = db.collection(req.params.type).findOne(
      { _id: mongo.getObjectID(req.params.id) });
    let post = await findPost;
    let title = "";
    if (req.params.language == "en") {
      title = `${(req.params.type == "projects") ?
                 ("Project") : ((req.params.type == "blogs") ?
                 ("Blog") : (""))} - ${post.titleEn}`;
    } else if (req.params.language == "cn") {
      title = `${(req.params.type == "projects") ?
                 ("项目") : ((req.params.type == "blogs") ?
                 ("博客") : (""))} - ${post.titleCn}`;
    }
    for (let j = 0; j < post.tags.length; j++) {
      let postTagObject = await db.collection("tags").findOne({
        _id: mongo.getObjectID(post.tags[j])
      });
      post.tags[j] = postTagObject.name;
    }
    res.render('post_detail', {
      title: title,
      post: post,
      page: req.params.type,
      language: req.params.language
    });
  } catch(err) {
    return next(err);
  }
}
