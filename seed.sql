-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, bio, photo_url, portfolio_url, github_url, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test1',
        'User',
        'test1user@testuser.com',
        'I am testuser a self-taught web developer.',
        './static/test-user-jonas-kakaroto-mjRwhvqEC0U-unsplash.jpg',
        'https://andreamartz.dev/',
        'https://github.com/andreamartz',
        FALSE
        ),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test2',
        'Admin',
        'test2user@testuser.com',
        'I am testadmin, a self-taught senior web developer.',
        './static/test-admin-christopher-campbell-rDEOVtE7vOs-unsplash.jpg',
        'https://andreamartz.dev/',
        'https://github.com/andreamartz',
        TRUE),
        ('user1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'u1First',
        'u1Last',
        'user1@user1.com',
        'I am user1.',
        './static/test-admin-christopher-campbell-rDEOVtE7vOs-unsplash.jpg',
        'https://andreamartz.dev/',
        'https://github.com/andreamartz',
        FALSE),
        ('user2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'u2First',
        'u2Last',
        'user2@user2.com',
        'I an user2.',
        './static/test-admin-christopher-campbell-rDEOVtE7vOs-unsplash.jpg',
        'https://andreamartz.dev/',
        'https://github.com/andreamartz',
        TRUE);


INSERT INTO projects (name, creator_id, image, repo_url, site_url, description, feedback_request)
VALUES ('This is Test Project #1 - One Layover',
        1,
        'https://via.placeholder.com/300x300?text=p1+image',
        'https://github.com/JAWeiss89/onelayover',
        'https://www.onelayover.com/',
        'A place for flight attendants to share layover info',
        'Please give feedback on frontend and backend.'),
       ('This is Test Project #2 - Access Academy',
        2,
        'https://via.placeholder.com/300x300?text=p2+image',
        'https://github.com/andreamartz/sb-29-capstone-1',
        'https://access-academy.herokuapp.com/',
        'Course creation site for free self-teaching',
        'Is there a better way to organize my CSS?'),
       ('This is Test Project #3 - Jobly',
        3,
        'https://via.placeholder.com/300x300?text=p3+image',
        'https://github.com/andreamartz/sb-43-React-Jobly-frontend',
        'https://jobs-app.surge.sh/',
        'Jobs and Companies',
        'Is there a better way to organize my CSS?');

INSERT INTO tags (text)
VALUES ('HTML'),
        ('CSS'),
        ('JS'),
        ('API');

INSERT INTO projects_tags (project_id, tag_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (2, 3),
       (2, 4);

INSERT INTO project_likes (liker_id, project_id)
VALUES (1, 2),
       (1, 3),
       (2, 3);

INSERT INTO project_comments (commenter_id, project_id, comment)
VALUES (1, 2, 'Your whole project is just great!'),
       (2, 1, 'Nice use of code!'),
       (3, 1, 'Hey, great job!'),
       (3, 2, 'Way to go!');

INSERT INTO project_comment_likes (liker_id, comment_id)
VALUES (2, 1),
       (2, 2),
       (2, 4),
       (3, 1),
       (3, 2),
       (3, 3),
       (3, 4);