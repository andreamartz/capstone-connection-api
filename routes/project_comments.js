"use strict";

/** Routes for comments */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Project_Comment = require("../models/project_comment");

// Data validation schemas
const projectCommentsNewSchema = require("../schemas/projectCommentsNew.json");
const projectCommentsUpdateSchema = require("../schemas/projectCommentsUpdate.json");

const router = new express.Router();

/** POST /comments
 * 
 * Purpose: create a new comment and save to database
 * 
 * Req body:  { comment }
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */
router.post("/", async function (req, res, next) {
  console.debug("CREATE NEW COMMENT");
  try {
    const validator = jsonschema.validate(req.body, projectCommentsNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(error => error.stack);
      throw new BadRequestError(errors);
    }

    const comment = await Project_Comment.create(req.body);
    return res.status(201).json({ comment });
  } catch (err) {
    return next(err);
  }
});


/** PATCH / []
 * 
 * Purpose: update a comment in the database
 * 
 * Req body: 
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */
router.patch("/:id", async function(req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, projectCommentsUpdateSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(error => error.stack);
      throw new BadRequestError(errors);
    }

    const comment = await Project_Comment.update(req.params.id, req.body);
    return res.json({ comment });
  } catch (error) {
    return next(error);
  }
});

 module.exports = router;