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

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  const update = await productsService.updateProduct(id, name, quantity);

  if (update.err) return res.status(422).json(update);

  res.status(200).json(update);
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const exclude = await productsService.deleteProduct(id);
  if (exclude.err) return res.status(422).json(exclude);

  res.status(200).json(exclude);
};

module.exports = {
  getAllProducts,
  findProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
