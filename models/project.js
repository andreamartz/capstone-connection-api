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
        creator_id,
        image,
        repo_url,
        site_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, image, repo_url AS "repoUrl", site_url AS "siteUrl"`,
      [
        data.name,
        data.creatorId,
        data.image,
        data.repoUrl,
        data.siteUrl
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
   *           creatorId,
   *           firstName,
   *           lastName,
   *           photoUrl
   *         }
   *         tags: [
   *           {tagId, tagText},
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
          creatorId,
          firstName, 
          lastName, 
          photoUrl
        };

        // Store project tags data in an array
        prj.tags = [...prj.tags, {tagId, tagText}];

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
  *       creatorId,
  *       image, 
  *       repoUrl, 
  *       siteUrl,
  *       description, 
  *       feedbackRequest,
  *       createdAt, 
  *       lastModified,
  *       user: {
  *         firstName,
  *         lastName,
  *         photoUrl
  *       },
  *       projectLikesCount,
  *       tags: [
  *         text,
  *         text,
  *         ...
  *       ]
  *       comments: [
  *         {
  *           id,
  *           comment,
  *           lastModified,
  *           commentLikesCount,
  *           user: {
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

  // IN PROGRESS
  static async getOne(id) {
    let query = `
    SELECT 
      p.id,
      p.name,
      p.creator_id AS "creatorId",
      p.image,
      c.comment
    FROM projects p
    LEFT JOIN comments AS c
    ON u.id = p.creator_id
    `;

    // query += " ORDER BY lastModified";
    console.log("QUERY: ", query);
    const results = await db.query(query);
    console.log("RESULTS.ROWS: ", results.rows);

    // console.log("RESULTS: ", results);
    return results.rows;
  }



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
        creator_id,
        image,
        repo_url,
        site_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, image, repo_url AS "repoUrl", site_url AS "siteUrl"`,
      [
        data.name,
        data.creatorId,
        data.image,
        data.repoUrl,
        data.siteUrl
      ]
    );
    
    const project = result.rows[0];

    return project;
  }
}

module.exports = Project;