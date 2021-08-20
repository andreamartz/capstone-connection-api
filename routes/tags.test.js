"use strict";

process.env.NODE_ENV = "test"

const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/***************** POST /tags **************/

describe("POST /tags", function() {
  test("ok for admin", async function() {
    const response = await request(app)
      .post("/tags")
      .send({ text: 'NEWTAG' })
      .set("authorization", `Bearer ${adminToken}`)
    ;
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      tag: { id: 5, text: 'NEWTAG' }
    });
  });
});