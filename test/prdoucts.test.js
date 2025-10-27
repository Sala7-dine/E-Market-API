import * as chai from 'chai';
import chaiHttp from 'chai-http';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from '../models/Product.js';
import Categorie from '../models/Categorie.js';
import User from '../models/User.js'
import dotenv from "dotenv";

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
        const user_data = await request
            .post('/api/auth/register')
            .send({
                "fullName" : "exemple name",
                "email" : "test@gmail.com",
                "password" : "salah1234"
            });

        // get access Token
        const access_token = await request
            .post('/api/auth/login')
            .send({
                "email" : "test@gmail.com",
                "password" : "salah1234"
            }).expect(200);

        token = await access_token._body.accessToken;


        // get Categorie Id
        const categorie_data = await request
            .post('/api/categories/create')
            .send({
                "name" : "Electronique 5",
                "description" : "lorem eckrnv ckwejnc cjwibec cwbeicbwe ciwubhc"
            });

        _idCategorie = await categorie_data.body.data._id;

    });


    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongod) {
            await mongod.stop();
        }
    });


    it('Should create product with multiple images', async () => {
        const res = await request
            .post('/api/products/create')
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Product with Images')
            .field('description', 'Product with multiple compressed images')
            .field('prix', '45.99')
            .field('stock', '25')
            .field('categories', JSON.stringify([_idCategorie]))
            .field('images'  , JSON.stringify([
                {
                    "url": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                },
                {
                    "url": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                }
            ]));

        _productID = await res.body.data._id;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('images');
        expect(res.body.data.images).to.be.an('array');
    });

    it('Show List All Products' , async () => {

       const res = await request
           .get('/api/products/')
           .set('Authorization', `Bearer ${token}`)

       expect(res.status).to.equal(201);
       expect(res.body).to.have.property("data");


    });

    it("Should Update a Product with ID" ,async () => {

        const res = await request
            .put(`/api/products/update/${_productID}`)
            .set('Authorization' , `Bearer ${token}`)
            .field('title', 'Update Product with Images')
            .field('description', 'Update Product with multiple compressed images')
            .field('prix', '45.99')
            .field('stock', '25')
            .field('categories', JSON.stringify([_idCategorie]))
            .field('images'  , JSON.stringify([
                {
                    "url": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                },
                {
                    "url": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                }
            ]));

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("data");

    });



    it("Should Delete a Product with ID" ,async () => {

        const res = await request
            .delete(`/api/products/delete/${_productID}`)
            .set('Authorization' , `Bearer ${token}`);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("data");

    });

});
