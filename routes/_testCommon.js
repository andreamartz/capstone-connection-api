"use strict";

process.env.NODE_ENV = "test" // must come before import of db.js

const db = require("../db.js");
const request = require("supertest");
const app = require("../app");
const { u1Data, u2Data, p1Data, p2Data, c1Data, adminData, pt1Data } = require("./_testCommonData");
const { BCRYPT_WORK_FACTOR, DB_URI } = require("../config");
const User = require("../models/user");
const Project = require("../models/project");
const Tag = require("../models/tag");
const Project_Comment = require("../models/project_comment");
const Project_Like = require("../models/project_like");
const Project_Tag = require("../models/project_tag");
const createToken = require("../helpers/tokens");

let u1, u2, admin;
let p1, p2;
let c1;
let t1, t2, t3, t4;
let pt1, pt2;


async function commonBeforeAll() {
  console.log("INSIDE commonBeforeAll, DB_URI: ", DB_URI);

  // must reset id on projects & delete projects before doing the same for users;  
  await db.query("SELECT setval(pg_get_serial_sequence('projects', 'id'), 1, false) FROM projects");
  await db.query("DELETE FROM projects");

  await db.query("SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false) FROM users");
  await db.query("DELETE FROM users");

  await db.query("SELECT setval(pg_get_serial_sequence('projects_tags', 'id'), 1, false) FROM projects_tags");
  await db.query("DELETE FROM projects_tags");

  await db.query("SELECT setval(pg_get_serial_sequence('tags', 'id'), 1, false) FROM tags");
  await db.query("DELETE FROM tags");

  await db.query("SELECT setval(pg_get_serial_sequence('project_likes', 'id'), 1, false) FROM project_likes");
  await db.query("DELETE FROM project_likes");

  await db.query("SELECT setval(pg_get_serial_sequence('project_comments', 'id'), 1, false) FROM project_comments");
  await db.query("DELETE FROM project_comments");


  u1 = await User.register(u1Data);
  u2 = await User.register(u2Data);

  t1 = await Tag.create({text: 'HTML'});
  t2 = await Tag.create({text: 'CSS'});
  t3 = await Tag.create({text: 'JS'});
  t4 = await Tag.create({text: 'API'});

  p1 = await Project.create(p1Data);
  p2 = await Project.create(p2Data);
  
  c1 = await Project_Comment.create(c1Data);
  
  pt1 = await Project_Tag.create(1, p1Data.tags);
  pt2 = await Project_Tag.create(2, p2Data.tags);
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
const adminToken = createToken(adminData);

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken
};