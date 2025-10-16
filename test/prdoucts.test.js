import * as chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from '../models/Product.js';
import dotenv from "dotenv";

dotenv.config();

// Ensure test mode before loading the app module
process.env.NODE_ENV = 'test';

const { expect } = chai;
chai.use(chaiHttp);

let app;
let request;

describe('Products API Tests', function () {
    this.timeout(20000);

    let mongod;

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
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongod) {
            await mongod.stop();
        }
    });


    it('Should create new product', async () => {
        const res = await request
            .post('/api/products/create')
            .send({
                "title": "Nike T-shirt",
                "description": "sportif",
                "prix": 30.99,
                "stock": 30,
                "categories": ["653e2a1b9d7f3c1a2b3c4d5e"],
                "imageUrl": "https://exemple.com/image.jpg"
            });

        expect(res.status).to.equal(201);
    });

    // it('Should login successfully', async () => {
    //     const res = await request
    //         .post('/api/auth/login')
    //         .send({ email: 'test@example.com', password: '123456' });
    //
    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('accessToken');
    //     expect(res.body).to.have.property('refreshToken');
    //     accessToken = res.body.accessToken;
    //     refreshToken = res.body.refreshToken;
    // });

    // it('Should access protected route with token', async () => {
    //     const res = await request
    //         .get('/api/auth/profile')
    //         .set('Authorization', `Bearer ${accessToken}`);
    //
    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('email', 'test@example.com');
    // });

    // it('Should refresh access token', async () => {
    //     const res = await request
    //         .post('/api/auth/refresh')
    //         .send({ refreshToken });
    //
    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('accessToken');
    // });
    //
    // it('Should logout and invalidate refresh token', async () => {
    //     const res = await request
    //         .post('/api/auth/logout')
    //         .send({ refreshToken });
    //
    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.have.property('message', 'Déconnexion réussie');
    // });
    //
    // it('Should fail to use old refresh token', async () => {
    //     const res = await request
    //         .post('/api/auth/refresh')
    //         .send({ refreshToken });
    //
    //     expect(res.status).to.be.oneOf([400, 401]);
    // });
});
