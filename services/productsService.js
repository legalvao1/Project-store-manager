const productsModel = require('../models/productsModel');

const {
  validateName,
  validateQuantity,
  validateProductExists,
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

const addProduct = async (name, quantity) => {
  const isValidName = validateName(name);
  const isvalidQuantity = validateQuantity(quantity);
  const productExist = await validateProductExists(name);

  if (isValidName.err) return isValidName;
  if (isvalidQuantity.err) return isvalidQuantity;
  if (productExist.err) return productExist;

  const add = await productsModel.create(name, quantity);
  return add;
};

const updateProduct = async (id, name, quantity) => {
  const productExist = await findProductById(id);
  if (productExist.err) return productExist;
  if (validateName(name).err) return validateName(name);
  if (validateQuantity(quantity).err) return validateQuantity(quantity);
 
  const update = await productsModel.update(id, name, quantity);
  return update;
};

const deleteProduct = async (id) => {
  const productExist = await findProductById(id);
  if (productExist.err) return productExist;

  const exclude = await productsModel.exclude(id);
  if (exclude.result.ok) return productExist;
};

module.exports = {
  addProduct,
  findProductById,
  updateProduct,
  deleteProduct,
};
