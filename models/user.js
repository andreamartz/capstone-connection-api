"use strict";

// const _ = require('lodash');
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { sqlForPartialUpdate }  = require("../helpers/sql");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../expressError");

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
   * Inputs: { username, password, firstName, lastName, email, bio, photoUrl, portfolioUrl, gitHubUrl }
   * 
   * Returns: 
   *   {
   *     user: 
   *       { 
   *         id,
   *         username,
   *         firstName,
   *         lastName, 
   *         email,
   *         bio, 
   *         photoUrl, 
   *         portfolioUrl, 
   *         gitHubUrl,
   *         isAdmin
   *       }
   *   }
   *
   * Throws BadRequestError on duplicates.
  **/

  static async register({
    username, 
    password, 
    firstName, 
    lastName, 
    email, 
    bio, 
    photoUrl, 
    portfolioUrl, 
    gitHubUrl, 
    isAdmin }) {
    // check if the username has been taken already
    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
       [username]
    );

    // throw error if duplicate found
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`The username '${username}' has been taken; please choose another.`);
    }
    // const defaultImageUrl = "https://res.cloudinary.com/wahmof2/image/upload/v1628100605/capstone_connections/users_capstone_connections/default-user-icon.png";

    // no duplicate found; save user to database
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    
    const query = `
      INSERT INTO users
        (username,
        password,
        first_name,
        last_name,
        email,
        bio,
        photo_url,
        portfolio_url,
        github_url,
        is_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING 
        id,
        username, 
        first_name AS "firstName",
        last_name AS "lastName",
        email, 
        bio, 
        photo_url AS "photoUrl",
        portfolio_url AS "portfolioUrl",
        github_url AS "gitHubUrl",
        is_admin AS "isAdmin"
    `;
    const result = await db.query(query,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email,
        bio,
        photoUrl,
        portfolioUrl,
        gitHubUrl,
        isAdmin
      ],
    );
    
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`Could not register user. Please try again later.`)

    return user;
  }

  /** Purpose: Get a specific user by username 
   * 
   * Inputs: none
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
   *         gitHubUrl,
   *         isAdmin
   *       }
   *   }
   * 
   * Errors: Throws UnauthorizedError if user is not found or password is wrong
  */

  static async getOne(userId) {
    if (!userId) {
      throw new BadRequestError('No user id was provided.');
    }

    // const queryUserId = `
    //   SELECT
    //     id,
    //     username
    //   FROM users
    //   WHERE id = $1
    // `;

    // const userIdQueryRes = await db.query(queryUserId, [userId]);

    const query = `
      SELECT 
        u.id,
        u.username,
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.bio,
        u.photo_url AS "photoUrl",
        u.portfolio_url AS "portfolioUrl",
        u.github_url AS "gitHubUrl",
        p.id AS "projectId",
        p.name AS name,
        p.creator_id AS "creatorId",
        p.image,
        p.repo_url AS "repoUrl",
        p.site_url AS "siteUrl",
        p.description,
        p.feedback_request AS "feedbackRequest",
        p.created_at AS "createdAt",
        p.last_modified AS "lastModified"
      FROM users u
      LEFT JOIN projects AS p
      ON u.id = p.creator_id
      WHERE u.id = $1    
    `;

    const userResults = await db.query(query, [userId]);

    if (userResults.rows.length === 0) {
      throw new NotFoundError(`Could not find user with id: ${userId}.`);
    }

    const projects = [];

    for (let i = 0; i < userResults.rows.length; i++) {
      const { projectId, name, creatorId, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified } = userResults.rows[i];

      let project = { projectId, name, creatorId, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified };

      projects.push(project);
    }

    const { id, username, firstName, lastName, bio, photoUrl, portfolioUrl, gitHubUrl } = userResults.rows[0];

    const user = { id, username, firstName, lastName, bio, photoUrl, portfolioUrl, gitHubUrl };

    user.projects = projects;

    console.log("USER: ", user);

    return user;
  }

  /** Update user data with `data` */
  static async update(userId, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name",
        portfolioUrl: "portfolio_url",
        gitHubUrl: "github_url"
      }
    );

    const userIdVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE users
      SET ${setCols}
      WHERE id = ${userIdVarIdx}
      RETURNING id,
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        bio,
        portfolio_url AS "portfolioUrl",
        github_url AS "gitHubUrl"
    `;

    const result = await db.query(querySql, [...values, userId]);
    const user =  result.rows[0];

    if (!user) throw new NotFoundError(`No user found with id ${userId}`);

    // delete user.password;
    return user;
  }



  /** Purpose: to remove a user 
   * 
   * Inputs: username
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
  static async remove(id) {
    const query = `
      DELETE
      FROM users
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with id ${id} was found.`);
  }
}


module.exports = User;