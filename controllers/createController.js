var mongo = require('../mongo');
var db = mongo.getDb();

var Post = require('../models/post');

exports.showForm = function(req, res, next) {
  db.collection('tags').find({name: {'$ne': 'not tagged'}}).toArray(function(err, tags) {
    if (err) return next(err);
    res.render('post_form', {
      title: 'Create new post',
      tags: tags,
    });
  });
}

exports.sendToDb = function(req, res, next) {
  // PART 0: DEBUG LOGS
  console.log("files:")
  console.log(req.files);
  console.log("body:");
  console.log(req.body);

  // PART 1: ARRAY CONVERSIONS
  let tags = [];
  if (!req.body.tags) {
    console.log("This should be changed after deployment.");
    tags = new Array(mongo.getObjectID(process.env.NOT_TAGGED_ID));
  } else {
    for (tag of req.body.tags) {
      tags.push(mongo.getObjectID(tag));
    }
  }
  if (!req.body.order) req.body.order = [];
  if (!req.body.textEn) req.body.textEn = [];
  if (!req.body.textCn) req.body.textCn = [];

  // PART 2: BLOCK BUILDING
  let allBlocks = [], allImages = [];
  let coverImage = "";
  let descriptionEn = "", descriptionCn = "";
  let textIdx = 0, imageIdx = 0;

  for (section of req.body.order) {
    let newBlock = {
      type: section
      // Optional fields:
      // contentEn, contentCn, url, imgName
    }
    if (section === 'text') {
      newBlock.contentEn = req.body.textEn[textIdx];
      newBlock.contentCn = req.body.textCn[textIdx];
      if (textIdx === 0) {
        descriptionEn = newBlock.contentEn;
        descriptionCn = newBlock.contentCn;
      }
      textIdx++;
    } else if (section === 'image') {
      newBlock.url = '/images/' + req.files[imageIdx].filename;
      //newBlock.imgName = req.files[imageIdx].name
      if (imageIdx === 0) {
        coverImage = newBlock.url;
      }
      allImages.push(newBlock.url);
      imageIdx++;
    } else {
      var err = new Error('Undefined block type');
      err.status = 404;
      return next(err);
    }
    allBlocks.push(newBlock);
  }

  // PART 4: ADD PROJECT TO DATABASE
  let post = new Post({
    titleEn: req.body.titleEn,
    titleCn: req.body.titleCn,
    type: req.body.type,
    tags: tags,
    blocks: allBlocks,
    coverImage: coverImage,
    descriptionEn: descriptionEn,
    descriptionCn: descriptionCn,
    images: allImages
  });

  db.collection(req.body.type).insertOne(post, function(err, result) {
    if (err) {
      for (image of post.images) {
        fs.unlinkSync("public" + image);
      }
      return next(err);
    }
    res.redirect('/'+language+'/control/change');
  });
}

