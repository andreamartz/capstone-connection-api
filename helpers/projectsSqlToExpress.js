'use strict';

const _ = require('lodash');

/** fromDbToExpress
 *
 *  Input: array of project objects with lots of duplicated info
 *
 *  prjRows will look like this:
 *   {
 *     '1': [{...}, {...}],
 *     '2': [{...}, {...}],
 *   }
 *
 *   * Each property in prjRows is a project id, and each value is an array of project objects.
 *   * Most of the data in each project array is duplicated in each project object.
 *   *This happens because there can be multiple tags, multiple comments, and multiple likes associated with a single project.
 *
 * Purpose: fromDbToExpress reduces each project array down to a single object and pushes it onto a new array, called 'projects', which is returned from the function.
 *
 * Returns: an array of individual project objects
 */

const projectsSqlToExpress = (results, currentUserId) => {
	const projects = [];

	const uniqueProjectIds = _.uniqBy(results.rows, 'id').map(
		(project) => project.id,
	);

	// Group results data by project id
	const prjRows = _.groupBy(results.rows, (row) => row.id);

	/**
	 * Reduce each project array down to a single project object.
	 */

	for (const id of uniqueProjectIds) {
		const prjRow = prjRows[id].reduce(
			(accumulator, data) => {
				const {
					id,
					name,
					image,
					repoUrl,
					siteUrl,
					description,
					feedbackRequest,
					createdAt,
					lastModified,
					tagId,
					tagText,
					likeId,
					likerUserId,
					prjCommentsCount,
					prjLikesCount,
					creatorId,
					firstName,
					lastName,
					photoUrl,
				} = data;

				// Create record containing project-level data
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
					prjCommentsCount: +prjCommentsCount,
					likesCount: +prjLikesCount,
					likes: [],
				};

				// Store project creator data in an object
				newRecord.creator = {
					id: creatorId,
					firstName,
					lastName,
					photoUrl,
				};

				// Store project tags data in an array
				if (tagId) {
					newRecord.tags = [...accumulator.tags, { id: tagId, text: tagText }];
				}

				// Store project likes data in an array
				if (likeId) {
					newRecord.likes = [...accumulator.likes, { likeId, likerUserId }];
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
				prjCommentsCount: null,
				prjLikesCount: null,
				creator: {},
				tags: [],
				likes: [],
			},
		);
		projects.push(prjRow);
	}

	/**
	 * Eliminate duplicates in tags and likes arrays on each project.
	 */
	for (const project of projects) {
		// create array of unique tags
		const uniqTags = _.uniqBy(project.tags, function (tag) {
			return tag.id;
		});
		project.tags = uniqTags;

		// create array of unique likes
		const uniqLikes = _.uniqBy(project.likes, function (like) {
			return like.likeId;
		});
		project.likes = uniqLikes;

		// likedByCurrentUser is equal to a like object if the currentUser has liked the project; otherwise it is undefined
		const likedByCurrentUser = uniqLikes.find(
			(like) => like.likerUserId === currentUserId,
		);
		project.currentUsersLikeId = likedByCurrentUser
			? likedByCurrentUser.likeId
			: null;
	}
	return projects;
};

module.exports = { projectsSqlToExpress };
