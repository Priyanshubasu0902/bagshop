const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", (req, res) => {
  let error = req.flash("error"); // accessing the flash message from the previous route
  let success = req.flash("success");
  res.render("index", { error: error, loggedin: false, success: success }); // sending the flash message to the ejs file
  // or
  // res.render("index", {error});
});

router.get("/shop", isLoggedIn, async (req, res) => {
  let success = req.flash("success");
  let foundProducts = await productModel.find();
  res.render("shop", {
    products: foundProducts,
    success: success,
    type: "user",
    sort: "default",
  });
});

router.get("/shop/discount", isLoggedIn, async (req, res) => {
  let success = req.flash("success");
  let foundedProducts = await productModel.find({ discount: { $gt: 0 } });
  res.render("shop", {
    products: foundedProducts,
    success: success,
    type: "user",
    sort: "default",
  });
});

router.get("/shop/available", isLoggedIn, async (req, res) => {
  let success = req.flash("success");
  let foundedProducts = await productModel.find({ quantity: { $gt: 0 } });
  res.render("shop", {
    products: foundedProducts,
    success,
    type: "user",
    sort: "default",
  });
});

router.post("/shop/price", isLoggedIn, async (req, res) => {
  let success = req.flash("success");
  let { start, end } = req.body;
  // console.log(start);
  // console.log(end);
  // res.send("found");
  let foundedProducts = await productModel.find({
    price: { $gte: start, $lte: end },
  });
  res.render("shop", {
    products: foundedProducts,
    success,
    type: "user",
    sort: "default",
  });
});

router.post("/shop/sort", isLoggedIn, async (req, res) => {
  let { sortby } = req.body;
  let success = req.flash("success");
  let foundedProducts = await productModel.find();
  if (sortby == "newest") {
    res.render("shop", {
      products: foundedProducts.reverse(),
      success,
      type: "user",
      sort: "newest",
    });
  } else {
    res.redirect("/shop");
  }
});

router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
  let foundUser = await userModel.findOne({ email: req.user.email });
  foundUser.cart.push(req.params.productid);
  await foundUser.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res) => {
  let foundUser = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  res.render("cart", { user: foundUser, type: "user" });
});

module.exports = router;
