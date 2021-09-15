'use strict';

const request = require('supertest');

const app = require('../app');

const { commonBeforeEach, commonAfterEach } = require('./_testCommon');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);

/*********** POST /auth/token ***********/

describe('POST /auth/token', function () {
	test('A user can log in successfully', async function () {
		const resp = await request(app).post('/auth/token').send({
			username: 'u1',
			password: 'password1',
		});
		expect(resp.body).toEqual({
			token: expect.any(String),
		});
	});

	test('unauth with non-existent user', async function () {
		const resp = await request(app).post('/auth/token').send({
			username: 'no-such-user',
			password: 'password1',
		});
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth with wrong password', async function () {
		const resp = await request(app).post('/auth/token').send({
			username: 'u1',
			password: 'nope',
		});
		expect(resp.statusCode).toEqual(401);
	});

	test('bad request with missing data', async function () {
		const resp = await request(app).post('/auth/token').send({
			username: 'u1',
		});
		console.log('STATUS CODE: ', resp.statusCode);
		expect(resp.statusCode).toEqual(400);
	});

	test('bad request with invalid data', async function () {
		const resp = await request(app).post('/auth/token').send({
			username: 42,
			password: 'aboveIsANumber',
		});
		expect(resp.statusCode).toEqual(400);
	});
});

/*********** POST /auth/register ***********/

describe('POST /auth/register', function () {
	test('works for anon', async function () {
		const resp = await request(app).post('/auth/register').send({
			username: 'newUsername',
			firstName: 'first',
			lastName: 'last',
			password: 'password',
			email: 'new@email.com',
		});
		expect(resp.statusCode).toEqual(201);
		expect(resp.body).toEqual({
			token: expect.any(String),
		});
	});

	test('bad request with missing fields', async function () {
		const resp = await request(app).post('/auth/register').send({
			username: 'newUsername',
		});
		expect(resp.statusCode).toEqual(400);
	});

	test('bad request with invalid data', async function () {
		const resp = await request(app).post('/auth/register').send({
			username: 'newUsername',
			firstName: 'first',
			lastName: 'last',
			password: 'password',
			email: 'not-an-email',
		});
		expect(resp.statusCode).toEqual(400);
	});
});
