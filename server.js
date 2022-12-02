// MAIN File
// for database configuration, env variables, server listening on a port

//SAFETY NET | HANDLING uncaught EXCEPTIONS in sync code
process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  console.log("Unhandled Exception, Shutting down");
  process.exit(1);
});

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const app = require("./app.js");

// MONGODB Connexion
let url = process.env.DB_URL.replace("<password>", process.env.DB_Password);
url = url.replace("<username>", process.env.DB_USERNAME);

mongoose.connect(url).then((con) => {
  console.log("DB connection successful");
});

// Server
const port = process.env.PORT || 8002;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//SAFETY NET | HANDLING unhandled PROMISE REJECTIONS in async code
process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  console.log("Unhandled rejection, Shutting down");
  server.close(() => {
    process.exit(1);
  });
});
