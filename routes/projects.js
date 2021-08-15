"use strict";

/** Routes for projects */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureCorrectUserOrAdminBody } = require("../middleware/auth");
const imageUpload = require("../helpers/imageUpload");
const Project = require("../models/project");
const Project_Tag = require("../models/project_tag");
const Project_Like = require("../models/project_like");

// Data validation schemas
const projectNewSchema = require("../schemas/projectNew.json");
const projectSearchAndSortSchema  = require("../schemas/projectSearchAndSort.json")


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
router.post("/", ensureLoggedIn, async function (req, res, next) {
  console.debug("CREATE NEW PRJ");
  try {
    const fileStr = req.body.image;
    let image;
    // upload image to Cloudinary
    if (fileStr) {
      const imageData = await imageUpload(fileStr);
      image = imageData.secure_url;
    } else {
      image = "https://res.cloudinary.com/wahmof2/image/upload/v1626296156/capstone_connections/projects_capstone_connections/undraw_Website_builder_re_ii6e.svg";
    }


    // console.log("IMAGE AFTER UPLOAD");
    req.body.image = image;
    // console.log("REQ.BODY: ", req.body);
    
    const validator = jsonschema.validate(req.body, projectNewSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(error => error.stack);
      throw new BadRequestError(errors);
    }

    const project = await Project.create(req.body);
    console.log("PROJECT BEFORE ADDING TAGS: ", project);

    const prjTags = await Project_Tag.create(project.id, req.body.tags);
    project.tags=prjTags;

    return res.status(201).json({ project });
  } catch (error) {
    return next(error);
  }
});

/** POST /:id/likes
 *  
 * Purpose: add a like to a project
 * 
 * Req.body: { projectId, likerId }
 * 
 * Returns:
 * 
 * Auth required: 
 * 
 * Errors:
 */
router.post("/:id/likes", ensureLoggedIn, async function (req, res, next) {
  try {
    console.log("BACKEND REQ.AUTHORIZATION: ", req.authorization);

    const projectLike = await Project_Like.create(req.body);

    return res.status(201).json({ projectLike });
  } catch (err) {
    return next(err);
  }
});

/** POST /:id/tags
 *  
 * Purpose: add a tag to a project
 * 
 * Req.body: { projectId, tags: [ tagId, tagId, ... ] }
 * 
 * Returns:
 *   {
 *     project_tags: [
 *       { projectId, tagId },
 *       { projectId, tagId }
 *     ]
 *   }
 * 
 * Auth required: 
 * 
 * Errors:
 */

 router.post("/:id/tags", ensureLoggedIn, async function (req, res, next) {
  try {
    console.log("BACKEND REQ.BODY: ", req.body);
    const projectId = req.params.id;

    const projectTag = await Project_Tag.create(projectId, tags);

    return res.status(201).json({ projectTag });
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
 *  - userId
 *  - tagName
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */

router.get('/', ensureLoggedIn, async function (req, res, next) {
  const currentUserId = req.user.id;
  console.log("REQ.QUERY for getting projects: ", req.query);
  const { tagText, sortVariable } = req.query;
  try {
    if (tagText || sortVariable) {
      const validator = jsonschema.validate(req.query, projectSearchAndSortSchema);
      if (!validator.valid) {
        const errors = validator.errors.map(error => error.stack);
        throw new BadRequestError(errors);
      }
    }
    
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

router.get('/:id', ensureLoggedIn, async function (req, res, next) {
  try {
    const currentUserId = req.user.id;
    const project = await Project.getOne(currentUserId, req.params.id);
    return res.json({ project });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /:id/likes/:id
 * 
 * Purpose: delete a like from a project
 * 
 * Req body: { projectId, currentUsersLikeId }
 * 
 * Returns: 
 * 
 * Auth required:
 * 
 * Errors:
 */

router.delete("/:id/likes/:id", ensureCorrectUserOrAdminBody, async function(req, res, next) {
  try {
    // console.log("REQ.PARAMS: ", req.params);
    console.log("REQ.BODY: ", req.body);
    // const projectLike = await Project_Like.remove(req.params.id);
    const { currentUsersLikeId } = req.body;
    const projectLike = await Project_Like.remove(currentUsersLikeId);
    return res.json({ deleted: currentUsersLikeId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;