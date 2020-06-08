var mongo = require('../mongo');
var db = mongo.getDb();
var tagsCollection = db.collection('tags');
var projectsCollection = db.collection('projects');

exports.index = function(req, res, next) {
  tagsCollection.find().toArray(function(err, tags) {
    if (err) return next(err);
    res.render('create_form', {
      title: 'Create new post',
      page: 'home',
      tags: tags
    });
  });
}

exports.sendToDb = function(req, res, next) {
  // Manual tags array conversion
  let tags = req.body.tags;
  if (!req.body.tags) {
    tags = new Array("not tagged");
  } else if (!(req.body.tags instanceof Array)) {
    tags = new Array(req.body.tags);
  }

  let formattedName = formatName(req.body.title);
  let newProject = {
    title: req.body.title,
    tags: tags,
    description: req.body.description,
    imgURL: '/images/1.jpeg',
    formattedName: formattedName,
    url: '/projects/' + formattedName
  }
  projectsCollection.insertOne(newProject, function(err, result) {
    if (err) return next(err);
    res.redirect('/projects'); // should really redirect to newProject's url
  });
}

// FUNCTION formatName(string)
// Format's a name to be URL-safe
// 1. Removes all characters that aren't:
//	" ", "/", "-", "a-z", "A-Z"
// 2. Converts " " and "/" to "-"
// 3. Converts "A-Z" to "a-z"
function formatName(myStr) {
  for (let i = myStr.length-1; i >= 0; --i) {
    let code = myStr.charCodeAt(i);
    if (code < 97 || code > 122) {
			// Avoid: "a-z"
      let left = myStr.slice(0, i);
      let right = myStr.slice(i+1, myStr.length);
      if (code == 32 || code == 47) {
				// Convert: " " or "/"
        myStr = left + '-' + right;
      } else if (code >= 65 && code <= 90) {
				// Convert: "A-Z"
        myStr = left + myStr[i].toLowerCase() + right;
      } else if (code != 45) {
				// Avoid: "-"
        myStr = left + right;
      }
    }
  }
  return myStr;
}