'use strict';

const request = require('supertest');
const app = require('../app');

const {
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u2Token,
} = require('./_testCommon');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*********** GET /users/:id ***********/

describe('GET /users/:id', function () {
	test('works for logged in user', async function () {
		const response = await request(app)
			.get(`/users/1`)
			.set('authorization', `Bearer ${u2Token}`);
		console.log('RESPONSE.BODY: ', response.body);
		expect(response.body.user.id).toEqual(1);
		expect(response.body.user.projects).toBeInstanceOf(Array);
	});
});

/*********** GET /users/:id/projects ***********/

describe('GET /users/:id/projects', function () {
	test('works for logged in user', async function () {
		const response = await request(app)
			.get(`/users/1/projects`)
			.set('authorization', `Bearer ${u2Token}`);
		console.log('RESPONSE.BODY: ', response.body);
		expect(response.body.projects).toHaveLength(2);
		expect(response.body.projects[0].id).toEqual(1);
	});
});
