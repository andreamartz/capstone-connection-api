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
        'https://placekitten.com/300/300',
        'https://github.com/JAWeiss89/onelayover',
        'https://www.onelayover.com/',
        'A place for flight attendants to share layover info',
        'Please give feedback on frontend and backend. Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nam reiciendis facere quasi magni iste corporis at placeat ipsam sequi in, voluptas repellendus, recusandae '),
       ('This is Test Project #2 - Access Academy',
        2,
        'https://placem.at/things?w=300',
        'https://github.com/andreamartz/sb-29-capstone-1',
        'https://access-academy.herokuapp.com/',
        'Course creation site for free self-teaching',
        'Is there a better way to organize my CSS? Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nam reiciendis facere quasi magni iste corporis at placeat ipsam sequi in, voluptas repellendus, recusandae inventore ratione rerum eaque! Atque earum repellendus nostrum perferendis natus ipsa hic sequi cupiditate quo perspiciatis laboriosam incidunt facilis, laudantium corrupti fugiat voluptatibus et excepturi! Porro illum ullam reiciendis impedit ab quisquam fuga, omnis soluta veniam odit ipsum odio corrupti optio quis neque! Provident nesciunt doloremque iste voluptatum voluptas! Distinctio, voluptatibus sequi qui ratione quam iusto esse dicta sunt! Quod magnam, corrupti, illo perferendis velit dolorem voluptates nam ratione molestiae eaque amet optio tenetur temporibus minima.'),
       ('This is Test Project #3 - Jobly',
        3,
        'https://via.placeholder.com/300x300?text=p3+image',
        'https://github.com/andreamartz/sb-43-React-Jobly-frontend',
        'https://jobs-app.surge.sh/',
        'Jobs and Companies',
        'Is there a better way to organize my CSS? Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nam reiciendis facere quasi magni iste corporis at placeat ipsam sequi in, voluptas repellendus, recusandae inventore ratione rerum eaque! Atque earum repellendus nostrum '),
       ('This is Test Project #4 - Allytweetfrontend',
        4,
        'https://via.placeholder.com/300x300?text=p4+image',
        'https://github.com/Cerchie/a11ytweetfrontend/tree/main/src',
        'https://luciacerchie.dev/',
        'A11y Retweet Bot',
        'Atque earum repellendus nostrum perferendis natus ipsa hic sequi cupiditate quo perspiciatis laboriosam incidunt facilis, laudantium corrupti fugiat voluptatibus et excepturi! Porro illum ullam reiciendis impedit ab quisquam fuga, omnis soluta veniam odit ipsum odio corrupti optio quis neque! Provident nesciunt doloremque iste voluptatum voluptas! Distinctio, voluptatibus sequi qui ratione quam iusto esse dicta sunt! Quod magnam, corrupti, illo perferendis velit dolorem voluptates nam ratione molestiae eaque amet optio tenetur temporibus minima.'),
        ('This is Test Project #5 - My Minimony',
        2,
        'https://placem.at/things?w=300',
        'https://github.com/agiletkiewicz/my-minimony-frontend',
        'https://www.myminimonyapp.com/',
        'My Minimony',
        'Distinctio, voluptatibus sequi qui ratione quam iusto esse dicta sunt!'
        );

INSERT INTO tags (id, text)
VALUES (1, 'HTML'),
        (2, 'CSS'),
        (3, 'JS'),
        (4, 'API');

INSERT INTO projects_tags (id, project_id, tag_id)
VALUES (1, 1, 1),
       (2, 1, 2),
       (3, 1, 3),
       (4, 1, 4),
       (5, 2, 3),
       (6, 2, 4),
       (7, 3, 2),
       (8, 4, 1),
       (9, 4, 2),
       (10, 4, 3),
       (11, 4, 4);

INSERT INTO project_likes (liker_id, project_id)
VALUES (1, 2),
       (1, 3),
       (2, 3),
       (3, 1),
       (4, 2),
       (4, 3);

INSERT INTO project_comments (commenter_id, project_id, comment)
VALUES (
        1, 2, 'Your whole project is just great! Atque earum repellendus nostrum perferendis natus ipsa hic sequi cupiditate quo perspiciatis laboriosam incidunt facilis'),
       (2, 1, 'Nice use of code!'),
       (3, 1, 'Hey, great job! Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto nam reiciendis facere quasi magni iste corporis at placeat ipsam sequi in, voluptas repellendus, recusandae inventore ratione rerum eaque! Atque earum repellendus nostrum '),
       (3, 2, 'Way to go! Lorem ipsum dolor sit amet consectetur adipisicing elit.'
);

INSERT INTO project_comment_likes (liker_id, comment_id)
VALUES (2, 1),
       (2, 2),
       (2, 4),
       (3, 1),
       (3, 2),
       (3, 3),
       (3, 4);