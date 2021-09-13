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
    return true;
}));

const addSale = async (saleData) => {
  const validateItems = await validateSale(saleData);

  const result = validateItems.find((item) => {
    if (!item) return item;
    return true;
  });

  if (result.err) return result;
  const sale = salesModel.create(saleData);
  return sale;
};

module.exports = {
  addSale,
};
