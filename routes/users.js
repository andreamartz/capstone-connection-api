'use strict';

const jsonschema = require('jsonschema');
const userUpdateSchema = require('../schemas/userUpdate.json');
const express = require('express');
const {
	ensureLoggedIn,
	ensureCorrectUserOrAdminParams,
} = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const Project = require('../models/project');
const router = express.Router();

/** Routes for users */

/** GET /[id] */
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
	try {
		const user = await User.getOne(req.params.id);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id]/projects */
router.get('/:id/projects', ensureLoggedIn, async function (req, res, next) {
	try {
		const userId = req.params.id;
		const currentUserId = req.user.id;

		const projects = await Project.getAll(currentUserId, { userId });
		return res.json({ projects });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] */
router.patch(
	'/:id',
	ensureCorrectUserOrAdminParams,
	async function (req, res, next) {
		try {
			const validator = jsonschema.validate(req.body, userUpdateSchema);
			if (!validator.valid) {
				const errors = validator.errors.map((error) => error.stack);
				throw new BadRequestError(errors);
			}

			const user = await User.update(req.params.id, req.body);
			return res.json({ user });
		} catch (err) {
			return next(err);
		}
	},
);

module.exports = router;
