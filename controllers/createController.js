var mongo = require('../mongo');
var db = mongo.getDb();

var Post = require('../models/post');

exports.showForm = function(req, res, next) {
  db.collection('tags').find({title: {'$ne': 'not tagged'}}).toArray(function(err, tags) {
    if (err) return next(err);
    res.render('create_form', {
      title: 'Create new post',
      page: 'home',
      tags: tags
    });
  });
}

exports.sendToDb = function(req, res, next) {
  // PART 0: DEBUG LOGS
  /* console.log("files:")
  console.log(req.files);
  console.log("body:");
  console.log(req.body); */

  // PART 1: ARRAY CONVERSIONS
  let tags = req.body.tags;
  if (!tags) {
    tags = new Array("not tagged");
  } else if (!(req.body.tags instanceof Array)) {
    tags = new Array(req.body.tags);
  }
  let text = req.body.text;
  if (!(req.body.text instanceof Array)) {
    text = new Array(req.body.text);
  }

  // PART 2: BLOCK BUILDING
  let allBlocks = [];
  let coverImage = "";
  let textIdx = 0, imageIdx = 0;

  for (section of req.body.order) {
    let newBlock = {
      type: section,
      content: ""
    }
    if (section === 'text') {
      newBlock.content = text[textIdx];
      textIdx++;
    } else if (section === 'image') {
      newBlock.content = '/images/' + req.files[imageIdx].filename;
      // In the future, allow the user to choose the cover image
      if (imageIdx === 0) {
        coverImage = newBlock.content;
      }
      imageIdx++;
    } else {
      console.error("ERROR undefined block type");
      return next();
    }
    allBlocks.push(newBlock);
  }

  // PART 4: ADD PROJECT TO DATABASE
  let post = new Post({
    title: req.body.title,
    type: req.body.type,
    tags: tags,
    description: req.body.description,
    blocks: allBlocks,
    coverImage: coverImage
  });

  let collectionString = req.body.type + "s";

  db.collection(collectionString).insertOne(project, function(err, result) {
    if (err) return next(err);
      res.redirect(post.url);
  });
}

