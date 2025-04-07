const mongoose = require("mongoose");
const config = require("config");
// const dbgr = require("debug")("development:mongoose");
// const dbgr = require("debug")("production:mongose");

// Dynamic Debugging
const env = process.env.NODE_ENV || 'development';
const dbgr = require("debug")(`${env}:mongoose`);

// mongoose.connect("mongodb://127.0.0.1:27017/backendProject") // this url(127.0.0.1:27017) is just for development phase instead dynamic value (url) is going to be used to connect to the database dynamically
// .then(function() {   // if connected
//     console.log("connected");
// })
// .catch(function(err){  // if error appears
//     console.log(err);
// })
console.log(config.get("State")); // just for understanding
mongoose
  .connect(`${config.get("MONGODB_URI")}/backendProject`) // this url(127.0.0.1:27017) is just for development phase instead dynamic value (url) is going to be used to connect to the database dynamically
  .then(function () {
    // if connected
    dbgr("connected");
  })
  .catch(function (err) {
    // if error appears
    dbgr(err);
  });

// mongoose.connection: Gives whole control of the database ("backendProject")
module.exports = mongoose.connection; // exports the control of the database
