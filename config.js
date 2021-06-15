"use strict";

/** Shared config for application; can be req'd many places. */

// require("dotenv").config();

// const SECRET_KEY = process.env.SECRET_KEY || "gra*$jkyuludsth";

const PORT = +process.env.PORT || 3001;

// let BCRYPT_WORK_FACTOR;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'capstone-cnxn-test'
// - else: 'capstone-cnxn'

// let DB_URI = `postgresql://`;

// if (process.env.NODE_ENV === "test") {   // if in testing environment
//   DB_URI = `${DB_URI}/capstone-cnxn-test`;  // use test database called "capstone-cnxn-test"
//   BCRYPT_WORK_FACTOR = 1;
// } else {
//   // otherwise, use the database specified in env variable used in deployment 
//   // (e.g., for Heroku, get from env var DATABASE_URL)
//   DB_URI = process.env.DATABASE_URL || `${DB_URI}/capstone-cnxn`;
//   BCRYPT_WORK_FACTOR = 12;
// }

module.exports = {
  // SECRET_KEY,
  PORT
  // DB_URI,
  // BCRYPT_WORK_FACTOR
};
