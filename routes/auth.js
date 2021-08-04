"use strict";

/** Routes for authentication */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const createToken = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError, ExpressError } = require("../expressError");
const imageUpload = require("../helpers/imageUpload");

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
    const validator = jsonschema.validate(req.body, userAuthSchema);
    console.log("USER LOGIN VALIDATOR: ", validator);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    const { username, password } = req.body;
    console.log("USERNAME: ", username, "PASSWORD: ", password);
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register
 * 
 * req.body: { 
 *   username,
 *   password,
 *   firstName,
 *   lastName,
 *   email,
 *   bio,
 *   photoUrl,
 *   portfolioUrl,
 *   githubUrl,
 *   isAdmin
 * }
 * 
 * Returns: token
 *  - a JWT token which can be used to authenticate further requests
 * 
 * Authorization required: none
 */

 router.post("/register", async function (req, res, next) {
   console.debug("REGISTER A USER");
  try {
    const fileStr = req.body.photoUrl;
    // upload image to Cloudinary
    console.log("IMAGE BEFORE UPLOAD", fileStr.substr(0, 40));
    const imageData = await imageUpload(fileStr);

    const photoUrl = imageData.secure_url;
    console.log("IMAGE AFTER UPLOAD");
    req.body.photoUrl = photoUrl;
    console.log("REQ.BODY: ", req.body);

    // Validate the data
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    console.log("USER REGISTRATION VALIDATOR: ", validator);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    console.log("VALIDATOR IS VALID!");
    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    console.log("TOKEN: ", token);
    return res.status(201).json({ token });
  } catch (err) {
    if (err.code === '23505') {
      return next(new BadRequestError("Username taken. Please choose another."));
    }
    return next(err);
  }
});

module.exports = router;