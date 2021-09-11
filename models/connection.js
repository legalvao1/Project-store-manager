const { MongoClient } = require('mongodb');
require('dotenv').config();

const { MONGO_DB_URL } = process.env || 'mongodb://127.0.0.1:27017';
const { DB_NAME } = process.env || 'StoreManager';

let schema = null;

async function getConnection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient
    .connect(MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => conn.db(DB_NAME))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = { getConnection };