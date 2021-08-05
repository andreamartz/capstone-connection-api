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

/** POST /project_likes
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

router.post("/", async function (req, res, next) {
  try {
    // console.log("BACKEND REQ.BODY: ", req.body);
    // console.log("BACKEND REQ.USER: ", req.user);
    // console.log("BACKEND REQ.LOCALS: ", req.locals);
    // console.log("BACKEND REQ.AUTH: ", req.auth);
    console.log("BACKEND REQ.AUTHORIZATION: ", req.authorization);

    const projectLike = await Project_Like.create(req.body);

    return res.status(201).json({ projectLike });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /project_likes/[id] 
 * 
 * Purpose: delete from database a like for a project
 * 
 * Req.body: 
 * 
 * Returns:
 * 
 * Auth required:
 * 
 * Errors:
*/

router.delete("/:id", async function (req, res, next) {
  try {
    const projectLike = await Project_Like.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;