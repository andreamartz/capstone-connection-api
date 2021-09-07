const request = require('supertest');
const app = require('./app');
const db = require('./db');

test('A get request to invalid route results in 404 status code', async function () {
	const response = await request(app).get('/invalid-path');
	expect(response.statusCode).toEqual(404);
});
