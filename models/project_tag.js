"use strict";

const db = require("../db");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Functions for project_tag */

class Project_Tag {
  /** Purpose: to put a tag on a project, update database, and return the data
   * 
   * Input: { projectId, tags: [ tagId, tagId, ... ]}
   * 
   * Returns:
   *   {
   *     project_tags: [
   *       { projectId, tagId },
   *       { projectId, tagId }
   *     ]
   *   }
   * 
   * Error(s):
   */

  static async create(projectId, tags) {
    const results = await Promise.all(
      tags.map(async (tag) => {
        console.log("TAGS CREATOR, project ID: ", projectId, "tag: ", tag);
        const result = await db.query(
        `INSERT INTO projects_tags (
          project_id,
          tag_id
        )
        VALUES ($1, $2)
        RETURNING project_id AS "projectId",
        tag_id AS "tagId"`,
        [
          projectId,
          tag
        ]
        );
        const project_tag = result.rows[0];
        console.log(project_tag);
        return project_tag;
      })
    );
   
    console.log("CREATE TAGS: ", results);

    return results;
  }
}

module.exports = Project_Tag;