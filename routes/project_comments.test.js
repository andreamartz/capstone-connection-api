'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');

const { commonBeforeEach, commonAfterEach, u1Token } = require('./_testCommon');

beforeEach(commonBeforeEach);
afterEach(commonAfterEach);

/***************** POST /project_comments **************/

describe('POST /project_comments', function () {
	test('ok for logged in user', async function () {
		const newComment = {
			projectId: 2,
			commenterId: 1,
			comment: 'Your project looks so good!',
		};
		const addedComment = {
			comment: {
				id: 2,
				commenterId: 1,
				projectId: 2,
				comment: 'Your project looks so good!',
				createdAt: expect.any(String),
				lastModified: expect.any(String),
			},
		};
		const response = await request(app)
			.post('/project_comments')
			.send(newComment)
			.set('authorization', `Bearer ${u1Token}`);
		expect(response.statusCode).toEqual(201);
	});
});
