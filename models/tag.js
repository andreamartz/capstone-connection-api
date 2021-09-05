'use strict';

const db = require('../db');
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require('../expressError');

/** Functions for tags */
class Tag {
  /** Purpose: to create a new tag
   *
   * Input: { text }
   *
   * Returns:
   *   { tag: { id, text } }
   */
  static async create(data) {
    const result = await db.query(
      `INSERT INTO tags (text)
      VALUES ($1)
      RETURNING id, text`,
      [data.text]
    );

    const tag = result.rows[0];

    return tag;
  }

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
    const tags = tagsRes.rows;
    console.log('tags: ', tags);

    return tags;
  }
}

module.exports = Tag;
