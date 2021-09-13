const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const productsModel = require('../../models/productsModel');
const salesModel = require('../../models/salesModel');

describe('Busca todos os produtos no BD', () => {
  describe('quando não existe nenhum produto cadastrado', async () => {
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();
      const connectionMock = await MongoClient
        .connect(URLMock, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);
    });

    after(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    it('retorna um array', async () => {
      const response = await productsModel.getAllProducts();

      expect(response).to.be.an('array');
    });

    it('o array está vazio', async () => {
      const response = await productsModel.getAllProducts();;

      expect(response).to.be.empty;
    });

  });

  describe('quando existem produtos cadastrados', () => {
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();
      const connectionMock = await MongoClient
        .connect(URLMock, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      const productsCollection = await connectionMock.db('StoreManager').collection('products');

      await productsCollection.insertOne({
        name: 'pudim',
        quantity: 20,
      })
    });

    after(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    it('retorna um array', async () => {
      const response = await productsModel.getAllProducts();;

      expect(response).to.be.an('array');
    });

    it('o array não está vazio', async () => {
      const response = await productsModel.getAllProducts();;

      expect(response).to.be.not.empty;
    });

    it('o array possui itens do tipo objeto', async () => {
      const [ item ] = await productsModel.getAllProducts();;

      expect(item).to.be.an('object');
    });

    it('tais itens possui as propriedades: "id", "name", "quantity"', async () => {
      const [ item ] = await productsModel.getAllProducts();;

      expect(item).to.include.all.keys('_id', 'name', 'quantity')
    });

  });
});