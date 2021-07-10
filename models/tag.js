"use strict";

const db = require("../db");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../expressError");
// const { sqlForPartialUpdate } = require("../helpers/sql");


/** Functions for tags */

class Tag {
  /** Purpose: to get all tags
   * 
   * Input: none
   * 
   * Returns:
   *   {
   *     tags: [
   *       { 
   *         id,
   *         text
   *       },
   *       ...
   *     ]
   *   }
   */

  static async getAll() {
    let query = `
      SELECT
        id,
        text
      FROM tags
    `;
    const tagsRes = await db.query(query);
    const tags = tagsRes.rows[0];
    console.log("tags: ", tags);

    return tags;
  }
}


module.exports = Tag;