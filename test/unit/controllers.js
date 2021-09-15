const sinon = require('sinon');
const { expect } = require('chai');


const productsController = require('../../controllers/productsController');
const productsService = require('../../services/productsService');
const productsModel = require('../../models/productsModel');

const salesController = require('../../controllers/salesController');
const salesService = require('../../services/salesService');

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