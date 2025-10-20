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


    it('Should create new product', async () => {
        const res = await request
            .post('/api/products/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "title": "Nike T-shirt",
                "description": "sportif",
                "prix": 30.99,
                "stock": 30,
                "categories": [_idCategorie],
                "imageUrl": "https://exemple.com/image.jpg"
            });

        _productID = await res.body.data._id;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('data');

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
            .send({
                "title": "Product Updated",
                "description": "sportif updated",
                "prix": 30.99,
                "stock": 30,
                "categories": [_idCategorie],
                "imageUrl": "https://exemple.com/image.jpg"
            });

        expect(res.status).to.equal(201);
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
