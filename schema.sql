CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT CHECK (position('@' IN email) > 1) UNIQUE,
  bio TEXT,
  photo_url VARCHAR(1000) DEFAULT 'https://res.cloudinary.com/wahmof2/image/upload/v1628100605/capstone_connections/users_capstone_connections/default-user-icon.png',
  portfolio_url TEXT,
  github_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  creator_id INTEGER REFERENCES users ON DELETE CASCADE,
  image VARCHAR(1000) DEFAULT 'https://res.cloudinary.com/wahmof2/image/upload/v1626296156/capstone_connections/projects_capstone_connections/undraw_Website_builder_re_ii6e.svg',
  repo_url TEXT,
  site_url TEXT NOT NULL UNIQUE,
  description VARCHAR(500),
  feedback_request VARCHAR(5000),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  text VARCHAR(8) NOT NULL UNIQUE
);

CREATE TABLE project_likes (
  id SERIAL PRIMARY KEY,
  liker_id INTEGER REFERENCES users ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects ON DELETE CASCADE,
  UNIQUE (liker_id, project_id)
);

CREATE TABLE project_comments (
  id SERIAL PRIMARY KEY,
  commenter_id INTEGER REFERENCES users ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- projects_tags is a many-to-many join table
CREATE TABLE projects_tags (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags ON DELETE CASCADE,
  UNIQUE (project_id, tag_id)
);

