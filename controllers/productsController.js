const productsService = require('../services/productsService');
const productsModel = require('../models/productsModel');

const getAllProducts = async (_req, res) => {
    const products = await productsModel.getAllProducts();
    res.status(200).json({ products });
};

const findProductById = async (req, res) => {
  const { id } = req.params; 
  const product = await productsService.findProductById(id);

  if (product.err) return res.status(422).json(product);
  res.status(200).json(product);
};

const addProduct = async (req, res) => {
  const { name, quantity } = req.body;

  const create = await productsService.addProduct(name, quantity);

  if (create.err) return res.status(422).json(create);

  res.status(201).json(create);
};

module.exports = {
  getAllProducts,
  findProductById,
  addProduct,
};
