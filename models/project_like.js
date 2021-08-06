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
   * Input: {
   *   likerId,
   *   projectId
   * }
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
      RETURNING id, liker_id AS "likerId",
        project_id AS "projectId"
    `;
    const likeRes = await db.query(query, [
      data.likerId, 
      data.projectId
    ]);

    const like = likeRes.rows[0];
    console.log("LIKE: ", like);

    return like;
  }

  /** Purpose: to delete a like from a project in database
   * 
   * Input: { id }
   * 
   * Returns: 
   * 
   * Errors(s):
  */
  
  static async remove(id) {
    const query = `
      DELETE
      FROM project_likes
      WHERE id = $1
      RETURNING id
    `;

    const result = await db.query(query, [id]);
    const unlike = result.rows[0];

    if (!unlike) throw new NotFoundError(`No like found with id ${id}`);

    return unlike;
  }
}

module.exports = Project_Like;