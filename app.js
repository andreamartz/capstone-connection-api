"use strict"

/** Express app for Capstone Connections */

const express = require('express');
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT, ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");
const tagsRoutes = require("./routes/tags");
const projectCommentsRoutes = require("./routes/project_comments");

const morgan = require("morgan");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
console.log("HELLLLOOO");
app.use(express.json({ limit: '50mb' }));  // limits file upload size
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/projects", projectsRoutes);
app.use("/tags", tagsRoutes);
app.use("/project_comments", projectCommentsRoutes);


/** 404 error handler (matches everything) */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;