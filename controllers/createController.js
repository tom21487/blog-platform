var mongo = require('../mongo');
var db = mongo.getDb();

var Post = require('../models/post');

exports.showForm = function(req, res, next) {
  db.collection('tags').find({title: {'$ne': 'not tagged'}}).toArray(function(err, tags) {
    if (err) return next(err);
    res.render('form', {
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
  let tags = req.body.tags;
  if (!tags) {
    tags = new Array("not tagged");
  } else if (!(req.body.tags instanceof Array)) {
    tags = new Array(req.body.tags);
  }
  let textEn = req.body.textEn;
  if (!textEn) {
    textEn = new Array();
  } else if (!(req.body.textEn instanceof Array)) {
    textEn = new Array(req.body.textEn);
  }
  let textCn = req.body.textCn;
  if (!textCn) {
    textCn = new Array();
  } else if (!(req.body.textCn instanceof Array)) {
    textCn = new Array(req.body.textCn);
  }
  let order = req.body.order;
  if (!order) {
    order = new Array();
  } else if (!(req.body.order instanceof Array)) {
    order = new Array(req.body.order);
  }

  // PART 2: BLOCK BUILDING
  let allBlocks = [], allImages = [];
  let coverImage = "";
  let descriptionEn = "", descriptionCn = "";
  let textIdx = 0, imageIdx = 0;

  for (section of order) {
    let newBlock = {
      type: section
      // Optional fields:
      // contentEn, contentCn, url, imgName
    }
    if (section === 'text') {
      newBlock.contentEn = textEn[textIdx];
      newBlock.contentCn = textCn[textIdx];
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
      allImages.push(newBlock);
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

  let collectionString = req.body.type + "s";
  db.collection(collectionString).insertOne(post, function(err, result) {
    if (err) return next(err);
    res.redirect('/control/change');
  });
}

