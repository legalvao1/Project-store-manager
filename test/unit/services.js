const sinon = require('sinon');
const { expect } = require('chai');
const { ObjectId } = require('mongodb');

const productsModel = require('../../models/productsModel');
const productsService = require('../../services/productsService');

const salesModel = require('../../models/salesModel');
const salesService = require('../../services/salesService');

describe('SERVICE - Busca um produto no BD pelo Id', () => {

  const example_id = '604cb554311d68f491ba5781';

  describe('quando não existe o produto cadastrado', () => {
    before(() => {
      sinon.stub(productsModel, 'findProductById')
        .resolves(null);
    });

    after(() => {
      productsModel.findProductById.restore();
    });

    it('retorna um object', async () => {
      const response = await productsService.findProductById(example_id);

      expect(response).to.include.keys('err');
    });
  });

  describe('quando existe nenhum produto cadastrado', () => {
    before(() => {
      sinon.stub(productsModel, 'findProductById')
        .resolves({_id: '604cb554311d68f491ba5781', name: 'example', quantity: 20 });
    });

    after(() => {
      productsModel.findProductById.restore();
    });

    it('retorna um object', async () => {
      const response = await productsService.findProductById(example_id);
      expect(response).to.be.an('object');
    });

    it('tais itens possui as propriedades: "_id", "name", "quantity"', async () => {
      const expected_response = {_id: '604cb554311d68f491ba5781', name: 'example', quantity: 20 };

      const response = await productsService.findProductById(example_id);
      expect(response).to.deep.equal(expected_response);
    });
  });
});

describe('SERVICE - Busca um produto no BD pelo nome', () => {

  const name_example = 'example';

  describe('quando não existe o produto cadastrado', () => {
    before(() => {
      sinon.stub(productsModel, 'findProductByName')
        .resolves(false);
    });

    after(() => {
      productsModel.findProductByName.restore();
    });

    it('retorna false', async () => {
      const response = await productsService.findProductByName(name_example);

      expect(response).to.be.false;
    });
  });

  describe('quando existe um produto cadastrado', () => {
    before(() => {
      sinon.stub(productsModel, 'findProductByName')
        .resolves(true);
    });

    after(() => {
      productsModel.findProductByName.restore();
    });

    it('retorna um err object', async () => {
      const response = await productsService.findProductByName(name_example);

      expect(response).to.include.keys('err');
    });

    it('tais itens possui as propriedades: "err"', async () => {
      const expected_response = {
        err: {
          code: 'invalid_data',
          message: 'Product already exists',
        },
      }
      const response = await productsService.findProductByName(name_example);

      expect(response).to.deep.equal(expected_response);
    });
  });
});

describe('SERVICE - Cadastra um produto', () => {
  const name = 'example';
  const quantity = 20 ;

  describe('Retorna erro caso produto seja invalido', () => {
    it('quando nome é inválido', async() => {

      const response = await productsService.addProduct('ex', 20);
      expect(response).to.include.keys('err')
    });

    it('quando quantidade é inválida', async() => {

      const response = await productsService.addProduct('example', '20');
      expect(response).to.include.keys('err')
    });
  });

  describe('Retorna um erro quando nome ja existe no banco', () => {
    before(() => {
      sinon.stub(productsModel, 'findProductByName').resolves(true);
      });

    after(() => {
      productsModel.findProductByName.restore();
    });

    it('Retorna um err object', async () => {
       const responseNameExists = await productsService.addProduct('example', 20);
    
      expect(responseNameExists).to.be.a('object');
    })
  })

  describe('Cadastra um produto válido', () => {
    const example_response = {
      _id: '604cb554311d68f491ba5781',
      name: 'example',
      quantity: 20,
    };
    
    before(() => {
      sinon.stub(productsModel, 'findProductByName').resolves(false);

      sinon.stub(productsModel, 'create')
        .resolves(example_response);
    });

    after(() => {
      productsModel.findProductByName.restore();
      productsModel.create.restore();
    });

    it ('testa se o retorno é um objeto', async () => {
      const response = await productsService.addProduct(name, quantity);
       
      expect(response).to.be.a('object');
    });
  
    it('testa se o objeto é igual ao esperado', async () => {
      const expected_response = {
        _id: '604cb554311d68f491ba5781',
        name: 'example',
        quantity: 20,
        };
  
      const response = await productsService.addProduct(name, quantity);
      expect(response).to.deep.equal(expected_response);
    });
  });
});

