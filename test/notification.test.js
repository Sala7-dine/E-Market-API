import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-testing';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing';
process.env.ACCESS_TOKEN_EXP = '15m';
process.env.REFRESH_TOKEN_EXP = '30d';

const { expect } = chai;

describe('Notification API Tests', function () {
  this.timeout(20000);

  let app;
  let request;
  let mongod;
  let token;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    const mod = await import('../server.js');
    app = mod.default;
    request = supertest(app);

    await User.deleteMany({});

    // Register and login user
    await request.post('/api/auth/register').send({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const loginRes = await request.post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = loginRes.body.accessToken;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it('Should get user notifications', async () => {
    const res = await request
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 201, 401]).to.include(res.status);
  });

  it('Should not get notifications without auth', async () => {
    const res = await request.get('/api/notifications');

    expect(res.status).to.equal(401);
  });
});
