"use strict";

/** Routes for projects */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Project = require("../models/project");

// Data validation schemas





const router = new express.Router();

/** POST / { project }
 * 
 * Purpose: create a new project and save to database
 * 
 * Params:
 * 
 * Req body: 
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */




/** GET / 
 * 
 * Purpose: retrieve all projects from the database
 * 
 * Params: none 
 * 
 * Req body: none
 * 
 * Returns: 
 * { projects:
 *     [
 *         { id, name, creatorId, image, repoUrl, description, createdAt, lastModified }, 
 *           ... 
 *     ]
 * }
 * 
 * Auth required: 
 * 
 * Errors: 
 */

router.get('/', async function (req, res, next) {
  const q = req.query;

  try {
    const projects = await Project.getAll();
    return res.json({ projects });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;