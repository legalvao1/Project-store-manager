const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoConnection = require('../../models/connection');

const productsModel = require('../../models/productsModel');


describe('Busca todos os Produtos no BD', () => {
  const DBServer = new MongoMemoryServer();
  let connectionMock;

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient
      .connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then((conn) => conn.db('model_tests'))
      

    sinon.stub(mongoConnection, 'getConnection')
      .resolves(connectionMock);
  });

  after(async () => {
    mongoConnection.getConnection.restore();
    await DBServer.stop();
  });


  describe('quando não existe nenhum produto cadastrado', () => {
    it('retorna um array', async () => {
      const response = await productsModel.getAllProducts();

      expect(response).to.be.an('array');
    });

    it('o array está vazio', async () => {
      const response = await productsModel.getAllProducts();

      expect(response).to.be.empty;
    });

  });

  describe('quando existem produtos cadastrados', () => {
    const productExample = { name: 'example', quantity: 20};

    before(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').insertOne({ ...productExample });
    });

    after(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').drop();
  });


    it('retorna um array', async () => {
      const response = await productsModel.getAllProducts();

      expect(response).to.be.an('array');
    });

    it('o array não está vazio', async () => {
      const response = await productsModel.getAllProducts();

      expect(response).to.be.not.empty;
    });

    it('o array possui itens do tipo objeto', async () => {
      const [ item ] = await productsModel.getAllProducts();

      expect(item).to.be.an('object');
    });

    it('tais itens possui as propriedades: "_id", "name", "quantity"', async () => {
      const [ item ] = await productsModel.getAllProducts();

      expect(item).to.include.all.keys('_id', 'name', 'quantity')
    });
  });
});

describe('Cadastra um novo produto no banco de dados', () => {
  const DBServer = new MongoMemoryServer();
  let connectionMock

  const productExample = {
    // _id: '604cb554311d68f491ba5781',
    name: 'example',
    quantity: 20,
  };

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient
      .connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then((conn) => conn.db('StoreManager'));

    sinon.stub(mongoConnection, 'getConnection')
      .resolves(connectionMock);
  });

  after(async () => {
    mongoConnection.getConnection.restore();
    await DBServer.stop();
  });

  describe('Quando um produto é cadastrado com sucesso', () =>{
    it('retorna um objeto', async () => {
      const response = await productsModel.create(productExample);
      expect(response).to.be.a('object');
    });

    it('o objeto possui as propriedades _id, name, quantity', async () => {
      const response = await productsModel.create(productExample);
      expect(response).to.include.all.keys('_id', 'name', 'quantity')
    })
  });
});

describe('Busca apenas um filme no BD através do ID', () => {
  const DBServer = new MongoMemoryServer();
  let connectionMock;

  const ID_EXAMPLE = '604cb554311d68f491ba5781';

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient
     .connect(URLMock, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     })
     .then((conn) => conn.db('StoreManager'));

    
    sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
  });

  after(() => {
    mongoConnection.getConnection.restore();
  });

  describe('quando não existe um filme para o ID informado', () => {
    it('retorna "null"', async () => {
      const response = await productsModel.findProductById(ID_EXAMPLE);

      expect(response).to.be.equal(null);
    });
  });

  describe('quando existe um filme para o ID informado', () => {
    const expectedProduct = {
      _id: ObjectId('604cb554311d68f491ba5781'),
      name: 'example',
      quantity: 20,
    }

    before(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').insertOne({ ... expectedProduct });
    });

    after(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').drop();
  });

    it('retorna um objeto', async () => {
      const response = await productsModel.findProductById(ID_EXAMPLE);
      console.log(response)

      expect(response).to.be.a('object');
    });

    it('o objeto possui as propriedades: "_id", "name", "quantity"', async () => {
      const response = await await productsModel.findProductById(ID_EXAMPLE);

      expect(response).to.include.all.keys('_id', 'name', 'quantity');
    });
  });
});


describe('Busca apenas um produto no BD através do nome', () => {
  const DBServer = new MongoMemoryServer();
  let connectionMock;

  const NAME_EXAMPLE = 'example';

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient
     .connect(URLMock, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     })
     .then((conn) => conn.db('StoreManager'));

    
    sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
  });

  after(() => {
    mongoConnection.getConnection.restore();
  });

  describe('quando não existe um produto para o nome informado', () => {
    it('retorna "false"', async () => {
      const response = await productsModel.findProductByName(NAME_EXAMPLE);

      expect(response).to.be.equal(false);
    });
  });

  describe('quando existe um produto para o nome informado', () => {
    const expectedProduct = {
      _id: ObjectId('604cb554311d68f491ba5781'),
      name: 'example',
      quantity: 20,
    }

    before(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').insertOne({ ... expectedProduct });
    });

    after(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').drop();
  });

    it('retorna true', async () => {
      const response = await productsModel.findProductByName(NAME_EXAMPLE);


      expect(response).to.be.equal(true);
    });
  });
});


//////////////////////////////////////////////////////////////////////////////

describe('Atualiza apenas um produto no BD através do id', () => {
  const DBServer = new MongoMemoryServer();
  let connectionMock;

  const NAME_EXAMPLE = 'example';

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient
     .connect(URLMock, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     })
     .then((conn) => conn.db('StoreManager'));

    
    sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
  });

  after(() => {
    mongoConnection.getConnection.restore();
  });

  describe('quando não existe um produto para o nome informado', () => {
    it('retorna "false"', async () => {
      const response = await productsModel.findProductByName(NAME_EXAMPLE);

      expect(response).to.be.equal(false);
    });
  });

  describe('quando existe um produto para o nome informado', () => {
    const expectedProduct = {
      _id: ObjectId('604cb554311d68f491ba5781'),
      name: 'example',
      quantity: 20,
    }

    before(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').insertOne({ ... expectedProduct });
    });

    after(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').drop();
  });

    it('retorna um objeto', async () => {
      const expected_response = { 
        id: '604cb554311d68f491ba5781',
        name: 'update_test',
        quantity: 10
      }
      const response = await productsModel.update('604cb554311d68f491ba5781', 'update_test', 10);
 
      expect(response).to.be.deep.equal(expected_response);
    });
  });
});

///////////////////////////////////////////////////////////////////////////


describe('Atualiza apenas um produto no BD através do id', () => {
  const DBServer = new MongoMemoryServer();
  let connectionMock;

  const NAME_EXAMPLE = 'example';

  before(async () => {
    const URLMock = await DBServer.getUri();
    connectionMock = await MongoClient
     .connect(URLMock, {
       useNewUrlParser: true,
       useUnifiedTopology: true
     })
     .then((conn) => conn.db('StoreManager'));

    
    sinon.stub(mongoConnection, 'getConnection').resolves(connectionMock);
  });

  after(() => {
    mongoConnection.getConnection.restore();
  });

  describe('quando não existe um produto para o nome informado', () => {
    it('retorna "false"', async () => {
      const response = await productsModel.findProductByName(NAME_EXAMPLE);

      expect(response).to.be.equal(false);
    });
  });

  describe('Deleta um objeto a partir do Id informado', () => {
    const expectedProduct = {
      _id: ObjectId('604cb554311d68f491ba5781'),
      name: 'example',
      quantity: 20,
    }

    before(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').insertOne({ ... expectedProduct });
    });

    after(async () => {
      const db = await mongoConnection.getConnection();
      await db.collection('products').drop();
  });

    it('retorna um objeto', async () => {
      const response = await productsModel.exclude('604cb554311d68f491ba5781');
 
      expect(response.result.ok).to.be.deep.equal(1);
    });
  });
});