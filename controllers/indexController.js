var mongo = require('../mongo');
var db = mongo.getDb();

exports.index = async function(req, res, next) {
  console.log("index controller in use");
  try {
    // no more sorting for now (because I can't get it to work with Azure CosmosDB)
    let findProjects = db.collection("projects").find().limit(2).toArray();
    let findBlogs = db.collection("blogs").find().limit(2).toArray();
    let [projects, blogs] = await Promise.all([findProjects, findBlogs]);
    res.render("index", {
      title: "Tom's site - home",
      page: "home",
      language: req.params.language,
      projects: projects,
      blogs: blogs
    });
  } catch(err) {
    return next(err);
  }
}