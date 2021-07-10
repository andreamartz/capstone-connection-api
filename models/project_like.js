"use strict";

const db = require("../db");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Functions for project_likes */

class Project_Like {
  /** Purpose: to create a new like for a project, update database, return new project like data 
   * 
   * Input: 
   * 
   * Returns: 
   * 
   * Errors(s):
  */
  
  static async create(data) {
    let query = `
      INSERT INTO project_likes (
        liker_id,
        project_id
      )
      VALUES($1, $2)
      RETURNING liker_id AS "likerId",
        project_id AS "projectId"
    `;
    const likeRes = await db.query(query, [data.likerId, data.projectId]);

    const like = likeRes.rows[0];

    return like;
  }
}

module.exports = Project_Like;