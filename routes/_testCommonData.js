const u1Data = {
  username: 'u1',
  password: 'password1',
  firstName: 'U1F',
  lastName: 'U1L',
  email: 'user1@user.com',
  bio: 'I am User1, a self-taught developer',
  photoUrl:
    'https://res.cloudinary.com/wahmof2/image/upload/v1628102121/capstone_connections/users_capstone_connections/Alejandro-Martinez.jpg',
  portfolioUrl: 'https://alexm323.github.io/portfolio/',
  gitHubUrl: 'https://github.com/alexm323',
  isAdmin: false,
};

const u2Data = {
  username: 'u2',
  password: 'password2',
  firstName: 'U2F',
  lastName: 'U2L',
  email: 'user2@user.com',
  bio: 'I am User2, a self-taught developer',
  photoUrl:
    'https://res.cloudinary.com/wahmof2/image/upload/v1627846993/capstone_connections/users_capstone_connections/lv6k2r59n9c9xeshkvhs_ktjgxt.png',
  portfolioUrl: 'https://andreamartz.dev/',
  gitHubUrl: 'https://github.com/andreamartz',
  isAdmin: false,
};

const adminData = {
  username: 'admin',
  password: 'adminPassword',
  firstName: 'AdminF',
  lastName: 'AdminL',
  email: 'admin@admin.com',
  bio: 'I am AdminF, a self-taught developer',
  photoUrl:
    'https://res.cloudinary.com/wahmof2/image/upload/v1628101940/capstone_connections/users_capstone_connections/Aimee-Wildstone.jpg',
  portfolioUrl: 'https://luciacerchie.dev/',
  gitHubUrl: 'https://github.com/andreamartz',
  isAdmin: true,
};

const p1Data = {
  name: 'Project 1',
  description: 'This is Project 1, created by u1',
  creatorId: 1,
  image:
    'https://res.cloudinary.com/wahmof2/image/upload/v1628115339/capstone_connections/projects_capstone_connections/undraw_youtube_tutorial_2gn3-Access-Academy-Andrea-Martz.svg',
  feedbackRequest: 'Feedback request for project 1',
  tags: [3, 4],
  repoUrl: 'https://github.com/andreamartz/sb-29-capstone-1',
  siteUrl: 'https://access-academy.herokuapp.com/',
};

const p2Data = {
  name: 'Project 2',
  description: 'This is Project 2, created by u1',
  creatorId: 1,
  image:
    'https://res.cloudinary.com/wahmof2/image/upload/v1626296156/capstone_connections/projects_capstone_connections/undraw_Website_builder_re_ii6e.svg',
  feedbackRequest: 'Feedback request for project 1',
  tags: [1, 2],
  repoUrl: 'https://github.com/debrakayeelliott',
  siteUrl: 'https://debrakayeelliott.com/',
};

const c1Data = {
  projectId: 1,
  commenterId: 2,
  comment: 'My comment',
};

const pt1Data = { projectId: 1, tags: [3, 4] };
const pt2Data = { projectId: 2, tags: [1, 2] };

module.exports = {
  u1Data,
  u2Data,
  adminData,
  p1Data,
  p2Data,
  c1Data,
  pt1Data,
  pt2Data,
};
