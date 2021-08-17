"use strict";

process.env.NODE_ENV = "test" // must come before import of db.js

const db = require("../db.js");
const request = require("supertest");
const app = require("../app");
const { u1Data, u2Data, p1Data, p2Data, pt1Data } = require("./_testCommonData");
const { BCRYPT_WORK_FACTOR, DB_URI } = require("../config");
const User = require("../models/user");
const Project = require("../models/project");
const Tag = require("../models/tag");
const Project_Comment = require("../models/project_comment");
const Project_Like = require("../models/project_like");
const Project_Tag = require("../models/project_tag");
const createToken = require("../helpers/tokens");

let u1, u2;
let p1, p2;


async function commonBeforeAll() {
  console.log("INSIDE commonBeforeAll, DB_URI: ", DB_URI);

  // must reset id on projects & delete projects before doing the same for users;  
  await db.query("SELECT setval(pg_get_serial_sequence('projects', 'id'), 1, false) FROM projects");
  await db.query("DELETE FROM projects");

  await db.query("SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false) FROM users");
  await db.query("DELETE FROM users");



  // await db.query("DELETE FROM tags");
  // await db.query("DELETE FROM project_likes");
  // await db.query("DELETE FROM project_comments");
  // await db.query("DELETE FROM projects_tags");

  u1 = await User.register(u1Data);
  u2 = await User.register(u2Data);
  console.log("U1: ", u1, "U2: ", u2);

  p1 = await Project.create(p1Data);
  p2 = await Project.create(p2Data);
  pt1 = await Project_Tag.create(pt1Data);
  console.log("P1: ", p1, "P2: ", p2);
};

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ u1 });
const u2Token = createToken({ u2 });
const adminToken = createToken({
  username: "admin", 
  isAdmin: true 
});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
};