const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  // write an 'error' message to the console if user has no isAdmin property
  console.assert(user.isAdmin !== undefined,
    "createToken passed user without isAdmin property");

  let payload = {
  username: user.username,
  isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken }
