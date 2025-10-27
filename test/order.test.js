import * as chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Order from "../models/Order.js";
import dotenv from "dotenv";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
dotenv.config();
process.env.NODE_ENV = "test";

const { expect } = chai;

let app;
let request;
let mongod;
let token;
let user;
let createdOrder;
const status = "paid";

before(async function () {
  this.timeout(20000);

  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  const mod = await import("../server.js");
  app = mod.default;
  request = supertest(app);

  //  Register user
  await request.post("/api/auth/register").send({
    fullName: "Test User",
    email: "testuser@gmail.com",
    password: "password123",
  });

  // Fetch user from DB
  user = await mongoose.model("User").findOne({ email: "testuser@gmail.com" });

  // Login to get token
  const loginRes = await request.post("/api/auth/login").send({
    email: "testuser@gmail.com",
    password: "password123",
  });

  token = loginRes.body.accessToken;
});

after(async function () {
  this.timeout(20000);
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
});

describe("Order API Tests", function () {
  this.timeout(20000);

  it("should create a new order", async function () {
    const product = await Product.create({
      title: "Test Product",
      description: "A sample product for testing",
      prix: 50,
      stock: 10,
      createdBy: user._id,
    });
    // Create a cart :
    const cart = await Cart.create({
      userId: user._id,
      items: [{ productId: product._id, quantity: 2, price: 50 }],
      totalPrice: 100,
    });
    // Add order :
    const res = await request
      .post(`/api/orders/addOrder/${cart._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("data");
    createdOrder = res.body.data;
  });

  // Get all user's order :
  it("should return all orders", async function () {
    const res = await request
      .get("/api/orders/getOrder")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
  });

  // it("should update order's status", async function () {
  //     const res = await request
  //       .put(`/api/orders/updateStatus/${createdOrder._id}`)
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({ status: "cancelled" });

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property("data");
  //   });
  if (status === "paid") {
    // Paiement Simulation :
    it("should successfully process payment and return a success message with the updated order", async function () {
      const res = await request
        .put(`/api/orders/updateStatus/${createdOrder._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "paid" });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("data");
      expect(res.body.data.status).to.equal("paid");
    });
  } else {
    // Update order's status :
    it(`should update order's status`, async function () {
      const res = await request
        .put(`/api/orders/updateStatus/${createdOrder._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: status });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("data");
    });
  }
});