describe('SERVICE - Atualiza um produto pelo ID', () => {

  describe('quando atualiza o produto com sucesso', () => {

    const product = {
      _id: '604cb554311d68f491ba5781',
      name: 'example', 
      quantity: 20 
    }

    const update_product = {
      _id: '604cb554311d68f491ba5781',
      name: 'update_example', 
      quantity: 10 
    }

    before(() => {
      sinon.stub(productsModel, 'findProductById').resolves({
        _id: '604cb554311d68f491ba5781',
        name: 'update_example',
        quantity: 10
      });
      sinon.stub(productsModel, 'update').resolves(update_product);
    });

    after(() => {
      productsModel.findProductById.restore();
      productsModel.update.restore();
    });

    it('retorna um object', async () => {
      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.be.an('object');
    });

    it('tais itens possui as propriedades: "_id", "name", "quantity"', async () => {
      const expected_response = update_product;

      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.deep.equal(expected_response);
    });
  });

  describe('quando não encontra o produto', () => {

    const product = {
      _id: '604cb554311d68f491ba5781',
      name: 'example', 
      quantity: 20 
    }

    before(() => {
      sinon.stub(productsModel, 'findProductById').resolves({
        err: {
          code: 'invalid_data',
          message: 'Wrong id format',
        },
      });
    });

    after(() => {
      productsModel.findProductById.restore();
    });

    it('retorna um object', async () => {
      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.be.an('object');
    });

    it('tais itens possui as propriedades: "err"', async () => {
      const expected_response = {
        err: {
          code: 'invalid_data',
          message: 'Wrong id format',
        },
      };;

      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.deep.equal(expected_response);
    });
  });

  describe('quando nome é invalido', () => {

    const product = {
      _id: '604cb554311d68f491ba5781',
      name: 'exa', 
      quantity: 20 
    }

    before(() => {
      sinon.stub(productsModel, 'findProductById').resolves(product);
      sinon.stub(productsModel, 'update').resolves({
        err: {
          code: 'invalid_data',
          message: '"name" length must be at least 5 characters long',
        },
      });
    });

    after(() => {
      productsModel.findProductById.restore();
      productsModel.update.restore();
    });

    it('retorna um object', async () => {
      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.be.an('object');
    });

    it('tais itens possui as propriedades: "err"', async () => {
      const expected_response = {
        err: {
          code: 'invalid_data',
          message: '"name" length must be at least 5 characters long',
        },
      };;

      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.deep.equal(expected_response);
    });
  });

  describe('quando quantidade é invalida', () => {

    const product = {
      _id: '604cb554311d68f491ba5781',
      name: 'example', 
      quantity: -20 
    }

    before(() => {
      sinon.stub(productsModel, 'findProductById').resolves(product);
      sinon.stub(productsModel, 'update').resolves({
        err: {
          code: 'invalid_data',
          message: '"quantity" must be larger than or equal to 1',
        },
      });
    });

    after(() => {
      productsModel.findProductById.restore();
      productsModel.update.restore();
    });

    it('retorna um object', async () => {
      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.be.an('object');
    });

    it('tais itens possui as propriedades: "err"', async () => {
      const expected_response = {
        err: {
          code: 'invalid_data',
          message: '"quantity" must be larger than or equal to 1',
        },
      };;

      const response = await productsService.updateProduct(product._id, product.name, product.quantity);

      expect(response).to.deep.equal(expected_response);
    });
  });
});

