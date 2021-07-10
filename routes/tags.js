"use strict";

/** Routes for tags */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const imageUpload = require("../helpers/imageUpload");
const Tag = require("../models/tag");

// Data validation schemas


const router = new express.Router();

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

router.get('/', async function (req, res, next) {
  try {
    const tags = await Tag.getAll(req.query);
    return res.json({ tags });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;