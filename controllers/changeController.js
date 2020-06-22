var mongo = require('../mongo');
var db = mongo.getDb();

var Post = require('../models/post');

exports.list = function(req, res, next) {
  if (req.body.type == "projects" || req.body.type == undefined) {
    db.collection("projects").find().toArray(function(err, projects) {
      if (err) return next(err);
      res.render('change', {
        posts: projects,
        type: 'project'
      });
    });
  } else if (req.body.type == "blogs") {
    db.collection("blogs").find().toArray(function(err, blogs) {
      if (err) return next(err);
      res.render('change', {
        posts: blogs,
        type: 'blog'
      });
    });
  }
}

exports.showForm = function(req, res, next) {
  db.collection('tags').find({title: {'$ne': 'not tagged'}}).toArray(function(err, tags) {
    if (err) return next(err);
    let collectionString = req.params.type + "s";
    db.collection(collectionString).findOne({_id: req.params.id}, function(err, post) {
      if (err) return next(err);
      let checkedTags = [];
      for (let i = 0; i < tags.length; i++) {
        let tagMatch = false;
        for (let j = 0; j < post.tags.length; j++) {
          if (post.tags[j] == tags[i].title) {
            tagMatch = true;
            break;
          }
        }
        checkedTags.push({title: tags[i].title, checked: tagMatch});
      }
      res.render('form', {
        title: 'Update existing post',
        tags: checkedTags,
        post: post
      });
    });
  });
}

exports.updateInDb = function(req, res, next) {  
  db.collection(req.params.type + "s").findOne({_id: req.params.id}, function(err, originalPost) {
    // PART 0: DEBUG LOGS
    console.log("files:")
    console.log(req.files);
    console.log("body:");
    console.log(req.body);
    console.log("original post:");
    console.log(originalPost);

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
    let textIdx = 0, imageIdx = 0, oldIdx = 0;

    for (section of order) {
      let newBlock = {}
      if (section === 'text') {
        newBlock.type = "text";
        newBlock.contentEn = textEn[textIdx];
        newBlock.contentCn = textCn[textIdx];
        if (textIdx === 0) {
          descriptionEn = newBlock.contentEn;
          descriptionCn = newBlock.contentCn;
        }
        textIdx++;
      } else if (section === 'image') {
        newBlock.type = "image";
        newBlock.url = '/images/' + req.files[imageIdx].filename;
        //newBlock.imgName = req.files[imageIdx].name
        if (imageIdx === 0 && oldIdx === 0) {
          coverImage = newBlock.url;
        }
        allImages.push(newBlock.url);
        imageIdx++;
      } else if (section === 'old') {
        newBlock.type = "image";
        newBlock.url = originalPost.images[oldIdx];
        if (imageIdx === 0 && oldIdx === 0) {
          coverImage = newBlock.url;
        }
        allImages.push(newBlock.url);
        oldIdx++;
      } else {
        var err = new Error('Undefined block type');
        err.status = 404;
        return next(err);
      }
      allBlocks.push(newBlock);
    }

    // PART 4: ADD PROJECT TO DATABASE
    let newPost = new Post({
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

    console.log("new post:");
    console.log(newPost);

    if (newPost.titleEn !== originalPost.titleEn || newPost.type !== originalPost.type) {      
      db.collection(originalPost.type + "s").deleteOne({_id: req.params.id}, function(err, result) {
        if (err) return next(err);
        // check result.deletedCount == 1
        db.collection(newPost.type + "s").insertOne(newPost, function(err, result) {
          if (err) return next(err);
          // check result.insertedCount == 1
          res.redirect('/control/change');
        });
      });
    } else {
      db.collection(newPost.type + "s").updateOne({_id: req.params.id}, {$set: newPost}, function(err, result) {
        if (err) return next(err);
        // check result.updatedCount == 1
        res.redirect('/control/change');
      });
    }
  });
}

exports.confirmation = function(req, res, next) {
  let collectionString = req.params.type + "s";
  db.collection(collectionString).findOne({_id: req.params.id},function(err, post) {
    if (err) return next(err);
    res.render('post_delete', {
      post: post
    });
  });
}

exports.removeFromDb = function(req, res, next) {
  if (req.body.result == "yes") {
    let collectionString = req.params.type + "s";
    db.collection(collectionString).deleteOne({_id: req.params.id}, function(err, result) {
      if (err) return next(err);
      if (result.deletedCount != 1) {
        var err = new Error('Incorrect deletedCount');
        err.status = 404;
        return next(err);
      }
      res.redirect('/control/change');
    });
  } else if (req.body.result == "no") {
    res.redirect('/control/change');
  }
}