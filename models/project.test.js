"use strict";
/** Integration tests for projects routes */

process.env.NODE_ENV = "test";  // must come before loading db.js

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
} = require("../expressError");

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const config = require("../config");
const Project = require("./project");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
// commonAfterAll(commonAfterAll);

/**************** getAll ****************/
describe("getAll", function() {
  test("Get all projects", async function() {
    const projects = await Project.getAll();
    expect(projects[0].id).toEqual(expect.any(Number));
    expect(projects[0].image).toEqual('https://via.placeholder.com/300x300?text=p1+image');
    expect(projects[0].creator).toEqual({
      id: 1,
      firstName: "fn1",
      lastName: "ln1",
      photoUrl: "https://via.placeholder.com/300x300?text=user1+photo"
    });
  });

  test("Get all projects with JS tag", async function() {
    const filterParams = { userId: null, tagText: 'JS', sortVariable: null };
    const projects = await Project.getAll(1, filterParams);
    expect (projects).toHaveLength(1);
  });

  test("Get all projects with API tag", async function() {
    const filterParams = { userId: null, tagText: 'API', sortVariable: null };
    const projects = await Project.getAll(1, filterParams);
    expect (projects).toHaveLength(2);
  });

  test("Get all projects sorted by newest", async function() {
    const filterParams = { userId: null, tagText: null, sortVariable: "newest" };
    const projects = await Project.getAll(1, filterParams);
    expect(projects).toHaveLength(2);
    expect(projects[0].id === 2);
  });

  test("Get all projects sorted by most likes", async function() {
    const filterParams = { userId: null, tagText: null, sortVariable: "most likes" };
    const projects = await Project.getAll(1, filterParams);
    console.log("PROJECTS: ", projects);
    expect(projects).toHaveLength(2);
    expect(projects[0].id).toBe(1);
    expect(projects[0].likesCount).toBeGreaterThan(projects[1].likesCount);
    expect(projects[0].likesCount).toBe(1);
    expect(projects[1].likesCount).toBe(0);
  });

  test("Get all projects for user with id 2", async function() {
    const filterParams = { userId: 2, tagText: null, sortVariable: null };
    const projects = await Project.getAll(1, filterParams);

    expect(projects).toHaveLength(1);
    expect(projects[0].id).toEqual(expect.any(Number));
    expect(projects[0].name).toEqual('p2');
    expect(projects[0].creator).toEqual({
      id: 2,
      firstName: "fn2",
      lastName: "ln2",
      photoUrl: "https://via.placeholder.com/300x300?text=user2+photo"
    });
  });
});

describe("remove", function() {
  test("Delete project 1 and then delete project 2", async function() {
    await Project.remove(1);
    let projects = await Project.getAll();
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toEqual(2);
    await Project.remove(2);
    projects = await Project.getAll();
    expect(projects).toHaveLength(0);
  });
});

  // test situations when errors should be produced