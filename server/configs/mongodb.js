
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI

const client = new MongoClient(uri);
const database = client.db("GC1");

module.exports = { database };