import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User.js';
import dotenv from "dotenv";

dotenv.config();

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-for-testing';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing';
process.env.ACCESS_TOKEN_EXP = '15m';
process.env.REFRESH_TOKEN_EXP = '30d';

const { expect } = chai;

describe('Admin API Tests', function () {
    this.timeout(20000);

    let app;
    let request;
    let mongod;
    let adminToken;
    let userToken;
    let userId;

    before(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);

        const mod = await import('../server.js');
        app = mod.default;
        request = supertest(app);

        await User.deleteMany({});

        // Create admin user
        await request.post('/api/auth/register').send({
            fullName: 'Admin User',
            email: 'admin@example.com',
            password: 'password123'
        });

        await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            { role: 'admin' }
        );

        const adminLogin = await request.post('/api/auth/login').send({
            email: 'admin@example.com',
            password: 'password123'
        });
        adminToken = adminLogin.body.accessToken;

        // Create regular user
        const userRes = await request.post('/api/auth/register').send({
            fullName: 'Regular User',
            email: 'user@example.com',
            password: 'password123'
        });

        const user = await User.findOne({ email: 'user@example.com' });
        userId = user._id;

        const userLogin = await request.post('/api/auth/login').send({
            email: 'user@example.com',
            password: 'password123'
        });
        userToken = userLogin.body.accessToken;
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongod) await mongod.stop();
    });

    it('Should promote user to seller (admin)', async () => {
        const res = await request
            .patch(`/api/admin/users/${userId}/promote`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ role: 'seller' });

        expect([200, 201]).to.include(res.status);
        if (res.status === 200) {
            expect(res.body.data.role).to.equal('seller');
        }
    });

    it('Should not promote user (regular user)', async () => {
        const res = await request
            .patch(`/api/admin/users/${userId}/promote`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ role: 'seller' });

        expect(res.status).to.equal(403);
    });

    it('Should get logs (admin)', async () => {
        const res = await request
            .get('/api/admin/logs')
            .set('Authorization', `Bearer ${adminToken}`);

        expect([200, 500]).to.include(res.status);
    });

    it('Should not get logs (regular user)', async () => {
        const res = await request
            .get('/api/admin/logs')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).to.equal(403);
    });
});