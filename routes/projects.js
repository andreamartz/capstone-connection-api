"use strict";

/** Routes for projects */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const imageUpload = require("../helpers/imageUpload");
const Project = require("../models/project");
// const { cloudinary } = require('../utils/cloudinary');


// Data validation schemas


const router = new express.Router();

/** POST /projects/new
 * 
 * Purpose: create a new project and save to database
 * 
 * Req body:  { project }
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */
router.post("/new", async function (req, res, next) {
  try {
    // console.log("BACKEND DATA SENT: ", req.body.data);
    console.log("BACKEND REQ.BODY: ", req.body);

    const fileStr = req.body.image;  
    // upload image to Cloudinary
    const imageData = await imageUpload(fileStr);
    
    const image = imageData.secure_url;
    console.log("IMAGE AFTER UPLOAD: ", image);
    req.body.image = image;
    console.log("REQ.BODY: ", req.body);
    const project = await Project.create(req.body);
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
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */

router.get('/', async function (req, res, next) {
  try {
    const projects = await Project.getAll(req.query);
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
    const project = await Project.getOne(req.params.id);
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