"use strict";

/** Database setup for capstone connections */

const { Client } = require("pg");

const { DB_URI } = require("./config");

// USE FOR LOCAL SERVER
// const db = new Client({
//   connectionString: DB_URI
// });

// USE FOR DEPLOYMENT; also, you need to add to .env file the DATABASE_URL of the deployed database (and NODE_ENV??)
const db = new Client({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("DB_URI: ", DB_URI);
db.connect();

module.exports = db;