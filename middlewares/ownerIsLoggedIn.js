const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async (req, res, next) => {
  try {
    // check if not logged in (if cookies is not present)
    if (!req.cookies.token) {
      req.flash("error", "You need to login first"); // flash message sent
      return res.redirect("/owners/login"); // flash message can be accessed in this route too
    }

    // If req.cookies.token has some value
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY); // returns the properties used to create token
    // find the user in the userModel using the email (properties used to create a token)
    let owner = await ownerModel
      .findOne({ email: decoded.email, _id: decoded.id }) // returns the whole user
      .select("-password"); // this would return the whole user except the "password" field
    if (!owner) {
      req.flash("error", "You need to login first");
      return res.redirect("/owners/login");
    }
    req.owner = owner; // created a "owner" field in request and initialized it with owner found
    next();
  } catch (err) {
      req.flash("error", "something went wrong");
      res.redirect("/owners");
  }
};
