# Capstone Connection API

The frontend for this project can be found here: https://github.com/andreamartz/capstone-connection

## Database Schema

![Database Schema](./static/database-schema.png)

## Setup

Be sure you have Node and npm installed.
To install dependencies for this project, run `npm install`
Start the server by running `node server.js`

## Testing

To run tests, run `npm test`

## Authentication and authorization

For all get requests requiring authentication/authorization, pass along the token in the header of the request.
For all other requests, pass along the token in body of request along with any other requirements expected by that route.

## API endpoints and methods

### auth

- `POST "/auth/register"` No auth necessary. Creates
- `POST "/auth/token"` No auth necessary. Verifies that the user exists and that the correct password was used. Creates a token for user.

### users

- `GET "/users/:id"` User must be logged in. Get a specific user.
- `GET "/users/:id/projects"` User must be logged in. Get a a list of projects for the user with that id.
- `PATCH "/users/:id"` User must be the one with the id specified in the path. Updates the user's info.

### projects

- `POST "/projects"` User must be logged in. Create a new project.
- `POST "/projects/:id/likes"` User must be logged in. Add a like to a project.
- `POST "/projects/:id/tags"` User must be an admin or the correct user. Add a tag to a project.
- `GET "/projects"` User must be logged in. Get all projects. By passing in optional data, the projects can be filtered or sorted.
- `GET "/projects/:id"` User must be logged in. Get a project by id.
- `DELETE "/projects/:id/likes/:id"` User must be an admin or the correct user. Remove a like from a project.

### tags

`POST "/tags"` User must be an admin. Create a new tag.
`GET "/tags"` User must be logged in. Get all tags.

### project_comments

`POST "/project_comments"` User must be logged in. Post a comment to a project to give feedback.
`PATCH "/project_comments"` User must be an admin or the correct user. Change data pertaining to a project.
