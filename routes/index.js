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
  let index = foundUser.cart.findIndex(obj => obj.productId.toString().toString()===req.params.productid);
  if(index>=0) {
    foundUser.cart[index].quantity++;
  }
  else{
    foundUser.cart.push({
      productId: req.params.productid,
      quantity:1
    }
    );
  }
  await foundUser.save();
  req.flash("success", "Added to cart");
  res.redirect("/cart");
});

router.get('/removefromcart/:productid', isLoggedIn, async(req, res)=> {
  let foundedUser = await userModel.findOne({ email: req.user.email});
  let index = foundedUser.cart.findIndex(obj => obj.productId.toString().toString()===req.params.productid);
  if(foundedUser.cart[index].quantity>1) {
    foundedUser.cart[index].quantity--;
  }
  else{
    foundedUser.cart.splice(index,1);
  }
  await foundedUser.save();
  req.flash("success", "Removed from cart");
  res.redirect('/cart');
})

router.get("/cart", isLoggedIn, async (req, res) => {
  let success = req.flash("success");
  let foundUser = await userModel
    .findOne({ email: req.user.email })
    .populate("cart.productId");
  res.render("cart", { user: foundUser, type: "user", success });
});

module.exports = router;
