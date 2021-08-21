"use strict";

/** Routes for tags */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const imageUpload = require("../helpers/imageUpload");
const Tag = require("../models/tag");

// Data validation schemas


const router = new express.Router();

/** POST /tags
 * Purpose: create a new tag and save to database
 * 
 * Req body contains the text of the tag: { text: 'TAGTEXT' }
 * 
 * Returns: { tag: { id, text }}
 * 
 * Auth required: User must be an admin
 * 
 * Errors:
 * 
 */
router.post("/", ensureAdmin, async function(req, res, next) {
  console.debug("CREATE NEW TAG");
  try {
    const tag = await Tag.create(req.body);
    return res.status(201).json({ tag });
  } catch (error) {
    return next(error);
  }
});

/** GET / 
 * 
 * Purpose: retrieve all tags from the database
 * 
 * Req body: none
 * 
 * Returns: 
 * 
 * Auth required: 
 * 
 * Errors: 
 */

router.get('/', ensureLoggedIn, async function(req, res, next) {
  try {
    const tags = await Tag.getAll(req.query);
    return res.json({ tags });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;