describe('SERVICE - Deleta um produto pelo ID', () => {

  describe('quando deleta o produto com sucesso', () => {

    const product = {
      _id: '604cb554311d68f491ba5781',
      name: 'example', 
      quantity: 20 
    }

    before(() => {
      sinon.stub(productsModel, 'findProductById').resolves(product);
       sinon.stub(productsModel, 'exclude').resolves({ result: { ok: 1 } });
    });

    after(() => {
      productsModel.exclude.restore();
    });

    it('retorna um object', async () => {
      const response = await productsService.deleteProduct(product._id);
      console.log(response);

      expect(response).to.be.a('object');
    });

    it('tais itens possui as propriedades: "_id", "name", quantity', async () => {
      const expected_response = product;

      const response = await productsService.deleteProduct(product._id);

      expect(response).to.deep.equal(expected_response);
    });
  });
  
});
/////////////////////////////////////////////////
//sales
/////////////////////////////////////////////////

describe('SERVICE - Busca todas as vendas no BD pelo Id', () => {

  const sale_id_example = '604cb554311d68f491ba5781';

  describe('quando não existe a venda cadastrada', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById')
        .resolves(null);
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('retorna um err object', async () => {
      const response = await salesService.getSaleById(sale_id_example);

      expect(response).to.include.keys('err');
    });
  });

  describe('quando existe uma venda cadastrada', () => {
    before(() => {
      sinon.stub(salesModel, 'getSaleById')
        .resolves({
          _id: ObjectId('6140f7fe58c7fb340503bc6d'),
          itensSold: [
            { productId: '604cb554311d68f491ba5781', quantity: 10 },
            { productId: '604cb554311d68f491ba5782', quantity: 5 }
          ]
        });
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.getSaleById(sale_id_example);

      expect(response).to.be.an('object');
    });

    it('tais itens possui as propriedades: "_id", "itensSold"', async () => {
      const expected_response = {
        _id: ObjectId('6140f7fe58c7fb340503bc6d'),
        itensSold: [
          { productId: '604cb554311d68f491ba5781', quantity: 10 },
          { productId: '604cb554311d68f491ba5782', quantity: 5 }
        ]
      };

      const response = await salesService.getSaleById(sale_id_example);

      expect(response).to.deep.equal(expected_response);
    });
  });
});

describe('SERVICE - Cadastra uma venda no BD', () => {

  const sales_example = [
    { productId: '604cb554311d68f491ba5781', quantity: 10 },
    { productId: '604cb554311d68f491ba5782', quantity: 5 },
  ]

  describe('Quando a venda é criada com sucesso', () => {

    const response_sale_example = {
      _id: '6140f7fe58c7fb340503bc6d',
      itensSold: [
        { productId: '604cb554311d68f491ba5781', quantity: 10 },
        { productId: '604cb554311d68f491ba5782', quantity: 5 }
      ]
    }

    before(() => {
      sinon.stub(salesModel, 'create')
        .resolves(response_sale_example);
    });

    after(() => {
      salesModel.create.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.addSale(sales_example);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "_id", "itensSold"', async () => {
      const response = await salesService.addSale(sales_example);

      expect(response).to.include.keys('_id', 'itensSold');
    });
  });

  describe('Quando a venda não é criada', () => {
    const err_example = [
      { productId: '604cb554311d68f491ba57', quantity: '10' },
      { productId: '604cb554311d68f491ba5782', quantity: -1 },
    ]

    const response_err_example = {
      err: {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      },
    };

    before(() => {
      sinon.stub(salesModel, 'create')
        .resolves(response_err_example);
    });

    after(() => {
      salesModel.create.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.addSale(err_example);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "err"', async () => {
      const response = await salesService.addSale(err_example);

      expect(response).to.include.keys('err');
    });
  });

  describe('Quando não tem estoque', () => {
    const sale_example = [
      { productId: '604cb554311d68f491ba5781', quantity: 100 },
      { productId: '604cb554311d68f491ba5782', quantity: 100 },
    ]

    const response_err_stock = {
      err: {
        code: 'stock_problem',
        message: 'Such amount is not permitted to sell',
      },
    };

    before(() => {
      sinon.stub(salesModel, 'create')
        .resolves(response_err_stock);
    });

    after(() => {
      salesModel.create.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.addSale(sale_example);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "err"', async () => {
      const response = await salesService.addSale(sale_example);

      expect(response).to.include.keys('err');
    });
  });

});


