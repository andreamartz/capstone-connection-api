'use strict';

// set NODE_ENV variable before loading db.js
process.env.NODE_ENV = 'test';

const { UnauthorizedError } = require('../expressError');

const db = require('../db');

const User = require('./user');

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	// commonAfterAll
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
// commonAfterAll(commonAfterAll);

/**************** authenticate ****************/
describe('authenticate', function () {
	// test("User auth with correct pw", async function() {
	//   const data = {
	//     username: "username1",
	//     password: "pw1"
	//   };
	//   const user = await User.authenticate(data);
	//   expect(user).toEqual({
	//     id: expect.any(Number),
	//     username: "username1",
	//     firstName: "fn1",
	//     lastName: "ln1",
	//     email: "user1@email.com",
	//     bio: "user1 bio",
	//     photoUrl: "https://via.placeholder.com/300x300?text=user1+photo",
	//     portfolioUrl: "https://via.placeholder.com/150x150?text=user1+portfolio",
	//     githubUrl: "https://via.placeholder.com/150x150?text=user1+github",
	//     isAdmin: false
	//   });
	// });

	test('No auth when user does not exist', async function () {
		const data = {
			username: 'notauser',
			password: 'pw',
		};
		try {
			const user = await User.authenticate(data);
		} catch (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		}
	});

	test('No auth when wrong pw', async function () {
		const data = {
			username: 'user1',
			password: 'wrong',
		};
		try {
			const user = await User.authenticate(data);
		} catch (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		}
	});

	/**************** register ****************/

	/**************** findAll *****************/

	/****************** get *******************/

	/***************** update *****************/

	/***************** remove *****************/

	// MORE....
});
