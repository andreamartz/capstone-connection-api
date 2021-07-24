"use strict";

// set NODE_ENV variable before loading db.js
process.env.NODE_ENV = "test";

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
} = require("../expressError");

const db = require("../db");

const Project = require("./project");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  // commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
// commonAfterAll(commonAfterAll);

/**************** getAll ****************/
describe("getAll", function() {
  
  // QUESTION: 
  // How to test a date with jest? (see created_at below)

  test("Get all projects", async function() {
    const projects = await Project.getAll();
    expect(projects[0]).toStrictEqual({
      id: expect.any(Number),
      name: 'p1',
      creatorId: expect.any(Number),
      image: 'https://via.placeholder.com/300x300?text=p1+image',
      repoUrl: 'https://via.placeholder.com/300x300?text=p1+repo+url',
      siteUrl: 'https://via.placeholder.com/300x300?text=p1+site+url',
      description: 'p1 desc',
      feedbackRequest: 'p1 f_req',
      createdAt: expect.any(Date),
      lastModified: expect.any(Date)
    });
  });

  // test search feature, if there will be one
  // test filtering
  // test sorting of returned projects
  // test situations when errors should be produced

});

// describe()
