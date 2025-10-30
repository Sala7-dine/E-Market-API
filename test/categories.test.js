import * as chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
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

describe('Categories API Tests', function () {
  this.timeout(20000);

  let mongod;
  let token;
  let _categorieID;
  before(async () => {
    // Start in-memory MongoDB and connect Mongoose
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // Dynamically import the app AFTER NODE_ENV is set to 'test'
    const mod = await import('../server.js');
    app = mod.default;
    request = supertest(app);
    await Categorie.deleteMany({});
    await User.deleteMany({});

    // register
    await request.post('/api/auth/register').send({
      fullName: 'exemple name',
      email: 'test@gmail.com',
      password: 'salah1234',
    });

    // get access Token
    const access_token = await request
      .post('/api/auth/login')
      .send({
        email: 'test@gmail.com',
        password: 'salah1234',
      })
      .expect(200);

    token = await access_token._body.accessToken;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  });

  it('Should create new categorie', async () => {
    const res = await request
      .post('/api/categories/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Electronique 4',
        description: 'lorem eckrnv ckwejnc cjwibec cwbeicbwe ciwubhc',
      });

    _categorieID = await res.body.data._id;
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('data');
  });

  it('Show List All Categories', async () => {
    const res = await request
      .get('/api/categories/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('data');
  });

  it('Should Update a Categorie with ID', async () => {
    const res = await request
      .put(`/api/categories/update/${_categorieID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Electronique 4 (Updated)',
        description: 'lorem eckrnv ckwejnc cjwibec cwbeicbwe ciwubhc (Updated)',
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('data');
  });

  it('Should Delete a Categories with ID', async () => {
    const res = await request
      .delete(`/api/categories/delete/${_categorieID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('data');
  });
});
