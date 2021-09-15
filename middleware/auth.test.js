'use strict';

const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../expressError');
const {
	authenticateJWT,
	ensureLoggedIn,
	ensureAdmin,
	ensureCorrectUserOrAdminParams,
	ensureCorrectUserOrAdminComments,
	ensureCorrectUserOrAdminLikes,
} = require('./auth');

const { SECRET_KEY } = require('../config');
const testJwt = jwt.sign(
	{
		id: 1,
		username: 'test',
		firstName: 'First',
		lastName: 'Last',
		isAdmin: false,
	},
	SECRET_KEY,
);
const testAdminJwt = jwt.sign(
	{
		id: 1,
		username: 'test',
		firstName: 'First',
		lastName: 'Last',
		isAdmin: true,
	},
	SECRET_KEY,
);
const badJwt = jwt.sign(
	{
		id: 1,
		username: 'test',
		firstName: 'First',
		lastName: 'Last',
		isAdmin: false,
	},
	'not-secret-key',
);

const {
	commonBeforeEach,
	commonAfterEach,
	adminToken,
} = require('../routes/_testCommon');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);

describe('authenticateJWT', function () {
	test('works when valid token passed via header', function () {
		expect.assertions(2);
		const req = { headers: { authorization: `Bearer ${testJwt}` } };
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(req.user).toEqual({
			iat: expect.any(Number),
			id: 1,
			username: 'test',
			firstName: 'First',
			lastName: 'Last',
			isAdmin: false,
		});
	});

	test('works when no header', function () {
		expect.assertions(2);
		const req = {};
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(req.user).toBeUndefined();
	});

	test('works when invalid token passed in header', function () {
		expect.assertions(2);
		const req = { headers: { authorization: `Bearer ${badJwt}` } };
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		authenticateJWT(req, res, next);
		expect(req.user).toBeUndefined();
	});
});

describe('ensureLoggedIn', function () {
	test('works when user is logged in', function () {
		expect.assertions(1);
		const req = { user: { username: 'test', is_admin: false } };
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureLoggedIn(req, res, next);
	});

	test('throws Unauthorized error when user not logged in', function () {
		expect.assertions(1);
		const req = {};
		const res = {};
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureLoggedIn(req, res, next);
	});
});

describe('ensureAdmin', function () {
	test('it works when user is an admin', function () {
		expect.assertions(1);
		const req = { user: { username: 'test', isAdmin: true } };
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureAdmin(req, res, next);
	});

	test('it does not authorize when user is not an admin', function () {
		expect.assertions(1);
		const req = { user: { username: 'test', isAdmin: false } };
		const res = {};
		const next = function (err) {
			expect(err instanceof ForbiddenError).toBeTruthy();
		};
		ensureAdmin(req, res, next);
	});

	test('it does not authorize when user is anonymous', function () {
		expect.assertions(1);
		const req = {};
		const res = {};
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureAdmin(req, res, next);
	});
});

describe('ensureCorrectUserOrAdminParams', function () {
	test('it works when user is an admin', function () {
		expect.assertions(1);
		const req = {
			user: { id: 1, username: 'admin', isAdmin: true },
			params: { id: '1' },
		};
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureCorrectUserOrAdminParams(req, res, next);
	});

	test('it works when same user', function () {
		expect.assertions(1);
		const req = {
			user: { id: 1, username: 'test', isAdmin: false },
			params: { id: '1' },
		};
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureCorrectUserOrAdminParams(req, res, next);
	});

	test('it works when users are mismatched', function () {
		expect.assertions(1);
		const req = {
			user: { id: 1, username: 'test', isAdmin: false },
			params: { id: '999' },
		};
		const res = {};
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureCorrectUserOrAdminParams(req, res, next);
	});

	test('it works if user is anonymous', function () {
		expect.assertions(1);
		const req = { params: { id: '1' } };
		const res = {};
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureCorrectUserOrAdminParams(req, res, next);
	});
});

describe('ensureCorrectUserOrAdminLikes', function () {
	test('it works when user is an admin', function () {
		const { id, username, isAdmin } = jwt.decode(u1Token);
		const wrongUsersLikeId = 1;
		expect.assertions(1);
		const req = {
			user: { id, username, isAdmin },
			body: { projectId: 1, currentUsersLikeId: wrongUsersLikeId },
		};
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureCorrectUserOrAdminLikes(req, res, next);
	});

	// test('it works when same user', function () {
	//   expect.assertions(1);
	//   const req = {
	//     user: { id: 1, username: 'test', isAdmin: false },
	//     // body: { userId: '1' },
	//     body: { projectId: 1, currentUsersLikeId: 22 },
	//   };
	//   const res = {};
	//   const next = function (err) {
	//     expect(err).toBeFalsy();
	//   };
	//   ensureCorrectUserOrAdminLikes(req, res, next);
	// });

	// test('it works when users are mismatched', function () {
	//   expect.assertions(1);
	//   const req = {
	//     user: { id: 1, username: 'test', isAdmin: false },
	//     body: { userId: '999' },
	//   };
	//   const res = {};
	//   const next = function (err) {
	//     expect(err instanceof UnauthorizedError).toBeTruthy();
	//   };
	//   ensureCorrectUserOrAdminLikes(req, res, next);
	// });

	// test('it works if user is anonymous', function () {
	//   expect.assertions(1);
	//   const req = {
	//     body: { userId: '1' },
	//   };
	//   const res = {};
	//   const next = function (err) {
	//     expect(err instanceof UnauthorizedError).toBeTruthy();
	//   };
	//   ensureCorrectUserOrAdminLikes(req, res, next);
	// });
});

// describe('ensureCorrectUserOrAdminComments', function () {

// });
