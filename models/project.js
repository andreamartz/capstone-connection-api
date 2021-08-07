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
    const defaultImageUrl = "https://res.cloudinary.com/wahmof2/image/upload/v1626296156/capstone_connections/undraw_Website_builder_re_ii6e.svg";

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
      RETURNING id, name, image, repo_url AS "repoUrl", site_url AS "siteUrl", created_at AS "createdAt", last_modified AS "lastModified"`,
      [
        data.name,
        data.description,
        data.creatorId,
        data.image || defaultImageUrl,
        data.repoUrl,
        data.siteUrl,
        data.feedbackRequest
      ]
    );

    const project = result.rows[0];
    // console.log("PROJECT: ", project);

    return project;
  }


  /** Purpose: get all projects 
   * 
   * Input: currentUserId, filterParams
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
   *         },
   *         tags: [
   *           {id, text},
   *           {...},
   *           ...
   *         ],
   *         currentUsersLikeId,
   *         likesCount
   *       },
   *       {
   *       ...
   *       }
   *     ]
   *   }
   * 
   * Error(s): 
   */

  static async getAll(currentUserId, filterParams = {}) {
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
        pl.id AS "likeId",
        pl.liker_id AS "likerUserId",
        (SELECT COUNT(*) FROM project_comments AS pc WHERE p.id = pc.project_id) AS "prjCommentsCount"
      FROM projects p
      LEFT JOIN users AS u
      ON p.creator_id = u.id
      LEFT JOIN projects_tags AS pt
      ON pt.project_id = p.id
      LEFT JOIN tags AS t
      ON t.id = pt.tag_id
      LEFT JOIN project_likes AS pl
      ON pl.project_id = p.id
    `;
    
    const whereExpressions = [];
    const queryValues = [];

    const { userId, tagText } = filterParams;

    if (userId) {
      queryValues.push(userId);
      whereExpressions.push(`u.id = $${queryValues.length}`);
      console.log("QUERY VALUES: ", queryValues);
      console.log("WHERE EXPRESSIONS: ", whereExpressions);
    };

    if (tagText) {
      queryValues.push(tagText);
      whereExpressions.push(`t.text = $${queryValues.length}`);
    };

    
    if (whereExpressions.length) {
      query += " WHERE " + whereExpressions.join(' AND ');
    }

    // CHECK: QUESTION: why is it not sorting on lastModified?
    query += " ORDER BY p.id DESC";
    console.log("QUERY: ", query, "QUERY VALUES: ", queryValues);

    const results = await db.query(query, queryValues);
    // console.log("RESULTS: ", results);

    // Group results data by project id
    let prjRows = _.groupBy(results.rows, row => row.id);
  
    // Create (empty) projects array to push project data into
    let projects = [];

    console.log("PRJROWS: ", prjRows);
    // For loop takes result data grouped by project id and removes duplicate information to create an array of projects
    // QUESTION: This is essentially a nested loop (array reduce method used inside of for loop). Is there a better way?
    for (let prop in prjRows) {
      let prjRow = prjRows[prop].reduce((accumulator, data) => {
        const { id, name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, tagId, tagText, likeId, likerUserId, prjCommentsCount, creatorId, firstName, lastName, photoUrl } = data;

        // The following code works but is not efficient since the values are overwritten on every iteration. (Same question for prj.creator below)
        // CHECK: QUESTION: Is there a better way?
        const newRecord = {id, name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, prjCommentsCount: +prjCommentsCount};
        
        // Store project creator data in an object
        newRecord.creator = { 
          id: creatorId,
          firstName, 
          lastName, 
          photoUrl
        };

        // Store project tags data in an array
        if (tagId) {
          newRecord.tags = [...accumulator.tags, {id: tagId, text: tagText}];
        }

        if (likeId) {
          newRecord.likes = [...accumulator.likes, {likeId, likerUserId}];
        }

        return newRecord;
      }, { id: +prop, 
           name: "",
           image: "", 
           repoUrl: "", 
           siteUrl: "", 
           description: "", 
           feedbackRequest: "", 
           createdAt: "", 
           lastModified: "", 
           prjCommentsCount: null,
           creator: {}, 
           tags: [],
           likes: []
      });
      
      projects.push(prjRow);
    };

    for (const project of projects) {
      const uniqTags = _.uniqBy(project.tags, function(tag){
        return tag.id;
      });

      project.tags = uniqTags;

      const uniqLikes = _.uniqBy(project.likes, function(like) {
        return like.likeId;
      });

      // project.likes = uniqLikes;

      project.likesCount = uniqLikes.length;
      
      console.log("PROJECT.LIKES: ", project.likes);
      delete project.likes;
      
      const likedByCurrentUser = uniqLikes.find(like => like.likerUserId === currentUserId);
      
      project.currentUsersLikeId = likedByCurrentUser ? likedByCurrentUser.likeId : null;
    }

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
  *       creator: {
  *         creatorId,
  *         firstName,
  *         lastName,
  *         photoUrl
  *       },
  *       tags: [
  *         { id, text },
  *         ...
  *       ],
  *       likesCount, 
  *       currentUsersLikeId,
  *       comments: [
  *         {
  *           id,
  *           comment,
  *           commentCreatedAt,
  *           commentLastModified,
  *           commentLikesCount,
  *           commenter: {
  *             commenterId,
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

  static async getOne(currentUserId, id) {
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
        u.username,
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.photo_url AS "photoUrl",
        pl.id AS "likeId",
        pl.liker_id AS "likerUserId"
      FROM projects p
      LEFT JOIN users AS u
      ON u.id = p.creator_id
      LEFT JOIN project_likes AS pl
      ON pl.project_id = p.id
      WHERE p.id = $1
    `;

    // (SELECT COUNT(*) FROM project_likes AS pl WHERE p.id = pl.project_id) AS "likesCount"

    const projectRes = await db.query(prjQuery, [id]);
    console.log("PROJECTRES.ROWS: ", projectRes.rows);
    let projectRows = projectRes.rows;
    // Verify project exists before continuing (& throw error if not)
    if (!projectRows) throw new NotFoundError(`No project ${id} was found.`);
    

    const project = projectRows.reduce((accumulator, data) => {
      const { id, name, creatorId, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified, username, firstName, lastName, photoUrl, likeId, likerUserId } = data;

      const newRecord = {id, name, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified 
      };

      newRecord.creator = { ...accumulator.creator, 
        id: creatorId,
        username,
        firstName,
        lastName,
        photoUrl
      };

      if (likeId) {
        newRecord.likes = [...accumulator.likes, {likeId, likerUserId}];
      } else {
        newRecord.likes = [...accumulator.likes]
      }
      
      return newRecord;
    }, { id,
      name: "",
      image: "",
      repoUrl: "",
      siteUrl: "",
      description: "",
      feedbackRequest: "",
      createdAt: "",
      lastModified: "",
      creator: {},
      likes: []
    });

    console.log("PROJECT: ", project);
    
    project.likesCount = project.likes.length;

    const likedByCurrentUser = project.likes.find(like => like.likerUserId === currentUserId);

    delete project.likes;

    project.currentUsersLikeId = likedByCurrentUser ? likedByCurrentUser.likeId : null;

    // Verify project exists before continuing (& throw error if not)
    if (!project) throw new NotFoundError(`No project ${id} was found.`);

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

 /** Purpose: update a project with `data`
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

  static async update(id, data) {
    
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