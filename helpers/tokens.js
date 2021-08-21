const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  // write an 'error' message to the console if user has no isAdmin property
  console.log("USER TO CREATE TOKEN FOR: ", user);
  console.assert(user.isAdmin !== undefined,
    "createToken passed user without isAdmin property");
  let payload = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    bio: user.bio,
    portfolioUrl: user.portfolioUrl,
    gitHubUrl: user.gitHubUrl,
    isAdmin: user.isAdmin || false,
  };
  console.log("TOKEN: ", jwt.sign(payload, SECRET_KEY));
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = createToken;
