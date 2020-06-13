var mongo = require('../mongo');
var db = mongo.getDb();

var tagsCollection = db.collection('tags');
var projectsCollection = db.collection('projects');

var formidable = require('formidable');
var fs = require('fs');

var Project = require('../models/project');
const { text } = require('express');


exports.index = function(req, res, next) {
  tagsCollection.find({title: {'$ne': 'not tagged'}}).toArray(function(err, tags) {
    if (err) return next(err);
    res.render('create_form', {
      title: 'Create new post',
      page: 'home',
      tags: tags
    });
  });
}

exports.sendToDb = function(req, res, next) {

  console.log("files:")
  console.log(req.files);
  console.log("body:");
  console.log(req.body);

  // Manual text array conversion
  let text = req.body.text;
  if (!(req.body.text instanceof Array)) {
    text = new Array(req.body.text);
  }

  let allBlocks = [];
  let text_idx = 0;
  let image_idx = 0;
  for (section of req.body.order) {
    console.log(section);
    if (section === 'text') {
      allBlocks.push(text[text_idx]);
      text_idx++;
    } else if (section === 'image') {
      let imgURL = '/images/' + req.files[image_idx].filename;
      allBlocks.push(imgURL);
      image_idx++;
    } else {
      console.error("ERROR undefined order.")
      next();
    }
  }

  console.log(allBlocks);

  // Manual tags array conversion
  let tags = req.body.tags;
  if (!tags) {
    tags = new Array("not tagged");
  } else if (!(req.body.tags instanceof Array)) {
    tags = new Array(req.body.tags);
  }

  let project = new Project({
    title: req.body.title,
    tags: tags,
    description: req.body.description,
    blocks: allBlocks
  });

  projectsCollection.insertOne(project, function(err, result) {
    if (err) return next(err);
      res.redirect(project.url);
  });
}

