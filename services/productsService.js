// const productsModel = require('../models/productsModel');

const {
  validateName,
  validateQuantity,
  quantityIsNumeric,
} = require('../middlewares/validationMiddleware');

// const productExists = async (name) => {
//   const exits = await productsModel.findProductByName(name);

//   if (exits) {
//     return {
//       err: {
//         code: 'invalid_data',
//         message: 'Product already exists',
//       },
//     };
//   }
//   return false;
// };

const addProduct = async (name, quantity) => {
  const isValidName = validateName(name);
  const isvalidQuantity = validateQuantity(quantity);
  const isNumeric = quantityIsNumeric(quantity);
  // const productExist = productExists(name);

  if (isValidName.err) return isValidName;
  if (isvalidQuantity.err) return isvalidQuantity;
  if (isNumeric.err) return isNumeric;
  // if (productExist.err) return productExist;

  // const add = await productsModel.create(name, quantity);
  // return add;
};

module.exports = {
  addProduct,
};
