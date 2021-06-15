/** Start server for Capstone Connection. */

const app = require("./app");
const { PORT } = require("./config");

// keep app.listen at bottom of file
app.listen(PORT, function() {
  console.log(`Server starting on port ${PORT}!`);
});
