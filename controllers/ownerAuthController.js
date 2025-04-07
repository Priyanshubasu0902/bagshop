const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const ownerModel = require('../models/owner-model');

module.exports.registerOwner =  async (req, res) => {
    // res.send("Hey");
    const foundedOwners = await ownerModel.find({ email: req.body.email });
    if (foundedOwners.length > 0) {
      return res
        .status(504)
        .send("You dont't have permission to create a new owner");
    }

    // res.send("We can create a new owner");
    let { fullname, email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return console.log(err.message);
        const createdOwner = await ownerModel.create({
          fullname,
          email,
          password: hash,
        });
        res.status(201).send(createdOwner);
      });
    });
  }

module.exports.ownerLogin =  async (req, res) => {
    try {  
        let { email, password } = req.body;
        let foundOwner = await ownerModel.findOne({ email });
        if (!foundOwner) {
            req.flash("error", "Owner Not found");
            return res.redirect("/owners/login");
        }
        bcrypt.compare(password, foundOwner.password, (err, result) => {
            if(result) {
                let token = generateToken(foundOwner);
                res.cookie('token', token);
                res.redirect('/owners/product');
            }
            else {
                req.flash("error", "Incorrect Password");
                res.redirect('/owners/login');
            }
        });
    }
    catch(err) {
        req.flash("error", "something went wrong");
        res.redirect("/owners");
    }
}

module.exports.ownerLogout =  async (req, res) => {
    try {  
       res.cookie("token", "");
       res.redirect('/onwers/login');
    }
    catch(err) {
        req.flash("error", "something went wrong");
        res.redirect("/owners");
    }
}