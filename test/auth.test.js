import * as chai from "chai";
import chaiHttp from "chai-http";
import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import dotenv from "dotenv";

dotenv.config();

// Ensure test mode before loading the app module
process.env.NODE_ENV = "test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-key-for-testing";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key-for-testing";
process.env.ACCESS_TOKEN_EXP = "15m";
process.env.REFRESH_TOKEN_EXP = "30d";

const { expect } = chai;
chai.use(chaiHttp);

let app;
let request;

describe("Auth API Tests", function () {
  this.timeout(20000);

  let mongod;

  before(async () => {
    // Start in-memory MongoDB and connect Mongoose
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // Dynamically import the app AFTER NODE_ENV is set to 'test'
    const mod = await import("../server.js");
    app = mod.default;
    request = supertest(app);

    await User.deleteMany({});
    await RefreshToken.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  });

  let refreshToken;

  it("Should register a new user", async () => {
    const res = await request.post("/api/auth/register").send({
      fullName: "testuser",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("email", "test@example.com");
  });

  it("Should login successfully", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("accessToken");
    expect(res.body).to.have.property("refreshToken");
    refreshToken = res.body.refreshToken;
  });

  // it('Should access protected route with token', async () => {
  //     const res = await request
  //         .get('/api/auth/profile')
  //         .set('Authorization', `Bearer ${accessToken}`);
  //
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property('email', 'test@example.com');
  // });

  it("Should refresh access token", async () => {
    const res = await request.post("/api/auth/refresh").send({ refreshToken });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("accessToken");
  });

  it("Should logout and invalidate refresh token", async () => {
    const res = await request.post("/api/auth/logout").send({ refreshToken });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Déconnexion réussie");
  });

  it("Should fail to use old refresh token", async () => {
    const res = await request.post("/api/auth/refresh").send({ refreshToken });

    expect(res.status).to.be.oneOf([400, 401]);
  });
});
