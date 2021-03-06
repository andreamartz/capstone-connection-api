'use strict';

/** Routes for projects */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const {
	ensureLoggedIn,
	ensureCorrectUserOrAdminLikes,
	ensureCorrectUserOrAdminProjects,
} = require('../middleware/auth');
const imageUpload = require('../helpers/imageUpload');
const Project = require('../models/project');
const Project_Tag = require('../models/project_tag');
const Project_Like = require('../models/project_like');

// Data validation schemas
const projectNewSchema = require('../schemas/projectNew.json');
const projectSearchAndSortSchema = require('../schemas/projectSearchAndSort.json');

const router = new express.Router();

/** POST /projects
 * Purpose: create a new project and save to database
 * - requests to store image in on cloudinary.com
 * - requests to create a new project with the image in dtbs
 * - requests to add tags to the project in dtbs
 *
 * Req body:  { project }
 *
 * Returns: { project: {...} }
 * - see model for details
 *
 * Auth required: User must be logged in
 *
 * Errors: BadRequestError if req.body data does not validate
 */
router.post('/', ensureLoggedIn, async function (req, res, next) {
	console.debug('CREATE NEW PRJ');
	try {
		const fileStr = req.body.image;
		let image;
		// upload image to Cloudinary
		if (fileStr) {
			const imageData = await imageUpload(fileStr);
			image = imageData.secure_url;
		} else {
			image =
				'https://res.cloudinary.com/wahmof2/image/upload/v1626296156/capstone_connections/projects_capstone_connections/undraw_Website_builder_re_ii6e.svg';
		}

		req.body.image = image;

		const validator = jsonschema.validate(req.body, projectNewSchema);
		if (!validator.valid) {
			const errors = validator.errors.map((error) => error.stack);
			throw new BadRequestError(errors);
		}

		const project = await Project.create(req.body);

		const prjTags = await Project_Tag.create(project.id, req.body.tags);
		project.tags = prjTags;

		return res.status(201).json({ project });
	} catch (error) {
		return next(error);
	}
});

/** DELETE /:id
 *
 * Purpose: delete a project
 *
 * Req body: { id }
 *
 * Returns: { deleted: id }
 *
 * Auth required: Must be the project creator OR an admin
 *
 * Errors:
 */

router.delete(
	'/:id',
	ensureCorrectUserOrAdminProjects,
	async function (req, res, next) {
		try {
			const { id } = req.params;
			const project = await Project.remove(id);
			return res.json({ deleted: id });
		} catch (err) {
			return next(err);
		}
	},
);

/** POST /:id/likes
 *
 * Purpose: add a like to a project
 *
 * Req.body: { projectId, likerId }
 *
 * Returns: { id, likerId, projectId }
 *
 * Auth required: User must be logged in
 */
router.post('/:id/likes', ensureLoggedIn, async function (req, res, next) {
	try {
		const projectLike = await Project_Like.create(req.body);

		return res.status(201).json({ projectLike });
	} catch (err) {
		return next(err);
	}
});

/** POST /:id/tags
 *
 * Purpose: add a tag to a project as part of posting a new project.
 *
 * NOTE: this route is ONLY called from the route that creates a new project.
 *
 * Req.params: the project id is in the path
 *
 * Req.body: { tags: [ tagId, tagId, ... ] }
 *
 * Returns:
 *   {
 *     project_tags: [
 *       { projectId, tagId },
 *       { projectId, tagId }
 *     ]
 *   }
 *
 * Auth required: User must be logged in
 */

router.post('/:id/tags', ensureLoggedIn, async function (req, res, next) {
	try {
		const projectId = req.params.id;
		const { tags } = req.body;

		const projectTag = await Project_Tag.create(projectId, tags);

		return res.status(201).json({ projectTag });
	} catch (err) {
		return next(err);
	}
});

/** GET /
 *
 * Purpose: retrieve all projects from the database
 *
 * Req body: none
 *
 * Can filter on provided filters (in req.query)
 *  - userId
 *  - tagName
 *
 * Returns: array of project objects (see model for details)
 *
 * Auth required: User must be logged in
 *
 * Errors: BadRequestError if search or sort criteria does not validate
 */

router.get('/', ensureLoggedIn, async function (req, res, next) {
	const currentUserId = req.user.id;
	const { tagText, sortVariable } = req.query;
	try {
		if (tagText || sortVariable) {
			const validator = jsonschema.validate(
				req.query,
				projectSearchAndSortSchema,
			);
			if (!validator.valid) {
				const errors = validator.errors.map((error) => error.stack);
				throw new BadRequestError(errors);
			}
		}

		const projects = await Project.getAll(currentUserId, req.query);

		return res.json({ projects });
	} catch (err) {
		return next(err);
	}
});

/** GET /:id  =>  { project }
 *
 * Purpose: retrieve a specific project by id
 *
 * Req body: none
 *
 * Returns: project object (see model for details)
 *
 * Auth required: User must be logged in
 */

router.get('/:id', ensureLoggedIn, async function (req, res, next) {
	try {
		const currentUserId = req.user.id;
		const project = await Project.getOne(currentUserId, req.params.id);
		return res.json({ project });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /:id/likes/:id
 *
 * Purpose: delete a like from a project
 *
 * Req body: { projectId, currentUsersLikeId, userId }
 *
 * Returns: { deleted: currentUsersLikeId }
 *
 * Auth required: Must be a user who has already liked the project OR an admin
 */

router.delete(
	'/:id/likes/:id',
	ensureCorrectUserOrAdminLikes,
	async function (req, res, next) {
		try {
			const { currentUsersLikeId } = req.body;
			const projectLike = await Project_Like.remove(currentUsersLikeId);
			return res.json({ deleted: currentUsersLikeId });
		} catch (err) {
			return next(err);
		}
	},
);

module.exports = router;
