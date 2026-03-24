const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

let db;

async function connectToDatabase() {
  await client.connect();
  db = client.db('startup');
  console.log('Connected to MongoDB');
}

function getDB() {
  return db;
}

module.exports = { connectToDatabase, getDB };