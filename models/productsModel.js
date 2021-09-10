const mongoConnection = require('./connection');

const findProductByName = async (name) => {
  const db = await mongoConnection.getConnection();
  const product = await db.collection('products').findOne({ name });
  
  return product !== null;
};

const create = async (name, quantity) => {
  const productsCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('products'));

    const { insertedId: _id } = await productsCollection
    .insertOne({ name, quantity });

  return { _id, name, quantity };
};

module.exports = {
    findProductByName,
    create,
};
