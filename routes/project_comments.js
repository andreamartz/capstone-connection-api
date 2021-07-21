"use strict";

/** Routes for comments */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Project_Comment = require("../models/project_comment");

// Data validation schemas


const router = new express.Router();

/** POST /comments/new
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
router.post("/new", async function (req, res, next) {
  console.debug("CREATE NEW COMMENT");
  try {
    const comment = await Project_Comment.create(req.body);
    return res.status(201).json({ comment });
  } catch (err) {
    return next(err);
  }
});


/** GET / 
 * 
 * Purpose: retrieve all comments from the database
 * 
 * Req body: none
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */


 module.exports = router;