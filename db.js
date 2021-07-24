"use strict";

/** Database setup for capstone connections */

const { Client } = require("pg");

// CHECK: use dotenv here?

const { DB_URI } = require("./config");

const db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;