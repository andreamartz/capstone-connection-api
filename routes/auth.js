"use strict";

/** Routes for authentication */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const createToken = require("../helpers/tokens");
// const userAuthSchema = require("../schemas/userAuth.json");
// const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token
 * 
 * Input: { username, password }
 * 
 * Returns: token
 *  - a JWT token which can be used to authenticate further requests
 * 
 * Authorization required: none
 */

router.post("/token", async function(req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, userAuthSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequeestError(errs);
    // }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register
 * 
 */

module.exports = router;