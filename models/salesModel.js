// const { ObjectId } = require('mongodb');
const { getConnection } = require('./connection');

const getAllSales = async () => {
  const db = await getConnection();
  const salesCollection = await db.collection('sales').find().toArray();
  return salesCollection;
};

const create = async (salesData) => {
  const salesCollection = await getConnection()
    .then((db) => db.collection('sales'));

    const { insertedId: _id } = await salesCollection
    .insertOne({ itensSold: salesData });

  return { _id, itensSold: salesData };
};

module.exports = {
  getAllSales,
  create,
};
