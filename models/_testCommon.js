const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

// process.env.NODE_ENV = "test"  // CHECK

async function commonBeforeAll() {
  // try {
  //   await db.connect();
  // } catch (err) {
  //   console.error(err);
  // }

  await db.query("DELETE FROM users");
  await db.query("DELETE FROM projects");
  await db.query("DELETE FROM tags");

  // create test users
  // QUESTION:
  // Bkgd: Here, I have hard-coded the user ids, because I wasn't doing that before, and something in in my before, beforeAll, after...etc. is not right so that, while the test users are being correctly deleted, there's a persisting 'memory' for the last user id used. So, with every test run, the users are replaced and have progressively higher id numbers. Then, when I go to create projects, I can't assign a creator_id that will continue to exist.
  // How can I change this so that I am not hard-coding the user ids, but the SERIAL ids will reset after each testing cycle.
  await db.query(`
    INSERT INTO users(
      id,
      username,
      password,
      first_name,
      last_name,
      email,
      bio,
      photo_url,
      portfolio_url,
      github_url,
      is_admin
    )
    VALUES
      (1,
      'user1',
      $1,
      'fn1',
      'ln1',
      'user1@email.com',
      'user1 bio',
      'https://via.placeholder.com/300x300?text=user1+photo',
      'https://via.placeholder.com/150x150?text=user1+portfolio',
      'https://via.placeholder.com/150x150?text=user1+github',
      FALSE),
      (2,
      'user2',
      $2,
      'fn2',
      'ln2',
      'user2@email.com',
      'user2 bio',
      'https://via.placeholder.com/300x300?text=user2+photo',
      'https://via.placeholder.com/150x150?text=user2+portfolio',
      'https://via.placeholder.com/150x150?text=user2+github',
      TRUE)`,
    [
      await bcrypt.hash("pw1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("pw2", BCRYPT_WORK_FACTOR)
    ]
  );

  // create test projects
  await db.query(`
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
      'p1 f_req'),
      ('p2',
      2,
      'https://via.placeholder.com/300x300?text=p2+image',
      'https://via.placeholder.com/300x300?text=p2+repo+url',
      'https://via.placeholder.com/300x300?text=p2+site+url',
      'p2 desc',
      'p2 f_req')`
  );

  // create test tags
  // await db.query(`
  //   INSERT INTO tags(text)
  //   VALUES ('HTML'), ('CSS'), ('JS'), ('API')
  //   RETURNING id`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};