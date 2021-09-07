'use strict';

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { UnauthorizedError, ForbiddenError } = require('../expressError');
const Project_Like = require('../models/project_like');
const Project_Comment = require('../models/project_comment');

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload on req.user (this will include the username and isAdmin field.)
 *
 * It's NOT an error if either/both true:
 *  - no token was provided or
 *  - the token is not valid
 */

function authenticateJWT(req, res, next) {
	try {
		const authHeader = req.headers && req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace(/^[Bb]earer /, '').trim();
			req.user = jwt.verify(token, SECRET_KEY);
		}
		return next();
	} catch (err) {
		return next();
	}
}

/** Middleware to use when they must be logged in.
 *
 * If not, throws UnauthorizedError.
 */

function ensureLoggedIn(req, res, next) {
	try {
		if (!req.user) throw new UnauthorizedError();
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to use when user needs to be an admin.
 *
 *  If not, throws UnauthorizedError.
 */

function ensureAdmin(req, res, next) {
	try {
		if (!req.user) {
			throw new UnauthorizedError();
		}
		if (!req.user.isAdmin) {
			throw new ForbiddenError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to use when they must provide a valid token & be either the admin or a user matching the liker of the project.
 *
 *  If not, raises Unauthorized.
 */

async function ensureCorrectUserOrAdminLikes(req, res, next) {
	try {
		const user = req.user;
		// Get the id of the like to be deleted
		const { currentUsersLikeId } = req.body;
		console.log('USER: ', user, 'CURRENTUSERSLIKEID: ', currentUsersLikeId);
		// Get like object from Like model using currentUsersLikeId (i.e., the like id to be deleted)
		const projectLike = await Project_Like.getOne(currentUsersLikeId);
		console.log('projectLike FROM MIDDLEWARE: ', projectLike);
		// pull off likerId
		const { likerId } = projectLike;
		console.log(
			'TYPEOF USER.ID: ',
			typeof user.id,
			'TYPEOF LIKERID: ',
			typeof likerId,
		);
		// compare user.id to likerId
		if (!(user && (user.isAdmin || user.id === likerId))) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to use when they must provide a valid token & be either the admin or a user matching the commenter.
 *
 *  If not, raises Unauthorized.
 */
async function ensureCorrectUserOrAdminComments(req, res, next) {
	try {
		// Get user from req.user
		const user = req.user;
		// Get the id of the comment to be modified
		const commentId = req.params.id;

		// Get comment object from Project_Comment model using commentId (i.e., the comment id to be updated)
		const projectComment = await Project_Comment.getOne(commentId);
		console.log('projectComment FROM MIDDLEWARE: ', projectComment);
		// pull off commenterId
		const { commenterId } = projectComment;
		// compare user.id to commenterId
		if (!(user && (user.isAdmin || user.id === commenterId))) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

/** Middleware to use when they must provide a valid token & either be the user matching username provided as route param OR the user is an admin.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdminParams(req, res, next) {
	try {
		const user = req.user;

		if (!(user && (user.isAdmin || user.id === +req.params.id))) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureAdmin,
	ensureCorrectUserOrAdminLikes,
	ensureCorrectUserOrAdminComments,
	ensureCorrectUserOrAdminParams,
};
