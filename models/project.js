'use strict';

const _ = require('lodash');
const db = require('../db');
const { NotFoundError } = require('../expressError');
const { projectsSqlToExpress } = require('../helpers/projectsSqlToExpress');

/** Functions for projects */

class Project {
	/** Purpose: to create a project (from data), update database, return new project data
	 *
	 * Input: { name, description, creatorId, image, repoUrl, siteUrl, feedbackRequest }
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
		const defaultImageUrl =
			'https://res.cloudinary.com/wahmof2/image/upload/v1626296156/capstone_connections/undraw_Website_builder_re_ii6e.svg';

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
				data.feedbackRequest,
			],
		);

		const project = result.rows[0];

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
		const whereExpressions = [];
		const queryValues = [];
		const sortExpressions = [];
		const { userId, tagText, sortVariable } = filterParams;

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
        (SELECT COUNT(*) FROM project_likes AS pl WHERE p.id = pl.project_id) AS "prjLikesCount",
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

		// set up SQL filter for a specific userId
		if (userId) {
			queryValues.push(userId);
			whereExpressions.push(`u.id = $${queryValues.length}`);
		}

		// set up SQL filter for a specific tag
		if (tagText) {
			queryValues.push(tagText.toUpperCase());
			whereExpressions.push(`p.id IN (
        SELECT pt.project_id FROM projects_tags pt
          WHERE pt.tag_id IN (
            SELECT id FROM tags
              WHERE tags.text = $${queryValues.length}
          )
        )`);
		}

		if (whereExpressions.length) {
			query += ' WHERE ' + whereExpressions.join(' AND ');
		}

		/**  SORT projects */
		if (sortVariable === 'newest') {
			sortExpressions.push('p.created_at DESC');
		}

		if (sortVariable === 'most likes') {
			// sortExpressions.push('p.prjLikesCount DESC');
			sortExpressions.push(
				'(SELECT COUNT(*) FROM project_likes AS pl WHERE p.id = pl.project_id) DESC',
			);
		}

		if (sortExpressions.length) {
			query += ' ORDER BY ' + sortExpressions.join(', ');
		}

		const results = await db.query(query, queryValues);

		let projects = projectsSqlToExpress(results, currentUserId);

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

		const projectRes = await db.query(prjQuery, [id]);
		let projectRows = projectRes.rows;
		// Verify project exists before continuing (& throw error if not)
		if (!projectRows[0]) throw new NotFoundError(`No project ${id} was found.`);

		const project = projectRows.reduce(
			(accumulator, data) => {
				const {
					id,
					name,
					creatorId,
					image,
					repoUrl,
					siteUrl,
					description,
					feedbackRequest,
					createdAt,
					lastModified,
					username,
					firstName,
					lastName,
					photoUrl,
					likeId,
					likerUserId,
				} = data;

				const newRecord = {
					id,
					name,
					image,
					repoUrl,
					siteUrl,
					description,
					feedbackRequest,
					createdAt,
					lastModified,
				};

				newRecord.creator = {
					...accumulator.creator,
					id: creatorId,
					username,
					firstName,
					lastName,
					photoUrl,
				};

				if (likeId) {
					newRecord.likes = [...accumulator.likes, { likeId, likerUserId }];
				} else {
					newRecord.likes = [...accumulator.likes];
				}

				return newRecord;
			},
			{
				id,
				name: '',
				image: '',
				repoUrl: '',
				siteUrl: '',
				description: '',
				feedbackRequest: '',
				createdAt: '',
				lastModified: '',
				creator: {},
				likes: [],
			},
		);

		project.likesCount = project.likes.length;

		const likedByCurrentUser = project.likes.find(
			(like) => like.likerUserId === currentUserId,
		);

		delete project.likes;

		project.currentUsersLikeId = likedByCurrentUser
			? likedByCurrentUser.likeId
			: null;

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
		const comments = commentsRes.rows.map((c) => ({
			id: c.id,
			comment: c.comment,
			commentCreatedAt: c.commentCreatedAt,
			commentLastModified: c.commentLastModified,
			commenter: {
				id: c.commenterId,
				firstName: c.firstName,
				lastName: c.lastName,
				photoUrl: c.photoUrl,
			},
		}));

		project.comments = comments;

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

	static async update(id, data) {}

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

		if (!project) throw new NotFoundError(`No project ${id} was found.`);
	}
}

module.exports = Project;
