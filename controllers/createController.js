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

  // DEBUG LOGS
  /* console.log("files:")
  console.log(req.files);
  console.log("body:");
  console.log(req.body); */

  // Manual text array conversion
  let text = req.body.text;
  if (!(req.body.text instanceof Array)) {
    text = new Array(req.body.text);
  }

  let allBlocks = [];
  let coverImage = "";
  let text_idx = 0;
  let image_idx = 0;
  for (section of req.body.order) {
    let newBlock = {
      type: section,
      content: ""
    }
    if (section === 'text') {
      newBlock.content = text[text_idx];
      text_idx++;
    } else if (section === 'image') {
      newBlock.content = '/images/' + req.files[image_idx].filename;
      // In the future, allow the user to choose the cover image
      if (image_idx === 0) {
        coverImage = newBlock.content;
      }
      image_idx++;
    } else {
      console.error("ERROR undefined block type");
      return next();
    }
    allBlocks.push(newBlock);
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
    blocks: allBlocks,
    coverImage: coverImage
  });

  projectsCollection.insertOne(project, function(err, result) {
    if (err) return next(err);
      res.redirect(project.url);
  });
}

