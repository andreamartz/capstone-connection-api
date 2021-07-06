"use strict";

/** Routes for projects */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const imageUpload = require("../helpers/imageUpload");
const Project = require("../models/project");
const { cloudinary } = require('../utils/cloudinary');
// Data validation schemas


const router = new express.Router();

/** POST /projects/new { project }
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
router.post("/new", async function (req, res, next) {
  try {
    // console.log("BACKEND DATA SENT: ", req.body.data);
    console.log("BACKEND REQ.BODY: ", req.body);

    const fileStr = req.body.image;  // the string representation of the image coming from the frontend
    
    const imageData = await imageUpload(fileStr);
    const image = imageData.secure_url;
    console.log("IMAGE AFTER UPLOAD: ", image);
    req.body.image = image;
    
    console.log("REQ.BODY: ", req.body);
    // console.log("REQ.BODY: ", req.body);
    // // console.log("FILESTR: ", fileStr);

    // const uploadResponse = await cloudinary.uploader.upload(fileStr, {
    //   upload_preset: 'capstone_connections',
    // });
    // console.log("UPLOADRESPONSE: ", uploadResponse);
    // res.json({ msg: 'yaya' });
    
    const project = await Project.create(req.body);
    return res.status(201).json({ project });
    



  } catch (err) {
    // console.error(err);
    // res.status(500).json({ err: 'Something went wrong' });
    return next(err);
  }
});




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
 *         { id, name, creatorId, image, repoUrl, siteUrl, description, feedbackRequest, createdAt, lastModified }, 
 *           ... 
 *     ]
 * }
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


module.exports = router;