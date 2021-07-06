"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Functions for users */

class User {
  /** Purpose: to authenticate a user 
   * 
   * Inputs: username, password
   * 
   * Returns: 
   *   {
   *     user: 
   *       {
   *         username,
   *         firstName,
   *         lastName, 
   *         bio, 
   *         photoUrl, 
   *         portfolioUrl, 
   *         githubUrl,
   *         isAdmin
   *       }
   *   }
   * 
   * Errors: Throws UnauthorizedError if user is not found or password is wrong
  */

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
              username, 
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              bio,
              photo_url AS "photoUrl",
              portfolio_url AS "portfolioUrl",
              github_url AS "githubUrl",
              is_admin AS "isAdmin"
      FROM users
      WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    // if user found, compare hashed password to a new hash from password
    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      // if passwords match, return user (after removing password property)
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    // Error: user not found or password incorrect
    throw new UnauthorizedError("Invalid username and/or password. Please try again.");
  }






  /** Purpose: to register a user
   *
   * Inputs: { username, password, firstName, lastName, email, bio, photoUrl, portfolioUrl, githubUrl }
   * 
   * Returns: 
   *   {
   *     user: 
   *       {
   *         username,
   *         password,
   *         firstName,
   *         lastName, 
   *         bio, 
   *         photoUrl, 
   *         portfolioUrl, 
   *         githubUrl,
   *         isAdmin
   *       }
   *   }
   *
   * Throws BadRequestError on duplicates.
  **/

  // static async register({ username, password, firstName, lastName, bio, photoUrl, portfolioUrl, githubUrl, isAdmin }) {
  //   // check if the username has been taken already
  //   const duplicateCheck = await db.query(
  //     `SELECT username
  //      FROM users
  //      WHERE username = $1`,
  //      [username]
  //   );

  //   // throw error if duplicate found
  //   if (duplicateCheck.rows[0]) {
  //     throw new BadRequestError(`The username '${username}' has been taken; please choose another.`);
  //   }

  //   // no duplicate found; save user to database
  //   const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  //   const result = await db.query(
  //     `INSERT INTO users
  //      (username,
  //       password,
  //       first_name,
  //       last_name,
  //       email,
  //       bio,
  //       photo_url,
  //       portfolio_url,
  //       github_url,
  //       is_admin)
  //     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  //     RETURNING 
  //       id,
  //       username, 
  //       first_name AS "firstName",
  //       last_name AS "lastName",
  //       email, 
  //       bio, 
  //       photo_url AS "photoUrl",
  //       portfolio_url AS "portfolioUrl",
  //       github_url AS "githubUrl",
  //       is_admin AS "isAdmin"`,
  //     [
  //       username,
  //       hashedPassword,
  //       firstName,
  //       lastName,
  //       email,
  //       bio,
  //       photoUrl,
  //       portfolioUrl,
  //       githubUrl,
  //       isAdmin
  //     ],
  //   );

  //   const user = result.rows[0];

  //   return user;
  // }

}


module.exports = User;