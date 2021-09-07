'use strict';

process.env.NODE_ENV = 'test'; // must come before import of db.js

const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');
const db = require('../db.js');
const User = require('../models/user');
const Project = require('../models/project');
const Tag = require('../models/tag');
const Project_Comment = require('../models/project_comment');
const Project_Like = require('../models/project_like');
const Project_Tag = require('../models/project_tag');
const { createToken } = require('../helpers/tokens');

async function commonBeforeAll() {
  // try {
  //   await db.connect();
  // } catch (err) {
  //   console.error(err);
  // }

  const hashedPw1 = await bcrypt.hash('pw1', BCRYPT_WORK_FACTOR);
  const hashedPw2 = await bcrypt.hash('pw2', BCRYPT_WORK_FACTOR);

  /**
   * reset database id sequence on projects and delete projects
   * this must come before doing the same for users;
   */
  await db.query(
    "SELECT setval(pg_get_serial_sequence('projects', 'id'), 1, false) FROM projects"
  );
  await db.query('DELETE FROM projects');

  // reset database id sequence on users and delete users

  await db.query(
    "SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false) FROM users"
  );
  await db.query('DELETE FROM users');

  // reset database id sequence on projects_tags join table and delete projects_tags
  await db.query(
    "SELECT setval(pg_get_serial_sequence('projects_tags', 'id'), 1, false) FROM projects_tags"
  );
  await db.query('DELETE FROM projects_tags');

  // reset database id sequence on tags and delete tags

  await db.query(
    "SELECT setval(pg_get_serial_sequence('tags', 'id'), 1, false) FROM tags"
  );
  await db.query('DELETE FROM tags');

  // reset database id sequence on project_likes and delete project_likes
  await db.query(
    "SELECT setval(pg_get_serial_sequence('project_likes', 'id'), 1, false) FROM project_likes"
  );
  await db.query('DELETE FROM project_likes');

  // reset database id sequence on comments and delete comments
  await db.query(
    "SELECT setval(pg_get_serial_sequence('project_comments', 'id'), 1, false) FROM project_comments"
  );
  await db.query('DELETE FROM project_comments');

  // create test users
  await db.query(
    `
    INSERT INTO users(username, password, first_name, last_name, email, bio, photo_url, portfolio_url, github_url, is_admin)
    VALUES
      ('username1',
      $1,
      'fn1',
      'ln1',
      'user1@email.com',
      'user1 bio',
      'https://via.placeholder.com/300x300?text=user1+photo',
      'https://via.placeholder.com/150x150?text=user1+portfolio',
      'https://via.placeholder.com/150x150?text=user1+github',
      FALSE),
      ('username2',
      $2,
      'fn2',
      'ln2',
      'user2@email.com',
      'user2 bio',
      'https://via.placeholder.com/300x300?text=user2+photo',
      'https://via.placeholder.com/150x150?text=user2+portfolio',
      'https://via.placeholder.com/150x150?text=user2+github',
      TRUE)`,
    [hashedPw1, hashedPw2]
  );

  // create test tags
  const tags = await db.query(`
    INSERT INTO tags(text)
    VALUES ('HTML'),
           ('CSS'),
           ('JS'),
           ('API')
    RETURNING id, text`);

  // create test project 1
  const project1 = await db.query(`
    INSERT INTO projects(
      name,
      creator_id,
      image,
      repo_url,
      site_url,
      description,
      feedback_request
    )
    VALUES
      ('p1',
      1,
      'https://via.placeholder.com/300x300?text=p1+image',
      'https://via.placeholder.com/300x300?text=p1+repo+url',
      'https://via.placeholder.com/300x300?text=p1+site+url',
      'p1 desc',
      'p1 f_req')`);

  // user 2 likes project 1
  const projectLike1 = await db.query(
    `
    INSERT INTO project_likes(
      liker_id,
      project_id
    )
    VALUES ($1, $2)
    RETURNING id, liker_id AS "likerId",
        project_id AS "projectId"`,
    [2, 1]
  );

  const p1Like = projectLike1.rows[0];
  console.log('PROJECTLIKE1', projectLike1, 'P1LIKE: ', p1Like);

  // create test project 2 separately so it will hopefully have a different creation timestamp
  const project2 = await db.query(`
  INSERT INTO projects(
    name,
    creator_id,
    image,
    repo_url,
    site_url,
    description,
    feedback_request
  )
  VALUES
    ('p2',
    2,
    'https://via.placeholder.com/300x300?text=p2+image',
    'https://via.placeholder.com/300x300?text=p2+repo+url',
    'https://via.placeholder.com/300x300?text=p2+site+url',
    'p2 desc',
    'p2 f_req')`);

  const p1 = project1.rows.filter((p) => p.id === 1);
  const p1Tags = await Project_Tag.create(1, [3, 4]);
  p1.tags = p1Tags;
  p1.likes = [p1Like];

  const p2 = project2.rows.filter((p) => p.id === 2);
  const p2Tags = await Project_Tag.create(2, [1, 2, 4]);
  p2.tags = p2Tags;
}

async function commonBeforeEach() {
  await db.query('BEGIN');
}

async function commonAfterEach() {
  await db.query('ROLLBACK');
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
