const multer = require('multer');

const storage = multer.memoryStorage(); // creating a memory storage for multer
const upload = multer({storage: storage}); // defining the destination of storing the image file by default

module.exports = upload;