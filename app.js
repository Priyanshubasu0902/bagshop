const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");
const mongoose = require('mongoose');  // if it is not required database won't be created

require('dotenv').config(); // to access all the environment variables in the .env file
// or
// require('dotenv/config');

const db = require("./config/mongoose-connection"); // require the control of the database exported from "mongoose-connection" inside "config" folder

const ownerRouter = require("./routes/ownersRouter");
const userRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,  // resave: for saving everytime, false means to not save everytime if there is no change
        saveUninitialized: false, // to not create a session for a user who is not logged in or not initialized
        secret: process.env.EXPRESS_SESSION_SECRET,  // secret is handled using environment variables
    })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use('/', indexRouter); // '/' Request sent to indexRouter;
app.use("/owners", ownerRouter); // '/owner' request sent to "ownerRouter"
app.use("/users", userRouter); // '/user' request sent to "userRouter"
app.use("/products", productRouter); // '/product' request sent to "productRouter"

app.listen(3000);
