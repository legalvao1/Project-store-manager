const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

const getAllProducts = async () => {
  const db = await getConnection();
  const productsCollection = await db.collection('products').find().toArray();
  return productsCollection;
};

const findProductById = async (id) => {
  if (!ObjectId.isValid(id)) return false;
  const db = await getConnection();
  const product = await db.collection('products').findOne({ _id: ObjectId(id) });
  return product;
};

const findProductByName = async (name) => {
  const db = await getConnection();
  const product = await db.collection('products').findOne({ name });
  
  return product !== null;
};

const create = async (name, quantity) => {
  const productsCollection = await getConnection()
    .then((db) => db.collection('products'));

    const { insertedId: _id } = await productsCollection
    .insertOne({ name, quantity });

  return { _id, name, quantity };
};

const update = async (id, name, quantity) => {
  if (!ObjectId.isValid(id)) return false;

  const db = await getConnection();
  await db.collection('products').updateOne(
    { _id: ObjectId(id) }, { $set: { name, quantity } },
    );
  return { id, name, quantity };
};

module.exports = {
  getAllProducts,
  findProductById,
  findProductByName,
  create,
  update,
};
