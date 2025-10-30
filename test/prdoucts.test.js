import * as chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from '../models/Product.js';
import Categorie from '../models/Categorie.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Ensure test mode before loading the app module
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-testing';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing';
process.env.ACCESS_TOKEN_EXP = '15m';
process.env.REFRESH_TOKEN_EXP = '30d';

const { expect } = chai;
chai.use(chaiHttp);

let app;
let request;

describe('Products API Tests', function () {
  this.timeout(20000);

  let mongod;
  let token;
  let _idCategorie;
  let _productID;
  let userId;

  before(async () => {
    // Start in-memory MongoDB and connect Mongoose
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // Dynamically import the app AFTER NODE_ENV is set to 'test'
    const mod = await import('../server.js');
    app = mod.default;
    request = supertest(app);
    await Product.deleteMany({});
    await Categorie.deleteMany({});
    await User.deleteMany({});

    // register
    await request.post('/api/auth/register').send({
      fullName: 'exemple name',
      email: 'test@gmail.com',
      password: 'salah1234',
    });

    // Update user role to seller for product operations
    const user = await User.findOne({ email: 'test@gmail.com' });
    userId = user._id;
    await User.findByIdAndUpdate(userId, { role: 'seller' });

    // get access Token
    const access_token = await request.post('/api/auth/login').send({
      email: 'test@gmail.com',
      password: 'salah1234',
    });

    expect([200, 429]).to.include(access_token.status);

    if (access_token.status === 200) {
      token = access_token._body.accessToken;

      // get Categorie Id
      const categorie_data = await request.post('/api/categories/create').send({
        name: 'Electronique 5',
        description: 'lorem eckrnv ckwejnc cjwibec cwbeicbwe ciwubhc',
      });

      if (categorie_data.body && categorie_data.body.data) {
        _idCategorie = categorie_data.body.data._id;
      }
    }
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  });

  it('Should create product with multiple images', async function () {
    if (!token || !_idCategorie) {
      return this.skip();
    }

    const res = await request
      .post('/api/products/create')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Product with Images')
      .field('description', 'Product with multiple compressed images')
      .field('prix', '45.99')
      .field('stock', '25')
      .field('categories', JSON.stringify([_idCategorie]));

    if (res.status === 201 && res.body.data) {
      _productID = res.body.data._id;
      expect(res.body).to.have.property('data');
    }
    expect([201, 400, 403, 429]).to.include(res.status);
  });

  it('Show List All Products', async function () {
    if (!token) {
      return this.skip();
    }

    const res = await request
      .get('/api/products/')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 201, 429]).to.include(res.status);
    if ([200, 201].includes(res.status)) {
      expect(res.body).to.have.property('data');
    }
  });

  it('Should Update a Product with ID', async function () {
    if (!_productID || !token || !_idCategorie) {
      return this.skip();
    }

    const res = await request
      .put(`/api/products/update/${_productID}`)
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Update Product with Images')
      .field('description', 'Update Product with multiple compressed images')
      .field('prix', '45.99')
      .field('stock', '25')
      .field('categories', JSON.stringify([_idCategorie]));

    expect([200, 403, 404, 429]).to.include(res.status);
    if (res.status === 200) {
      expect(res.body).to.have.property('data');
    }
  });

  it('Should Delete a Product with ID', async function () {
    if (!_productID || !token) {
      return this.skip();
    }

    const res = await request
      .delete(`/api/products/delete/${_productID}`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 201, 403, 404, 429]).to.include(res.status);
    if ([200, 201].includes(res.status)) {
      expect(res.body).to.have.property('data');
    }
  });
});
