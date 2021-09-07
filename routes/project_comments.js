'use strict';

/** Routes for comments */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const {
  ensureLoggedIn,
  ensureCorrectUserOrAdminComments,
} = require('../middleware/auth');
const Project_Comment = require('../models/project_comment');

// Data validation schemas
const projectCommentsNewSchema = require('../schemas/projectCommentsNew.json');
const projectCommentsUpdateSchema = require('../schemas/projectCommentsUpdate.json');

const router = new express.Router();

/** POST /comments
 * 
 * Purpose: create a new comment and save to database
 * 
 * Req body:  { projectId, commenterId, comment }
 * 
 * Returns: {
    comment: {
      id, commenterId, projectId, comment, createdAt, lastModified
    }
  }
 * 
 * Auth required: Must be logged in
 * 
 * Errors: 
 */
router.post('/', ensureLoggedIn, async function (req, res, next) {
  console.debug('CREATE NEW COMMENT');
  try {
    const validator = jsonschema.validate(req.body, projectCommentsNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map((error) => error.stack);
      throw new BadRequestError(errors);
    }

    const comment = await Project_Comment.create(req.body);
    return res.status(201).json({ comment });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id]
 *
 * Purpose: update a comment in the database
 *
 * Req.params: includes comment id
 *
 * Req body: { projectId, userId, comment }
 *
 * Returns:
 *
 * Auth required: Must be the user who posted the comment OR an admin
 *
 * Errors:
 */
router.patch("/:id", ensureCorrectUserOrAdminBody, async function(req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, projectCommentsUpdateSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(error => error.stack);
      throw new BadRequestError(errors);
    }

      return next(error);
    }
  }
);

module.exports = router;
