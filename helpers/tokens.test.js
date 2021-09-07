const jwt = require('jsonwebtoken');
const createToken = require('./tokens');
const { SECRET_KEY } = require('../config');

describe('createToken', function () {
	test('Creates a token for regular (i.e., not admin) user', function () {
		const token = createToken({ username: 'test', is_admin: false });
		const payload = jwt.verify(token, SECRET_KEY);
		expect(payload).toEqual({
			iat: expect.any(Number),
			username: 'test',
			isAdmin: false,
		});
	});

	test('Creates a token for an admin user', function () {
		const token = createToken({ username: 'test', isAdmin: true });
		const payload = jwt.verify(token, SECRET_KEY);
		expect(payload).toEqual({
			iat: expect.any(Number),
			username: 'test',
			isAdmin: true,
		});
	});

	test('Creates a token for a regular user when isAdmin property not passed', function () {
		// given the security risk if this didn't work, checking this specifically
		const token = createToken({ username: 'test' });
		const payload = jwt.verify(token, SECRET_KEY);
		expect(payload).toEqual({
			iat: expect.any(Number),
			username: 'test',
			isAdmin: false,
		});
	});
});
