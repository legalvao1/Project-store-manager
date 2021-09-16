const sinon = require('sinon');
const { expect } = require('chai');

const productsController = require('../../controllers/productsController');
const productsService = require('../../services/productsService');
const productsModel = require('../../models/productsModel');

const salesController = require('../../controllers/salesController');
const salesService = require('../../services/salesService');
const salesModel = require('../../models/salesModel');

describe('CONTROLLER - busca por todos os produtos no banco', () => {
  describe('quando não existem produtos cadastrados no banco de dados', async () => {
      const response = {};
      const request = {};

      before(() => {
          request.body = {};

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsModel, 'getAllProducts').resolves([]);
      })

      after(() => {
        productsModel.getAllProducts.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await productsController.getAllProducts(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await productsController.getAllProducts(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto products com array vazia', async () => {
          await productsController.getAllProducts(request, response);

          expect(response.json.calledWith({ products: [] })).to.be.equal(true);
      });
  });

  describe('quando existem produtos cadastrados no banco de dados', async () => {
      const response = {};
      const request = {};


      const products = [
          {
              id: '604cb554311d68f491ba5781',
              name: 'example',
              quantity: 20,
          }
      ]

      before(() => {
          request.body = {};

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsModel, 'getAllProducts').resolves(products);
      })

      after(() => {
        productsModel.getAllProducts.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await productsController.getAllProducts(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await productsController.getAllProducts(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto products com array com produtos', async () => {
          await productsController.getAllProducts(request, response);

          expect(response.json.calledWith({products})).to.be.equal(true);
      });
  });

});

describe('CONTROLLER - busca um produto pelo Id', () => {
  describe('quando não existe o produto', async () => {
      const response = {};
      const request = {};

      before(() => {
          request.params = { id: '604cb554311d68f491ba5781' };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsService, 'findProductById').resolves({
            err: {
              code: 'invalid_data',
              message: 'Wrong id format',
            },
          });
      })

      after(() => {
        productsService.findProductById.restore();
      })

      it('é chamado o método "status" passando o código 422', async () => {
          await productsController.findProductById(request, response);

          expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await productsController.findProductById(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto err', async () => {
          await productsController.findProductById(request, response);

          const err_response = {
            err: {
              code: 'invalid_data',
              message: 'Wrong id format',
            },
          }
          expect(response.json.calledWith(err_response)).to.be.equal(true);
      });
  });

  describe('quando existem produtos cadastrados no banco de dados', async () => {
      const response = {};
      const request = {};


      const product =  {
        _id: '604cb554311d68f491ba5781',
        name: 'example',
        quantity: 20,
      }    

      before(() => {
        request.params = { id: '604cb554311d68f491ba5781' };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsService, 'findProductById').resolves(product);
      })

      after(() => {
        productsService.findProductById.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await productsController.findProductById(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await productsController.findProductById(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto com o produto', async () => {
          await productsController.findProductById(request, response);

          expect(response.json.calledWith(product)).to.be.equal(true);
      });
  });

});

describe('CONTROLLER - Cadastra um produto no banco', () => {
  describe('quando produto não é cadastrado com sucesso', async () => {
      const response = {};
      const request = {};

      before(() => {
          request.body = { name: 'exa', quantity: 20 };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsService, 'addProduct').resolves({
            err: {
              code: 'invalid_data',
              message: '"name" length must be at least 5 characters long',
            },
          });
      })

      after(() => {
        productsService.addProduct.restore();
      })

      it('é chamado o método "status" passando o código 422', async () => {
          await productsController.addProduct(request, response);

          expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await productsController.addProduct(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto err', async () => {
          await productsController.addProduct(request, response);

          const err_response = {
            err: {
              code: 'invalid_data',
              message: '"name" length must be at least 5 characters long',
            },
          }
          expect(response.json.calledWith(err_response)).to.be.equal(true);
      });
  });

  describe('quando produto é cadastrado com sucesso', async () => {
      const response = {};
      const request = {};


      const product =  {
        _id: '604cb554311d68f491ba5781',
        name: 'example',
        quantity: 20,
      }    

      before(() => {
        request.body = { name: 'example', quantity: 20 };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsService, 'addProduct').resolves(product);
      })

      after(() => {
        productsService.addProduct.restore();
      })

      it('é chamado o método "status" passando o código 201', async () => {
          await productsController.addProduct(request, response);

          expect(response.status.calledWith(201)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await productsController.addProduct(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto com o produto', async () => {
          await productsController.addProduct(request, response);

          expect(response.json.calledWith(product)).to.be.equal(true);
      });
  });
});

describe('CONTROLLER - Atualiza um produto no banco', () => {
  describe('quando produto não é cadastrado com sucesso', async () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '604cb554311d68f491ba57' };
        request.body = { name: 'example_update', quantity: 10 };

        response.status = sinon.stub()
            .returns(response);
        response.json = sinon.stub()
            .returns();

        sinon.stub(productsService, 'updateProduct').resolves({
          err: {
            code: 'invalid_data',
            message: 'Wrong id format',
          },
        });
      })

      after(() => {
        productsService.updateProduct.restore();
      })

      it('é chamado o método "status" passando o código 422', async () => {
          await productsController.updateProduct(request, response);

          expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await productsController.updateProduct(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto err', async () => {
          await productsController.updateProduct(request, response);

          const err_response = {
            err: {
              code: 'invalid_data',
              message: 'Wrong id format',
            },
          }
          expect(response.json.calledWith(err_response)).to.be.equal(true);
      });
  });

  describe('quando produto é atualizado com sucesso', async () => {
      const response = {};
      const request = {};


      const product =  {
        _id: '604cb554311d68f491ba5781',
        name: 'example_update',
        quantity: 10,
      }    

      before(() => {
        request.params = { id: '604cb554311d68f491ba5781' };
        request.body = { name: 'example_update', quantity: 10 };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsService, 'updateProduct').resolves(product);
      })

      after(() => {
        productsService.updateProduct.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await productsController.updateProduct(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await productsController.updateProduct(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto com o produto atualizado', async () => {
          await productsController.updateProduct(request, response);

          expect(response.json.calledWith(product)).to.be.equal(true);
      });
  });
});

describe('CONTROLLER - Deleta um produto no banco', () => {
  describe('quando produto não é deletado com sucesso', async () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '604cb554311d68f491ba57' };

        response.status = sinon.stub()
            .returns(response);
        response.json = sinon.stub()
            .returns();

        sinon.stub(productsService, 'deleteProduct').resolves({
          err: {
            code: 'invalid_data',
            message: 'Wrong id format',
          },
        });
      })

      after(() => {
        productsService.deleteProduct.restore();
      })

      it('é chamado o método "status" passando o código 422', async () => {
          await productsController.deleteProduct(request, response);

          expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await productsController.deleteProduct(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto err', async () => {
          await productsController.deleteProduct(request, response);

          const err_response = {
            err: {
              code: 'invalid_data',
              message: 'Wrong id format',
            },
          }
          expect(response.json.calledWith(err_response)).to.be.equal(true);
      });
  });

  describe('quando produto é deletado com sucesso', async () => {
      const response = {};
      const request = {};


      const product =  {
        _id: '604cb554311d68f491ba5781',
        name: 'example_update',
        quantity: 10,
      }    

      before(() => {
        request.params = { id: '604cb554311d68f491ba5781' };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(productsService, 'deleteProduct').resolves(product);
      })

      after(() => {
        productsService.deleteProduct.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await productsController.deleteProduct(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await productsController.deleteProduct(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto com o produto deletado', async () => {
          await productsController.deleteProduct(request, response);

          expect(response.json.calledWith(product)).to.be.equal(true);
      });
  });
});

//////////////////////////////////////////////////////////////////////////////

describe('CONTROLLER - busca por todos as vendas no banco', () => {
  describe('quando não existem vendas cadastradas no banco de dados', async () => {
      const response = {};
      const request = {};

      before(() => {
          request.body = {};

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(salesModel, 'getAllSales').resolves([]);
      })

      after(() => {
        salesModel.getAllSales.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await salesController.getAllSales(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await salesController.getAllSales(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto sales com array vazia', async () => {
          await salesController.getAllSales(request, response);

          expect(response.json.calledWith({ sales: [] })).to.be.equal(true);
      });
  });

  describe('quando existem vendas cadastradas no banco de dados', async () => {
      const response = {};
      const request = {};

      const sales = [
        {
          _id: ObjectId('6140f7fe58c7fb340503bc6d'),
          itensSold: [
            { productId: '604cb554311d68f491ba5781', quantity: 10 },
            { productId: '604cb554311d68f491ba5782', quantity: 5 }
          ]
        }
      ];

      before(() => {
          request.body = {};

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(salesModel, 'getAllSales').resolves(sales);
      })

      after(() => {
        salesModel.getAllSales.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await salesController.getAllSales(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await salesController.getAllSales(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto products com array com produtos', async () => {
          await salesController.getAllSales(request, response);

          expect(response.json.calledWith({ sales })).to.be.equal(true);
      });
  });
});

describe('CONTROLLER - busca um venda pelo Id', () => {
  describe('quando não existe a venda', async () => {
      const response = {};
      const request = {};

      before(() => {
          request.params = { id: '604cb554311d68f491ba' };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(salesService, 'getSaleById').resolves({
            err: {
              code: 'invalid_data',
              message: 'Wrong product ID or invalid quantity',
            },
          });
      })

      after(() => {
        salesService.getSaleById.restore();
      })

      it('é chamado o método "status" passando o código 404', async () => {
          await salesController.getSaleById(request, response);

          expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await salesController.getSaleById(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto err', async () => {
          await salesController.getSaleById(request, response);

          const err_response = {
            err: {
              code: 'invalid_data',
              message: 'Wrong product ID or invalid quantity',
            },
          }
          expect(response.json.calledWith(err_response)).to.be.equal(true);
      });
  });

  describe('quando existe a venda cadastrada no banco de dados', async () => {
      const response = {};
      const request = {};


      const sale =  {
        _id: '6140f7fe58c7fb340503bc6d',
        itensSold: [
          { productId: '604cb554311d68f491ba5781', quantity: 10 },
          { productId: '604cb554311d68f491ba5782', quantity: 5 }
        ]
      }

      before(() => {
        request.params = { id: '6140f7fe58c7fb340503bc6d' };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(salesService, 'getSaleById').resolves(sale);
      })

      after(() => {
        salesService.getSaleById.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await salesController.getSaleById(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await salesController.getSaleById(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto com a venda', async () => {
          await salesController.getSaleById(request, response);

          expect(response.json.calledWith(sale)).to.be.equal(true);
      });
  });

});

describe('CONTROLLER - Cadastra uma venda no banco', () => {
  describe('quando a venda não é cadastrada com sucesso', async () => {
      const response = {};
      const request = {};
      const sales_example = [
        { productId: '604cb554311d68f491ba57', quantity: 10 },
        { productId: '604cb554311d68f491ba5782', quantity: '5' },
      ]

      before(() => {
          request.body = { sales_example };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(salesService, 'addSale').resolves({
            err: {
              code: 'invalid_data',
              message: 'Wrong product ID or invalid quantity',
            },
          });
      })

      after(() => {
        salesService.addSale.restore();
      })

      it('é chamado o método "status" passando o código 422', async () => {
          await salesController.addSale(request, response);

          expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await salesController.addSale(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto err', async () => {
          await salesController.addSale(request, response);

          const err_response = {
            err: {
              code: 'invalid_data',
              message: 'Wrong product ID or invalid quantity',
            },
          }
          expect(response.json.calledWith(err_response)).to.be.equal(true);
      });
  });

  describe('quando a venda não é cadastrada por problemas no estoque', async () => {
    const response = {};
    const request = {};
    const sales_example = [
      { productId: '604cb554311d68f491ba5781', quantity: 100 },
      { productId: '604cb554311d68f491ba5782', quantity: 50 },
    ]

    before(() => {
        request.body = { sales_example };

        response.status = sinon.stub()
            .returns(response);
        response.json = sinon.stub()
            .returns();

        sinon.stub(salesService, 'addSale').resolves({
          err: {
            code: 'stock_problem',
            message: 'Such amount is not permitted to sell',
          },
        });
    })

    after(() => {
      salesService.addSale.restore();
    })

    it('é chamado o método "status" passando o código 404', async () => {
        await salesController.addSale(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto', async () => {
        await salesController.addSale(request, response);

        expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto err', async () => {
        await salesController.addSale(request, response);

        const err_response = {
          err: {
            code: 'stock_problem',
            message: 'Such amount is not permitted to sell',
          },
        }
        expect(response.json.calledWith(err_response)).to.be.equal(true);
    });
});

  describe('quando a venda é cadastrada com sucesso', async () => {
      const response = {};
      const request = {};


      const sales_example = [
        { productId: '604cb554311d68f491ba57', quantity: 10 },
        { productId: '604cb554311d68f491ba5782', quantity: '5' },
      ];

      const sales_response = {
        _id: '6140f7fe58c7fb340503bc6d',
        itensSold: [
          { productId: '604cb554311d68f491ba5781', quantity: 10 },
          { productId: '604cb554311d68f491ba5782', quantity: 5 }
        ]
      };

      before(() => {
        request.body = { sales_example };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(salesService, 'addSale').resolves(sales_response);
      })

      after(() => {
        salesService.addSale.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await salesController.addSale(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await salesController.addSale(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto com a venda', async () => {
          await salesController.addSale(request, response);

          expect(response.json.calledWith(sales_response)).to.be.equal(true);
      });
  });
});

describe('CONTROLLER - Atualiza uma venda no banco', () => {
  describe('quando a venda não é atualizada', async () => {
    const response = {};
    const request = {};

    const id_example = '6140f7fe58c7fb340503bc';
    const update_items = [
      { productId: '604cb554311d68f491ba5781', quantity: 15 },
      { productId: '604cb554311d68f491ba5782', quantity: 50}
    ]

    before(() => {
      request.params = { id: id_example };
      request.body = { update_items };

      response.status = sinon.stub()
          .returns(response);
      response.json = sinon.stub()
          .returns();

      sinon.stub(salesService, 'updateSale').resolves({
        err: {
          code: 'not_found',
          message: 'Sale not found',
        },
      });
    })

    after(() => {
      salesService.updateSale.restore();
    })

    it('é chamado o método "status" passando o código 422', async () => {
        await salesController.updateSale(request, response);

        expect(response.status.calledWith(422)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto', async () => {
        await salesController.updateSale(request, response);

        expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto err', async () => {
        await salesController.updateSale(request, response);

        const err_response = {
          err: {
            code: 'not_found',
            message: 'Sale not found',
          },
        }
        expect(response.json.calledWith(err_response)).to.be.equal(true);
    });
  });

  describe('quando a venda é atualizada com sucesso', async () => {
    const response = {};
    const request = {};

    const id_example = '6140f7fe58c7fb340503bc6d';
    const update_items = [
      { productId: '604cb554311d68f491ba5781', quantity: 15 },
      { productId: '604cb554311d68f491ba5782', quantity: 50}
    ]

    const expected_response = {
      _id: '6140f7fe58c7fb340503bc6d',
      itensSold: [
        { productId: '604cb554311d68f491ba5781', quantity: 15 },
        { productId: '604cb554311d68f491ba5782', quantity: 50 }
      ]
    };

    before(() => {
      request.params = { id: id_example };
      request.body = { update_items };

        response.status = sinon.stub()
            .returns(response);
        response.json = sinon.stub()
            .returns();

        sinon.stub(salesService, 'updateSale').resolves(expected_response);
    })

    after(() => {
      salesService.updateSale.restore();
    })

    it('é chamado o método "status" passando o código 200', async () => {
        await salesController.updateSale(request, response);

        expect(response.status.calledWith(200)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um object', async () => {
        await salesController.updateSale(request, response);

        expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
    });

    it('é chamado o método "json" passando um objeto com a venda atualizada', async () => {
        await salesController.updateSale(request, response);

        expect(response.json.calledWith(expected_response)).to.be.equal(true);
    });
  });
});

describe('CONTROLLER - Deleta uma venda do banco', () => {
  describe('quando a venda não é deletada', async () => {
      const response = {};
      const request = {};

      const sale_id = '6140f7fe58c7fb340503bc6'
      before(() => {
        request.params = { id: sale_id };

        response.status = sinon.stub()
            .returns(response);
        response.json = sinon.stub()
            .returns();

        sinon.stub(salesService, 'deleteSale').resolves({
          err: {
            code: 'invalid_data',
            message: 'Wrong sale ID format',
          },
        });
      })

      after(() => {
        salesService.deleteSale.restore();
      })

      it('é chamado o método "status" passando o código 422', async () => {
          await salesController.deleteSale(request, response);

          expect(response.status.calledWith(422)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto', async () => {
          await salesController.deleteSale(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto err', async () => {
          await salesController.deleteSale(request, response);

          const err_response = {
            err: {
              code: 'invalid_data',
              message: 'Wrong sale ID format',
            },
          }
          expect(response.json.calledWith(err_response)).to.be.equal(true);
      });
  });

  describe('quando a venda é deletada com sucesso', async () => {
      const response = {};
      const request = {};

      const sale_id = '6140f7fe58c7fb340503bc6d'
      const expected_response = {
        _id: '6140f7fe58c7fb340503bc6d',
        itensSold: [
          { productId: '604cb554311d68f491ba5781', quantity: 15 },
          { productId: '604cb554311d68f491ba5782', quantity: 50 }
        ]
      };

      before(() => {
        request.params = { id: sale_id };

          response.status = sinon.stub()
              .returns(response);
          response.json = sinon.stub()
              .returns();

          sinon.stub(salesService, 'deleteSale').resolves(expected_response);
      })

      after(() => {
        salesService.deleteSale.restore();
      })

      it('é chamado o método "status" passando o código 200', async () => {
          await salesController.deleteSale(request, response);

          expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um object', async () => {
          await salesController.deleteSale(request, response);

          expect(response.json.calledWith(sinon.match.object)).to.be.equal(true);
      });

      it('é chamado o método "json" passando um objeto com a venda deletada', async () => {
          await salesController.deleteSale(request, response);

          expect(response.json.calledWith(expected_response)).to.be.equal(true);
      });
  });
});