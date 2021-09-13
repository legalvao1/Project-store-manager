const salesService = require('../services/salesService');
const salesModel = require('../models/salesModel');

const getAllSales = async (_req, res) => {
  const sales = await salesModel.getAllSales();
  res.status(200).json({ sales });
};

const getSaleById = async (req, res) => {
  const { id } = req.params; 
  const sale = await salesService.getSaleById(id);

  if (sale.err) return res.status(404).json(sale);
  res.status(200).json(sale);
};

const addSale = async (req, res) => {
  const sale = await salesService.addSale(req.body);

  if (sale.err) return res.status(422).json(sale);

  res.status(200).json(sale);
};

const updateSale = async (req, res) => {
  const { id } = req.params;
  const sale = await salesService.updateSale(id, req.body);

  if (sale.err) return res.status(422).json(sale);

  res.status(200).json(sale);
};

const deleteSale = async (req, res) => {
  const { id } = req.params;
  const sale = await salesService.deleteSale(id);

  if (sale.err) return res.status(422).json(sale);

  res.status(200).json(sale);
};

module.exports = {
  getAllSales,
  getSaleById,
  addSale,
  updateSale,
  deleteSale,
};
