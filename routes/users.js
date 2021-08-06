"use strict";

/** Routes for users */

const jsonschema = require("jsonschema");

// const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");


// Data validation schemas


const router = express.Router();

/** POST / { user } */

/** GET / */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] */
router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.getOne(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] */
router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errors = validator.errors.map(error => error.stack);
      throw new BadRequestError(errors);
    }

    const user = await User.update(req.params.id, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username] */
router.delete("/:username", async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;