const validateName = (name) => {
  if (!name || name.length < 5) {
    return { 
      err: { 
        code: 'invalid_data',
        message: '"name" length must be at least 5 characters long',
      },
    };
  }
  return true;
};

const validateQuantity = (quantity) => {
  if (!quantity || quantity <= 0) {
    return {
      err: {
        code: 'invalid_data',
        message: '"quantity" must be larger then or equal to 1',
      },
    };
  }
  return true;
};

const quantityIsNumeric = (quantity) => {
  if (typeof quantity !== 'number') {
    return {
      err: {
        code: 'invalid_data',
        message: '"quantity" must be a number',
      },
    };
  }
  return true;
};

module.exports = {
  validateName,
  validateQuantity,
  quantityIsNumeric,
};
