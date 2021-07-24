"use strict";

/** Shared config for application; can be req'd many places. */

require("dotenv").config();

// CHECK: is dotenv set up properly here? Do I need to require dotenv in other files?

const PORT = +process.env.PORT;
let DB_URI = process.env.DB_URI;
let BCRYPT_WORK_FACTOR;


// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'capstone_connections_test'
// - else: 'capstone_connections'


// if in testing environment, use the test database
if (process.env.NODE_ENV === "test") {   
  DB_URI = `${DB_URI}/capstone_connections_test`; 
  BCRYPT_WORK_FACTOR = 1;
} else {
  // otherwise, use the database specified in env variable used in deployment (e.g., for Heroku, get from env var DATABASE_URL)
  // if project not deployed, use the local database
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/capstone_connections`;

  BCRYPT_WORK_FACTOR = +process.env.BCRYPT_WORK_FACTOR;
}

module.exports = {
  PORT,
  DB_URI,
  BCRYPT_WORK_FACTOR
};
