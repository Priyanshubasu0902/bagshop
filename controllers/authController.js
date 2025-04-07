const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

// register user
module.exports.registerUser = async (req, res) => {
  try {
    let { email, fullName, password } = req.body;

    // checking if the user is already registerd of not
    // searching the user in the userModel
    let foundedUser = await userModel.findOne({ email: email });
    // if(foundedUser) return res.status(401).send("You already have account, please login.");
    if (foundedUser) {
      req.flash("error", "You already have an account");
      return res.redirect("/");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          let createdUser = await userModel.create({
            fullName,
            email,
            password: hash,
          });
          let token = generateToken(createdUser);
          res.cookie("token", token);
          //  console.log(token);
          req.flash("success", "You are successfully registered");
          res.redirect("/");
        }
      });
    });
  } catch (err) {
    console.log(err.message); // just showing the error message not the whole error
  }
};

// login user
module.exports.loginUser = async function (req, res) {
  // destructuring
  let { email, password } = req.body;
  // checking if there is any user with this ecmail or not
  // searching the user in the userModel
  let foundedUser = await userModel.findOne({ email: email });
  // if(!foundedUser) return res.status(401).send("No such user");
  if (!foundedUser) {
    req.flash("error", "User not found");
    return res.redirect("/");
  }

  // validating password
  bcrypt.compare(password, foundedUser.password, (err, result) => {
    // res.send(result);
    if (result) {
      let token = generateToken(foundedUser);
      res.cookie("token", token); // send token as cookie
      // res.status(200).send("You can register");
      res.redirect("/shop");
    } else {
      // res.status(401).send("Email or password is incorrect");
      req.flash("error", "Email or password is incorrect");
      res.redirect("/");
    }
  });
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
};
