"use strict";

const _ = require('lodash');
const db = require("../db");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Functions for projects */

class Project {
  /** Purpose: to create a project (from data), update database, return new project data
   * 
   * Input: { name, creatorId, image, repoUrl, description }
   * 
   * Returns:
   *   {
   *     project: {
   *        id,
   *        name,
   *        creatorId,
   *        image, 
   *        repoUrl, 
   *        siteUrl
   *        description, 
   *        feedbacRequest
   *        createdAt, 
   *        lastModified,
   *        creator: {
   *          firstName,
   *          lastName,
   *          photoUrl
   *        }
   *        tags: [
   *          {tagId, tagText},
   *          {...},
   *          ...
   *        ]
   *     },
   *   }
   * Error(s): 
   */

   static async create(data) {
    const result = await db.query(
      `INSERT INTO projects (
        name,
        description,
        creator_id,
        image,
        repo_url,
        site_url,
        feedback_request
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, image, repo_url AS "repoUrl", site_url AS "siteUrl"`,
      [
        data.name,
        data.description,
        data.creatorId,
        data.image,
        data.repoUrl,
        data.siteUrl,
        data.feedbackRequest
      ]
    );
    
    const project = result.rows[0];

    return project;
  }


  /** Purpose: get all projects 
   * 
   * Input: none
   * 
   * Returns:
   *   {
   *     projects: [ 
   *       {
   *         id,
   *         name,
   *         creatorId,
   *         image, 
   *         repoUrl, 
   *         siteUrl,
   *         description, 
   *         feedbackRequest,
   *         createdAt, 
   *         lastModified,
   *         prjLikesCount,
   *         prjCommentsCount,
   *         creator: {
   *           id,
   *           firstName,
   *           lastName,
   *           photoUrl
   *         }
   *         tags: [
   *           {id, text},
   *           {...},
   *           ...
   *         ]
   *       },
   *       {
   *       ...
   *       }
   *     ]
   *   }
   * 
   * Error(s): 
   */

