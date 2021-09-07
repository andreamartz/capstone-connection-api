'use strict';

/** Routes for authentication */

const jsonschema = require('jsonschema');
const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const createToken = require('../helpers/tokens');
const userAuthSchema = require('../schemas/userAuth.json');
const userRegisterSchema = require('../schemas/userRegister.json');
const { BadRequestError } = require('../expressError');
const imageUpload = require('../helpers/imageUpload');

/** POST /auth/token
 *
 * Input: { username, password }
 *
 * Returns: token
 *  - a JWT token which can be used to authenticate further requests
 *
 * Authorization required: none
 */

router.post('/token', async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userAuthSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

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

router.post('/register', async function (req, res, next) {
	console.debug('REGISTER A USER');
	try {
		const fileStr = req.body.photoUrl;
		let photoUrl;
		// upload encoded image to Cloudinary
		if (fileStr) {
			const imageData = await imageUpload(fileStr);
			photoUrl = imageData.secure_url;
		} else {
			photoUrl = null;
		}

		req.body.photoUrl = photoUrl;

		// Validate the data
		const validator = jsonschema.validate(req.body, userRegisterSchema);
		if (!validator.valid) {
			const errors = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errors);
		}

		const newUser = await User.register({ ...req.body, isAdmin: false });
		const token = createToken(newUser);
		return res.status(201).json({ token });
	} catch (err) {
		if (err.code === '23505') {
			console.error(err);
			return next(
				new BadRequestError('Username taken. Please choose another.'),
			);
		}
		return next(err);
	}
});

/** POST /auth/register/demo
 *
 * Req.body: none
 *
 * Returns: token
 *  - a JWT token which can be used to authenticate further requests
 *
 * Authorization required: none
 */

router.get('/register/demo', async function (req, res, next) {
	console.debug('REGISTER A DEMO USER');
	try {
		// Check for demo user in database

		const user = await User.getOneByUsername('demouser');
		const { id, username } = user;

		if (!user) {
			return next(err);
		}
		// if found, delete the demo user
		const deletedUser = await User.remove(id);

		// Create new demo user
		const photoUrl =
			'https://res.cloudinary.com/wahmof2/image/upload/v1628100605/capstone_connections/users_capstone_connections/default-user-icon.png';

		const demoUserData = {
			username: 'demouser',
			password: 'demopassword',
			firstName: 'Demo',
			lastName: 'User',
			email: 'demo@email.com',
			bio: 'I am Demo User. This is my bio.',
			photoUrl: photoUrl,
			portfolioUrl: null,
			githubUrl: null,
			isAdmin: false,
		};

		const demoUser = await User.register(demoUserData);
		const token = createToken(demoUser);
		return res.status(201).json({ token });
	} catch (err) {
		if (err.code === '23505') {
			console.error(err);
			return next(
				new BadRequestError('Username taken. Please choose another.'),
			);
		}
		return next(err);
	}
});

module.exports = router;
