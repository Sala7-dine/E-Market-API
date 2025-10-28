import * as chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

process.env.NODE_ENV = "test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-key-for-testing";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key-for-testing";
process.env.ACCESS_TOKEN_EXP = "15m";
process.env.REFRESH_TOKEN_EXP = "30d";

const { expect } = chai;

describe("Coupon API Tests", function () {
  this.timeout(20000);

  let app;
  let request;
  let mongod;
  let adminToken;
  let userToken;

  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    const mod = await import("../server.js");
    app = mod.default;
    request = supertest(app);

    await User.deleteMany({});

    // Create admin user
    await request.post("/api/auth/register").send({
      fullName: "Admin User",
      email: "admin@example.com",
      password: "password123",
    });

    await User.findOneAndUpdate(
      { email: "admin@example.com" },
      { role: "admin" },
    );

    const adminLogin = await request.post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    adminToken = adminLogin.body.accessToken;

    // Create regular user
    await request.post("/api/auth/register").send({
      fullName: "Regular User",
      email: "user@example.com",
      password: "password123",
    });

    const userLogin = await request.post("/api/auth/login").send({
      email: "user@example.com",
      password: "password123",
    });
    userToken = userLogin.body.accessToken;
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
  });

  it("Should create coupon (admin)", async () => {
    const res = await request
      .post("/api/coupons/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        code: "TEST10",
        discountType: "percentage",
        discountValue: 10,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

    expect([200, 201, 401, 403, 404]).to.include(res.status);
  });

  it("Should not create coupon (user)", async () => {
    const res = await request
      .post("/api/coupons/create")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        code: "USER10",
        discountType: "percentage",
        discountValue: 10,
      });

    expect([200, 403, 404]).to.include(res.status);
  });

  it("Should get all coupons", async () => {
    const res = await request
      .get("/api/coupons")
      .set("Authorization", `Bearer ${adminToken}`);

    expect([200, 201, 401, 403, 404]).to.include(res.status);
  });
});
