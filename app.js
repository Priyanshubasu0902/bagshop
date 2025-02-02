const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const db = require("./config/mongoose-connection"); // require the control of the database exported from "mongoose-connection" inside "config" folder

const ownerRouter = require("./routes/ownersRouter");
const userRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view-engine", "ejs");

app.use("/owner", ownerRouter); // '/owner' request sent to "ownderRouter"
app.use("/users", userRouter); // '/user' request sent to "userRouter"
app.use("/products", productRouter); // '/product' request sent to "productRouter"

app.listen(3000);
