"use strict";

// const { result } = require("lodash");
const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate }  = require("../helpers/sql");

class Project_Comment {

  static async create(data) {
    let query = `
      INSERT INTO project_comments (
        commenter_id,
        project_id,
        comment
      )
      VALUES ($1, $2, $3)
      RETURNING 
        id, 
        commenter_id AS "commenterId",
        project_id AS "projectId",
        comment, 
        created_at AS "createdAt", 
        last_modified AS "lastModified"
    `
    
    const result = await db.query(query, [
      data.commenterId,
      data.projectId,
      data.comment
    ]);

    const project_comment = result.rows[0];
    console.log(project_comment);

    return project_comment;
  }

  static async update(commentId, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        commenterId: "commenter_id",
        projectId: "project_id"
      }
    );

    const commentIdVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE project_comments
      SET ${setCols}
      WHERE id = ${commentIdVarIdx}
      RETURNING
        id, 
        commenter_id AS "commenterId",
        project_id AS "projectId",
        comment, 
        created_at AS "createdAt", 
        last_modified AS "lastModified"
    `;

    const result = await db.query(querySql, [...values, commentId]);
    const comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No comment found with id ${userId}`);

    return comment;
  }

}

module.exports = Project_Comment;