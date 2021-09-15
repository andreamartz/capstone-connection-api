'use strict';

process.env.NODE_ENV = 'test'; // must come before import of db.js

const db = require('../db.js');
const {
	u1Data,
	u2Data,
	p1Data,
	p2Data,
	l1Data,
	l2Data,
	c1Data,
	adminData,
} = require('./_testCommonData');
const User = require('../models/user');
const Project = require('../models/project');
const Tag = require('../models/tag');
const Project_Comment = require('../models/project_comment');
const Project_Like = require('../models/project_like');
const Project_Tag = require('../models/project_tag');
const createToken = require('../helpers/tokens');

let user1, user2, adminUser, u1Token, u2Token, adminToken;
let user1Sparse, user2Sparse, adminUserSparse;
let project1, project2;
let likes;
let p1, p2;
let c1;
let l1, l2;
let t1, t2, t3, t4;
let pt1, pt2;

async function commonBeforeEach() {
	/**
	 * reset primary key sequence on projects
	 * this must come before doing the same for users;
	 */
	await db.query(
		"SELECT setval(pg_get_serial_sequence('projects', 'id'), 1, false) FROM projects",
	);

	// reset primary key sequence on users
	await db.query(
		"SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false) FROM users",
	);

	// reset primary key sequence on projects_tags join table
	await db.query(
		"SELECT setval(pg_get_serial_sequence('projects_tags', 'id'), 1, false) FROM projects_tags",
	);

	// reset primary key sequence on tags
	await db.query(
		"SELECT setval(pg_get_serial_sequence('tags', 'id'), 1, false) FROM tags",
	);

	// reset primary key sequence on comments
	await db.query(
		"SELECT setval(pg_get_serial_sequence('project_comments', 'id'), 1, false) FROM project_comments",
	);

	// reset primary key sequence on project_likes
	await db.query(
		"SELECT setval(pg_get_serial_sequence('project_likes', 'id'), 1, false) FROM project_likes",
	);

	await db.query('DELETE FROM projects');
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM projects_tags');
	await db.query('DELETE FROM tags');
	await db.query('DELETE FROM project_comments');
	await db.query('DELETE FROM project_likes');

	user1 = await User.register(u1Data);
	user2 = await User.register(u2Data);
	adminUser = await User.register(adminData);

	t1 = await Tag.create({ text: 'HTML' });
	t2 = await Tag.create({ text: 'CSS' });
	t3 = await Tag.create({ text: 'JS' });
	t4 = await Tag.create({ text: 'API' });

	p1 = await Project.create(p1Data);
	p2 = await Project.create(p2Data);

	l1 = await Project_Like.create(l1Data);
	l2 = await Project_Like.create(l2Data);

	c1 = await Project_Comment.create(c1Data);

	pt1 = await Project_Tag.create(1, p1Data.tags);
	pt2 = await Project_Tag.create(2, p2Data.tags);

	user1Sparse = await User.getOneByUsername(u1Data.username);
	user1 = await User.getOne(user1Sparse.id);

	user2Sparse = await User.getOneByUsername(u2Data.username);
	user2 = await User.getOne(user2Sparse.id);

	adminUserSparse = await User.getOneByUsername(adminData.username);
	adminUser = await User.getOne(adminUserSparse.id);

	project1 = await Project.getOne(1, 1);
	project2 = await Project.getOne(1, 2);
	likes = await Project_Like.getAll();
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

u1Token = createToken({ u1Data });
u2Token = createToken({ u2Data });
adminToken = createToken(adminData);

module.exports = {
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	p1,
	p2,
	l1,
	l2,
	user1,
	user2,
	adminUser,
	project1,
	project2,
	likes,
	u1Token,
	u2Token,
	adminToken,
};
