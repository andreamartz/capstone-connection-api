/** Express app for Capstone Connections */

const express = require('express');

const app = express();

app.use(express.json());

/** 404 handler */


/** general error handler */



module.exports = app;