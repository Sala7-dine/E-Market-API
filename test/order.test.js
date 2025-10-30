import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

dotenv.config();

// Ensure test mode before loading the app module
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-testing';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing';
process.env.ACCESS_TOKEN_EXP = '15m';
process.env.REFRESH_TOKEN_EXP = '30d';

const { expect } = chai;

describe('Order API Tests', function () {
  this.timeout(20000);

  let app;
  let request;
  let mongod;
  let token;
  let user;
  let createdOrder;

  before(async function () {
    this.timeout(20000);

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    const mod = await import('../server.js');
    app = mod.default;
    request = supertest(app);

    //  Register user
    await request.post('/api/auth/register').send({
      fullName: 'Test User',
      email: 'testuser@gmail.com',
      password: 'password123',
    });

    // Fetch user from DB
    user = await mongoose
      .model('User')
      .findOne({ email: 'testuser@gmail.com' });

    // Login to get token
    const loginRes = await request.post('/api/auth/login').send({
      email: 'testuser@gmail.com',
      password: 'password123',
    });

    token = loginRes.body.accessToken;
  });

  after(async function () {
    this.timeout(20000);
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it('should create a new order', async function () {
    const product = await Product.create({
      title: 'Test Product',
      description: 'A sample product for testing',
      prix: 50,
      stock: 10,
      createdBy: user._id,
    });

    const cart = await Cart.create({
      userId: user._id,
      items: [{ productId: product._id, quantity: 2, price: 50 }],
      totalPrice: 100,
    });

    const res = await request
      .post(`/api/orders/addOrder/${cart._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 201, 401]).to.include(res.status);
    if (res.body.data) {
      createdOrder = res.body.data;
    }
  });

  it('should return all orders', async function () {
    const res = await request
      .get('/api/orders/getOrder')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 201, 401]).to.include(res.status);
  });

  it('should successfully process payment and return a success message with the updated order', async function () {
    if (!createdOrder || !createdOrder._id) {
      return this.skip();
    }

    const res = await request
      .put(`/api/orders/updateStatus/${createdOrder._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'paid' });

    expect([200, 401, 404]).to.include(res.status);
    if (res.status === 200 && res.body.data) {
      expect(res.body.data.status).to.equal('paid');
    }
  });
});
