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

/***************** POST /projects **************/
describe("POST /projects", function() {
  const newProject = { 
    name: 'p3',
    description: 'p3 desc',
    creatorId: 1, 
    image: null,
    tags: [ 1, 2, 3, 4 ],
    repoUrl: 'https://github.com/andreamartz/capstone-connection',
    siteUrl: 'https://andreamartz.dev/',
    feedbackRequest: 'Tell me everything!' 
  };
  const addedProject = {
    id: 3,
    name: 'p3',
    image: 'https://res.cloudinary.com/wahmof2/image/upload/v1626296156/capstone_connections/projects_capstone_connections/undraw_Website_builder_re_ii6e.svg',
    repoUrl: 'https://github.com/andreamartz/capstone-connection',
    siteUrl: 'https://andreamartz.dev/',
    createdAt: expect.any(String),
    lastModified: expect.any(String),
    tags: [ 
      { projectId: 3,
        tagId: 1,
      },
      { projectId: 3,
        tagId: 2,
      },
      { projectId: 3,
        tagId: 3,
      },
      { projectId: 3,
        tagId: 4,
      },
    ]
  };
  test("ok for logged in user", async function() {
    const response = await request(app)
      .post("/projects")
      .send(newProject)
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      project: addedProject
    });
  });

  test("fails for anonymous user", async function() {
    const response = await request(app)
      .post("/projects")
      .send(newProject);
    expect(response.statusCode).toEqual(401);
  });
});

describe ("POST /projects/:id/tags", function() {
  test("logged in user can add the JS tag to project with id 2", async function() {
    const response = await request(app)
      .post("/projects/2/tags")
      .send({
        tags: [3]
      })
      .set("authorization", `Bearer ${u2Token}`)
    ;
    const responseObject = JSON.parse(response.text);
    expect(response.statusCode).toBe(201);
    expect(responseObject.projectTag).toHaveLength(1);
    expect(responseObject)
      .toEqual({ projectTag: [{
        projectId: 2,
        tagId: 3
      }]})
    ;
  });

  test("anonymous user cannot add a tag to a project", async function() {
    const response = await request(app)
      .post("/projects/2/tags")
      .send({
        tags: [3]
      })
    ;
    // const responseObject = JSON.parse(response.text);
    expect(response.statusCode).toBe(401);
  });
});

describe ("GET /projects", function() {
  test("Get all projects", async function() {
    const response = await request(app).get("/projects").set("authorization", `Bearer ${u2Token}`);
    const responseObject = JSON.parse(response.text);
    const projects = responseObject.projects;
    expect(projects).toHaveLength(2);
  });

  test("Unauthorized user cannot get projects", async function() {
    const response = await request(app)
      .get("/projects")
    ;
    expect(response.statusCode).toEqual(401);
  })
});