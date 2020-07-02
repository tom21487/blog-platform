var mongo = require('../mongo');
var db = mongo.getDb();

var Post = require('../models/post');

exports.list = function(req, res, next) {
  db.collection(req.params.type + "s").find().toArray(function(err, posts) {
    if (err) return next(err);
    res.render('change', {
      title: "Change existing " + req.params.type,
      posts: posts,
      type: req.params.type
    });
  });
}

exports.showForm = async function(req, res, next) {
  try {
    let findPost = db.collection(req.params.type + "s").findOne({_id: req.params.id});
    let findTags = db.collection('tags').find({name: {'$ne': 'not tagged'}}).toArray();
    let [post, tags] = await Promise.all([findPost, findTags]);

    // Convert post.tags[i] from an ObjectID into a string (name)
    let postTagNames = [];
    for (let i = 0; i < post.tags.length; i++) {
      let postTag = await db.collection("tags").findOne({_id: post.tags[i] });
      postTagNames.push(postTag.name);
    }    

    // Find which tags are checked
    let checkedTags = [];
    for (let i = 0; i < tags.length; i++) {
      let tagMatch = false;
      for (let j = 0; j < postTagNames.length; j++) {
        if (tags[i].name == postTagNames[j]) {
          tagMatch = true;
          break;
        }
      }
      checkedTags.push({
        _id: tags[i]._id,
        name: tags[i].name,
        checked: tagMatch
      });
    }
    
    res.render('post_form', {
      title: 'Update existing post',
      tags: checkedTags,
      post: post
    });
  } catch(err) {
    return next(err);
  }
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
    let tags = [];
    if (!req.body.tags) {
      console.log("This should be changed after deployment.");
      tags = new Array(mongo.getObjectID("5efae5553d85b4652872481f"));
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
    let textIdx = 0, imageIdx = 0, oldIdx = 0;

    for (section of req.body.order) {
      let newBlock = {}
      if (section === 'text') {
        newBlock.type = "text";
        newBlock.contentEn = req.body.textEn[textIdx];
        newBlock.contentCn = req.body.textCn[textIdx];
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
      db.collection(originalPost.type).deleteOne({_id: req.params.id}, function(err, result) {
        if (err) return next(err);
        // check result.deletedCount == 1
        db.collection(newPost.type).insertOne(newPost, function(err, result) {
          if (err) return next(err);
          // check result.insertedCount == 1
          res.redirect('/control/change');
        });
      });
    } else {
      db.collection(newPost.type).updateOne({_id: req.params.id}, {$set: newPost}, function(err, result) {
        if (err) return next(err);
        // check result.updatedCount == 1
        res.redirect('/control/change');
      });
    }
  });
}

exports.selectType = function(req, res, next) {
  res.render('select_type');
}

exports.confirmation = function(req, res, next) {
  let collectionString = req.params.type + "s";
  db.collection(collectionString).findOne({_id: req.params.id}, function(err, post) {
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
      res.redirect(`/control/change/${req.params.type}`);
    });
  } else if (req.body.result == "no") {
    res.redirect(`/control/change/${req.params.type}`);
  }
}