  static async getAll() {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.creator_id AS "creatorId",
        p.image,
        p.repo_url AS "repoUrl",
        p.site_url AS "siteUrl",
        p.description,
        p.feedback_request AS "feedbackRequest",
        p.created_at AS "createdAt",
        p.last_modified AS "lastModified",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.photo_url AS "photoUrl",
        t.id AS "tagId",
        t.text AS "tagText",
        (SELECT COUNT(*) FROM project_likes AS pl WHERE p.id = pl.project_id) AS "prjLikesCount",
        (SELECT COUNT(*) FROM project_comments AS pc WHERE p.id = pc.project_id) AS "prjCommentsCount"
      FROM projects p
      LEFT JOIN users AS u
      ON p.creator_id = u.id
      LEFT JOIN projects_tags AS pt
      ON pt.project_id = p.id
      LEFT JOIN tags AS t
      ON t.id = pt.tag_id
    `;

    let whereExpressions = [];


    // QUESTION: why is it not sorting on lastModified?
    query += " ORDER BY p.last_modified DESC";

    const results = await db.query(query);

    // Reduce duplication by grouping results data by project id
    let prjRows = _.groupBy(results.rows, row => row.id);


    // Create (empty) projects array to push project data into
    let projects = [];


    // For loop takes result data grouped by project id and removes duplicate information to create an array of projects
    // QUESTION: This is essentially a nested loop (array reduce method used inside of for loop). Is there a better way?
    for (let prop in prjRows) {
      let prjRow = prjRows[prop].reduce((prj, data) => {

        // Destructure variables from data
        const { name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, tagId, tagText, prjLikesCount, prjCommentsCount, creatorId, firstName, lastName, photoUrl } = data;

        // The following code works but is not efficient since the values are overwritten on every iteration. (Same question for prj.creator below)
        // QUESTION: Is there a better way?
        prj = {...prj, name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, prjLikesCount: +prjLikesCount, prjCommentsCount: +prjCommentsCount};
        
        // Store project creator data in an object
        prj.creator = { 
          id: creatorId,
          firstName, 
          lastName, 
          photoUrl
        };

        // Store project tags data in an array
        prj.tags = [...prj.tags, {id: tagId, text: tagText}];

        return prj;
      }, { id: +prop, 
           name: "",
           image: "", 
           repoUrl: "", 
           siteUrl: "", 
           description: "", 
           feedbackRequest: "", 
           createdAt: "", 
           lastModified: "", 
           prjLikesCount: null,
           prjCommentsCount: null,
           creator: {}, 
           tags: [] 
      });
      projects.push(prjRow);
    };

    return projects;
  }

  /** Purpose: get a project by id
  * 
  * Input: none
  * 
  * Returns:
  *   {
  *     project: {
  *       id,
  *       name,
  *       image, 
  *       repoUrl, 
  *       siteUrl,
  *       description, 
  *       feedbackRequest,
  *       createdAt, 
  *       lastModified,
  *       user: {
  *         creatorId,
  *         firstName,
  *         lastName,
  *         photoUrl
  *       },
  *       projectLikesCount,
  *       tags: [
  *         { id, text },
  *         ...
  *       ]
  *       comments: [
  *         {
  *           id,
  *           comment,
  *           commentCreatedAt,
  *           commentLastModified,
  *           commentLikesCount,
  *           user: {
  *             commenter_id,
  *             firstName,
  *             lastName,
  *             photoUrl
  *           }
  *         },
  *         {
  *           ...
  *         }
  *       ]
  *     } 
  *   }
  *  
  *  Error(s): 
  */

  static async getOne(id) {
    const prjQuery = `
      SELECT 
        p.id AS id,
        p.name AS name,
        p.creator_id AS "creatorId",
        p.image,
        p.repo_url AS "repoUrl",
        p.site_url AS "siteUrl",
        p.description,
        p.feedback_request AS "feedbackRequest",
        p.created_at AS "createdAt",
        p.last_modified AS "lastModified",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.photo_url AS "photoUrl",
        (SELECT COUNT(*) FROM project_likes AS pl WHERE p.id = pl.project_id) AS "prjLikesCount"
      FROM projects p
      LEFT JOIN users AS u
      ON u.id = p.creator_id
      WHERE p.id = $1
    `;

    const projectRes = await db.query(prjQuery, [id]);
    let project = projectRes.rows[0];
    
    const { name, creatorId, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, firstName, lastName, photoUrl, prjLikesCount } = project;

    project = { id: +id, name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, prjLikesCount: +prjLikesCount };

    const creator = { 
      creatorId,
      firstName,
      lastName,
      photoUrl
    };
    
    project.creator = creator;
    
    // Verify project exists before continuing (& throw error if not)
    if (!project) throw new NotFoundError(`No project: ${id} was found.`);

    // Query to get project's tags
    const projectsTagsQuery = `
      SELECT 
        pt.tag_id AS "id",
        t.text
      FROM projects_tags AS pt
      LEFT JOIN tags AS t
      ON t.id = pt.tag_id
      WHERE project_id = $1
      ORDER BY pt.id
    `;

    const projectsTagsRes = await db.query(projectsTagsQuery, [id]);

    project.tags = projectsTagsRes.rows;

    
    // Query to get project's comments
    const commentsQuery = `
      SELECT 
        pc.id,
        pc.commenter_id AS "commenterId",
        pc.comment,
        pc.created_at AS "createdAt",
        pc.last_modified AS "lastModified",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.photo_url AS "photoUrl"
      FROM project_comments AS pc
      LEFT JOIN users AS u
      ON u.id = pc.commenter_id
      WHERE pc.project_id = $1
      ORDER BY pc.created_at DESC
      `;
    
      const commentsRes = await db.query(commentsQuery, [id]);
      const comments = commentsRes.rows.map(c => (
        {
          id: c.id,
          comment: c.comment,
          commentCreatedAt: c.commentCreatedAt,
          commentLastModified: c.commentLastModified,
          commenter: {
            id: c.commenterId,
            firstName: c.firstName,
            lastName: c.lastName,
            photoUrl: c.photoUrl
          }
        }
      ));

      project.comments = comments;

      console.log("PROJECT: ", project);

    return project;
  }
}

   /** Purpose: delete a project
  * 
  * Input: 
  * 
  * Returns:
  *   {
  *     project: {
  *     } 
  *   }
  *  
  *  Error(s): 
  */
 
  static async remove(id) {
    const query = `
      DELETE
      FROM projects
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    const project = result.rows[0];

    if (!project) throw new NotFoundError(`No project ${id} was found.`)
  }

}



module.exports = Project;