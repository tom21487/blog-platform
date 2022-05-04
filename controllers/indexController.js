var mongo = require('../mongo');
var db = mongo.getDb();

exports.index = async function(req, res, next) {
  // console.log("index controller in use");
  try {
    // 1. Define query actions
    let findProjects = db.collection("projects").find().limit(2).toArray();
    let findBlogs = db.collection("blogs").find().limit(2).toArray();
    // 2. Resolve queries
    let data = await Promise.all([findProjects, findBlogs]);
      // 3. Convert post tag ids to tag names
      for (posts of data) {
          for (let i = 0; i < posts.length; i++) {
              /*console.log(posts[i].titleEn + "的tags: ");
              console.log(posts[i].tags);*/
              for (let j = 0; j < posts[i].tags.length; j++) {
                  // Binary search (find by id) is better than linear search (loop through all tags)
                  let postTagObject = await db.collection("tags").findOne({ _id: mongo.getObjectID(posts[i].tags[j]) });
                  posts[i].tags[j] = postTagObject.name;
              }
          }
      }
    res.render("index", {
      title: req.params.language == "en" ? "Home" : "首页",
      page: "home",
      language: req.params.language,
      projects: data[0],
      blogs: data[1]
    });
  } catch(err) {
    return next(err);
  }
}
