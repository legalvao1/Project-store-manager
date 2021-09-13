const productsService = require('./productsService');
const salesModel = require('../models/salesModel');

const {
  validateQuantity,
} = require('../middlewares/validationMiddleware');

const validateSale = async (saleData) => 
  Promise.all(saleData.map(async ({ productId, quantity }) => {
    const productIsValid = await productsService.findProductById(productId);
    const quantityIsValid = validateQuantity(quantity);
    if (productIsValid.err || quantityIsValid.err) {
      return {
        err: {
          code: 'invalid_data',
          message: 'Wrong product ID or invalid quantity',
        },
      };
    }
    return productIsValid;
}));

const decreaseInventory = (saleProducts) => {
  saleProducts.forEach(async ({ productId, quantity }) => {
    const product = await productsService.findProductById(productId);
    const newQuantity = product.quantity - quantity;
    await productsService.updateProduct(productId, product.name, newQuantity);
  });
};

const increaseInventory = (saleProducts) => {
  saleProducts.forEach(async ({ productId, quantity }) => {
    const product = await productsService.findProductById(productId);
    const newQuantity = product.quantity + quantity;
    await productsService.updateProduct(productId, product.name, newQuantity);
  });
};

const addSale = async (saleData) => {
  const validateItems = await validateSale(saleData);
   const result = validateItems.find((item) => {
    if (!item) return item;
    return true; 
  });

  if (result.err) return result;
  const sale = salesModel.create(saleData);
  decreaseInventory(saleData);

  return sale;
};

const getSaleById = async (id) => {
  const sale = await salesModel.getSaleById(id);

  if (!sale) {
    return {
      err: {
        code: 'not_found',
        message: 'Sale not found',
      },
    };
  }
  return sale;
};

const updateSale = async (id, salesData) => {
  const saleExist = await getSaleById(id);
  if (saleExist.err) return saleExist;

  const validateItems = await validateSale(salesData);
  const result = validateItems.find((item) => {
    if (!item) return item;
    return true;
  });
  if (result.err) return result;

  const update = await salesModel.update(id, salesData);
  return update;
};

const deleteSale = async (id) => {
  const saleExist = await getSaleById(id);
  if (saleExist.err) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
      },
    };
  }

  const saleProducts = saleExist.itensSold;
  await increaseInventory(saleProducts);
  
  const exclude = await salesModel.exclude(id);

  if (exclude.result.ok) return saleExist;
};

module.exports = {
  addSale,
  getSaleById,
  updateSale,
  deleteSale,
};
