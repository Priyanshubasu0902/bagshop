const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/backendProject") // this url(127.0.0.1:27017) is just for development phase instead dynamic value (url) is going to be used to connect to the database dynamically
.then(function() {   // if connected
    console.log("connected");
})
.catch(function(err){  // if error appears
    console.log(err);
})

// mongoose.connection: Gives whole control of the database ("backendProject")
module.exports = mongoose.connection; // exports the control of the database