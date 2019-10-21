/*
* mongodb is a lower lever mongoDB driver
* mongoose is much easier to use
*/

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';//use explicitly 127.0.0.1 instead of localhost (which is slow and buggy)
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('database connection error');
  }

  const db = client.db(databaseName);
  db.collection('users').insertOne({
    name: 'Gina Kui',
    email: 'developerkui@outlook.com'
  }, (error, result) => {
    if (error) {
      return console.log('Unable to insert the user');
    }
    console.log(result.ops);
  })
});