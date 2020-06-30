const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
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
    if (!db || !client.isConnected()) {
      console.error("Connection has been unexpectedly closed, unable to return database!");
      return;
    }
    return db;
  },
  close: function(callback) {
    client.close(false, function() {
      return callback();
    });
  },
  getObjectID: function(string) {
    return new ObjectID(string);
  }
};