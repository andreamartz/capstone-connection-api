"use strict";

/** Routes for project_likes */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const imageUpload = require("../helpers/imageUpload");
const Project_Like = require("../models/project_like");
// Data validation schemas


const router = new express.Router();

/** POST /project_likes/new 
 * 
 * Purpose: create a new like for a project and save to database
 * 
 * Req.body: 
 * 
 * Returns:
 * 
 * Auth required:
 * 
 * Errors:
*/

router.post("/new", async function (req, res, next) {
  try {
    console.log("BACKEND REQ.BODY: ", req.body);
    const projectLike = await Project_Like.create(req.body);
    return res.status(201).json({ projectLike });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;