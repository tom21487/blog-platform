const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });

var db;

module.exports = {
  connect: function(callback) {
    client.connect(function(err) {
      db = client.db('personal_site');
      return callback(err);
    });
  },
  getDb: function() {
    return db;
  },
  close: function(callback) {
    client.close(function() {
      return callback();
    });
  }
};