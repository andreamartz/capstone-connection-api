"use strict";

/** Routes for projects_tags */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Project_Tag = require("../models/project_tag");


// Data validation schemas


const router = new express.Router();

/** POST /projects_tags
 * 
 * Purpose: Add a tag to a project and save the project_tag row to database
 * 
 * Req body: 
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */
router.post("/", async function (req, res, next) {
  try {
    console.log("BACKEND REQ.BODY: ", req.body);

    const project_tag = await Project_Tag.create(req.body);
    return res.status(201).json({ project_tag });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;