describe('SERVICE - Atualiza uma venda no BD', () => {

  const id_example = '6140f7fe58c7fb340503bc6d';
  const update_data = [
    { productId: '604cb554311d68f491ba5781', quantity: 20 },
    { productId: '604cb554311d68f491ba5782', quantity: 15 },
  ]

  const sale_example = {
    _id: '6140f7fe58c7fb340503bc6d',
    itensSold: [
      { productId: '604cb554311d68f491ba5781', quantity: 20 },
      { productId: '604cb554311d68f491ba5782', quantity: 15 }
    ]
  }

  describe('Quando a venda é atualizada com sucesso', () => {

    const response_sale_update = {
      _id: '6140f7fe58c7fb340503bc6d',
      itensSold: [
        { productId: '604cb554311d68f491ba5781', quantity: 20 },
        { productId: '604cb554311d68f491ba5782', quantity: 15 }
      ]
    }

    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves(sale_example);

      sinon.stub(salesModel, 'update')
        .resolves(response_sale_update);
    });

    after(() => {
      salesModel.getSaleById.restore();
      salesModel.update.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.updateSale(id_example,update_data);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "_id", "itensSold"', async () => {
      const response = await salesService.updateSale(id_example, update_data);

      expect(response).to.deep.equal(response_sale_update);
    });
  });

  describe('Quando a não venda a ser atualizada não é encontrada', () => {

    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves({
        err: {
          code: 'not_found',
          message: 'Sale not found',
        },
      });
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.updateSale(id_example,update_data);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "err", ', async () => {
      const response = await salesService.updateSale(id_example, update_data);

      expect(response).to.deep.equal({
        err: {
          code: 'not_found',
          message: 'Sale not found',
        },
      });
    });
  });

  describe('Quando a não venda a ser atualizada não tem itens válidos', () => {

    const response_sale_update = {
      _id: '6140f7fe58c7fb340503bc6d',
      itensSold: [
        { productId: '604cb554311d68f491ba57', quantity: '20' },
        { productId: '604cb554311d68f491ba5782', quantity: 15 }
      ]
    }

    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves(response_sale_update);
    });

    after(() => {
      salesModel.getSaleById.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.updateSale(response_sale_update.id,response_sale_update.itensSold);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "err", ', async () => {
      const response = await salesService.updateSale(response_sale_update.id,response_sale_update.itensSold);

      expect(response).to.deep.equal({
        err: {
          code: 'invalid_data',
          message: 'Wrong product ID or invalid quantity',
        },
      });
    });
  });
});

describe('SERVICE - Deleta uma venda no BD', () => {

  const id_example = '6140f7fe58c7fb340503bc6d';

  const sale_example = {
    _id: '6140f7fe58c7fb340503bc6d',
    itensSold: [
      { productId: '604cb554311d68f491ba5781', quantity: 20 },
      { productId: '604cb554311d68f491ba5782', quantity: 15 }
    ]
  }

  describe('Quando a venda é deletada com sucesso', () => {

    const response_sale_delete = {
      _id: '6140f7fe58c7fb340503bc6d',
      itensSold: [
        { productId: '604cb554311d68f491ba5781', quantity: 20 },
        { productId: '604cb554311d68f491ba5782', quantity: 15 }
      ]
    }

    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves(sale_example);

      sinon.stub(salesModel, 'exclude')
        .resolves({ result: {ok: 1 } });
    });

    after(() => {
      salesModel.getSaleById.restore();
      salesModel.exclude.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.deleteSale(id_example);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "_id", "itensSold"', async () => {
      const response = await salesService.deleteSale(id_example);

      expect(response).to.deep.equal(response_sale_delete);
    });
  });

  describe('Quando a venda não é encontrada', () => {

    const response_err_delete ={
      err: {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
      },
    };

    before(() => {
      sinon.stub(salesModel, 'getSaleById').resolves(null);

      sinon.stub(salesModel, 'exclude')
        .resolves(response_err_delete);
    });

    after(() => {
      salesModel.getSaleById.restore();
      salesModel.exclude.restore();
    });

    it('retorna um object', async () => {
      const response = await salesService.deleteSale(id_example);

      expect(response).to.be.a('object');
    });

    it('O objeto contém as chaves "err"', async () => {
      const response = await salesService.deleteSale(id_example);

      expect(response).to.include.keys('err');
    });
  });
});





