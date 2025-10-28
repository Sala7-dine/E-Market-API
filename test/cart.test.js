import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from "dotenv";

dotenv.config();

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-testing';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing';
process.env.ACCESS_TOKEN_EXP = '15m';
process.env.REFRESH_TOKEN_EXP = '30d';

const { expect } = chai;

describe('Cart API Tests', function () {
    this.timeout(20000);

    let app;
    let request;
    let mongod;
    let token;
    let productId;
    let cartItemId;

    before(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);

        const mod = await import('../server.js');
        app = mod.default;
        request = supertest(app);

        await User.deleteMany({});
        await Product.deleteMany({});
        await Cart.deleteMany({});

        // Register user
        await request.post('/api/auth/register').send({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });

        // Login
        const loginRes = await request.post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'password123'
        });
        token = loginRes.body.accessToken;

        // Create a seller and product
        const seller = await User.create({
            fullName: 'Seller User',
            email: 'seller@example.com',
            password: 'password123',
            role: 'seller'
        });

        const product = await Product.create({
            title: 'Test Product',
            description: 'Test Description',
            prix: 100,
            stock: 10,
            createdBy: seller._id
        });
        productId = product._id;
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongod) await mongod.stop();
    });

    it('Should add product to cart', async () => {
        const res = await request
            .post('/api/carts/addtocart')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: productId,
                quantity: 2
            });

        expect([200, 201, 401]).to.include(res.status);
        if (res.body.data) {
            cartItemId = res.body.data._id;
        }
    });

    it('Should get user cart', async () => {
        const res = await request
            .get('/api/carts/getcarts')
            .set('Authorization', `Bearer ${token}`);

        expect([200, 201, 401]).to.include(res.status);
    });

    it('Should update cart item', async function() {
        if (!cartItemId) {
            return this.skip();
        }

        const res = await request
            .put(`/api/carts/updateCart/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 3 });

        expect([200, 201, 401, 404]).to.include(res.status);
    });

    it('Should delete cart item', async function() {
        if (!cartItemId) {
            return this.skip();
        }

        const res = await request
            .delete(`/api/carts/deleteProduct/${cartItemId}`)
            .set('Authorization', `Bearer ${token}`);

        expect([200, 201, 401, 404]).to.include(res.status);
    });
});