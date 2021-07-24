"use strict";

const { result } = require("lodash");
const db = require("../db");

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
      data.commenter_id,
      data.project_id,
      data.comment
    ]);

    const project_comment = result.rows[0];
    console.log(project_comment);

    return project_comment;
  }

}

module.exports = Project_Comment;