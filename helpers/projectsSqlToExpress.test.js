const { projectsSqlToExpress } = require('./projectsSqlToExpress');

const data = {
	rows: [
		{
			id: 1,
			name: 'p1',
			creatorId: 1,
			image: 'https://via.placeholder.com/300x300?text=p1+image',
			repoUrl: 'https://via.placeholder.com/300x300?text=p1+repo+url',
			siteUrl: 'https://via.placeholder.com/300x300?text=p1+site+url',
			description: 'p1 desc',
			feedbackRequest: 'p1 f_req',
			createdAt: '2021-09-14T16:47:28.371Z',
			lastModified: '2021-09-14T16:47:28.371Z',
			firstName: 'fn1',
			lastName: 'ln1',
			photoUrl: 'https://via.placeholder.com/300x300?text=user1+photo',
			tagId: 4,
			tagText: 'API',
			likeId: 4,
			likerUserId: 2,
			prjLikesCount: '1',
			prjCommentsCount: '0',
		},
		{
			id: 1,
			name: 'p1',
			creatorId: 1,
			image: 'https://via.placeholder.com/300x300?text=p1+image',
			repoUrl: 'https://via.placeholder.com/300x300?text=p1+repo+url',
			siteUrl: 'https://via.placeholder.com/300x300?text=p1+site+url',
			description: 'p1 desc',
			feedbackRequest: 'p1 f_req',
			createdAt: '2021-09-14T16:47:28.371Z',
			lastModified: '2021-09-14T16:47:28.371Z',
			firstName: 'fn1',
			lastName: 'ln1',
			photoUrl: 'https://via.placeholder.com/300x300?text=user1+photo',
			tagId: 3,
			tagText: 'JS',
			likeId: 4,
			likerUserId: 2,
			prjLikesCount: '1',
			prjCommentsCount: '0',
		},
		{
			id: 2,
			name: 'p2',
			creatorId: 2,
			image: 'https://via.placeholder.com/300x300?text=p2+image',
			repoUrl: 'https://via.placeholder.com/300x300?text=p2+repo+url',
			siteUrl: 'https://via.placeholder.com/300x300?text=p2+site+url',
			description: 'p2 desc',
			feedbackRequest: 'p2 f_req',
			createdAt: '2021-09-14T16:47:28.372Z',
			lastModified: '2021-09-14T16:47:28.372Z',
			firstName: 'fn2',
			lastName: 'ln2',
			photoUrl: 'https://via.placeholder.com/300x300?text=user2+photo',
			tagId: 2,
			tagText: 'CSS',
			likeId: null,
			likerUserId: null,
			prjLikesCount: '0',
			prjCommentsCount: '0',
		},
		{
			id: 2,
			name: 'p2',
			creatorId: 2,
			image: 'https://via.placeholder.com/300x300?text=p2+image',
			repoUrl: 'https://via.placeholder.com/300x300?text=p2+repo+url',
			siteUrl: 'https://via.placeholder.com/300x300?text=p2+site+url',
			description: 'p2 desc',
			feedbackRequest: 'p2 f_req',
			createdAt: '2021-09-14T16:47:28.372Z',
			lastModified: '2021-09-14T16:47:28.372Z',
			firstName: 'fn2',
			lastName: 'ln2',
			photoUrl: 'https://via.placeholder.com/300x300?text=user2+photo',
			tagId: 1,
			tagText: 'HTML',
			likeId: null,
			likerUserId: null,
			prjLikesCount: '0',
			prjCommentsCount: '0',
		},
	],
};

describe('Test the function projectsSqlToExpress', function () {
	test('it works when current user has liked one of the projects', function () {
		const currentUserId = 1;
		const projects = projectsSqlToExpress(data, currentUserId);
		expect(projects.length).toEqual(2);
		expect(projects[0].tags.length).toEqual(2);
		expect(projects[1].tags.length).toEqual(2);
	});
	test('it works when current user has not liked any of the projects', function () {
		const currentUserId = 2;
		const projects = projectsSqlToExpress(data, currentUserId);
		expect(projects.length).toEqual(2);
		expect(projects[0].tags.length).toEqual(2);
		console.log('PROJECTS: ', projects);
		expect(projects[1].tags.length).toEqual(2);
	});
});
