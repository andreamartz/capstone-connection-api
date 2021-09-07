const { sqlForPartialUpdate } = require('./sql');

describe('Test the function: sqlForPartialUpdate', function () {
	test('It works when one k-v pair is passed', function () {
		const result = sqlForPartialUpdate(
			{ firstName: 'Jane' },
			{ firstName: 'first_name', photoUrl: 'photo_url' },
		);
		expect(result).toEqual({
			setCols: '"first_name"=$1',
			values: ['Jane'],
		});
	});

	test('It works when two k-v pairs are passed', function () {
		const result = sqlForPartialUpdate(
			{ firstName: 'Jane', bio: 'I love to code.' },
			{ firstName: 'first_name' },
		);
		expect(result).toEqual({
			setCols: '"first_name"=$1, "bio"=$2',
			values: ['Jane', 'I love to code.'],
		});
	});

	test('It throws an error when no data is passed', function () {
		expect(() =>
			sqlForPartialUpdate(
				{},
				{ firstName: 'first_name', photoUrl: 'photo_url' },
			),
		).toThrow(Error);
	});
});
