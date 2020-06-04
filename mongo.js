const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });

var blogsCollection, projectsCollection;

module.exports = {
  connect: function(callback) {
    client.connect(function(err) {
      db = client.db('personal_site');
      blogsCollection = db.collection('blogs');
      projectsCollection = db.collection('projects');
      return callback(err);
    });
  },
  getBlogs: function() {
    return blogsCollection;
  },
  getProjects: function() {
    return projectsCollection;
  }
};