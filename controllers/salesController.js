const salesService = require('../services/salesService');
const salesModel = require('../models/salesModel');

const getAllSales = async (_req, res) => {
  const sales = await salesModel.getAllSales();
  res.status(200).json({ sales });
};

const addSale = async (req, res) => {
  const sale = await salesService.addSale(req.body);
  console.log(sale);

  if (sale.err) return res.status(422).json(sale);

  res.status(200).json(sale);
};

module.exports = {
  getAllSales,
  addSale,
};
