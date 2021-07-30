"use strict";

/** Routes for projects */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const imageUpload = require("../helpers/imageUpload");
const Project = require("../models/project");
const Project_Tag = require("../models/project_tag");


// Data validation schemas


const router = new express.Router();

/** POST /projects
 * Purpose: create a new project and save to database
 * - requests to store image in on cloudinary.com
 * - requests to create a new project with the image in dtbs
 * - requests to add tags to the project in dtbs
 * 
 * 
 * Req body:  { project }
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */
router.post("/", async function (req, res, next) {
  console.debug("CREATE NEW PRJ");
  try {
    const fileStr = req.body.image;  
    // upload image to Cloudinary
    // console.log("IMAGE BEFORE UPLOAD", fileStr.substr(0, 40));
    const imageData = await imageUpload(fileStr);

    const image = imageData.secure_url;
    // console.log("IMAGE AFTER UPLOAD");
    req.body.image = image;
    console.log("REQ.BODY: ", req.body);
    
    const project = await Project.create(req.body);
    console.log("PROJECT BEFORE ADDING TAGS: ", project);

    const prjTags = await Project_Tag.create(project.id, req.body.tags);
    project.tags=prjTags;

    return res.status(201).json({ project });
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
 *  - username
 *  - tag
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */

router.get('/', async function (req, res, next) {
  try {
    const currentUserId = res.locals.user.id;

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
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
*/

router.get('/:id', async function (req, res, next) {
  try {
    const currentUserId = res.locals.user.id;
    const project = await Project.getOne(currentUserId, req.params.id);
    return res.json({ project });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /:id
 * 
 * Purpose: update a specific project by id
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
    const project = await Project.update(req.params.id, req.body);
    return res.json({ project });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /:id 
 * 
 * Purpose: retrieve a specific project by id
 * 
 * Req body: none
 * 
 * Returns: { deleted: id }
 * 
 * Auth required: 
 * 
 * Errors: 
*/
router.delete("/:id", async function(req, res, next) {
  try {
    await Project.remove(req.params.handle);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;