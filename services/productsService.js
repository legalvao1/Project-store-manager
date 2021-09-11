const productsModel = require('../models/productsModel');

const {
  validateName,
  validateQuantity,
  quantityIsNumeric,
} = require('../middlewares/validationMiddleware');

const findProductById = async (id) => {
  const product = await productsModel.findProductById(id);

  if (!product) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    };
  }
  return product;
};

const productExists = async (name) => {
  const exists = await productsModel.findProductByName(name);

  if (exists) {
    return {
      err: {
        code: 'invalid_data',
        message: 'Product already exists',
      },
    };
  }
  return false;
};

const addProduct = async (name, quantity) => {
  const isValidName = validateName(name);
  const isvalidQuantity = validateQuantity(quantity);
  const isNumeric = quantityIsNumeric(quantity);
  const productExist = await productExists(name);

  if (isValidName.err) return isValidName;
  if (isvalidQuantity.err) return isvalidQuantity;
  if (isNumeric.err) return isNumeric;
  if (productExist.err) return productExist;

  const add = await productsModel.create(name, quantity);
  return add;
};

const updateProduct = async (id, name, quantity) => {
  const productExist = await findProductById(id);
  if (productExist.err) return productExist;
  if (validateName(name).err) return validateName(name);
  if (validateQuantity(quantity).err) return validateQuantity(quantity);
  if (quantityIsNumeric(quantity).err) return quantityIsNumeric(name);
 
  const update = await productsModel.update(id, name, quantity);
  return update;
};

module.exports = {
  addProduct,
  findProductById,
  updateProduct,
};
