"use strict";

/** Database setup for capstone connections */

const { Client } = require("pg");

// CHECK: use dotenv here?

const { DB_URI } = require("./config");

 const db = new Client({
   connectionString: DB_URI,
   ssl: true
});

console.log("DB_URI: ", DB_URI);
// db.connect();

db.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

module.exports = db;