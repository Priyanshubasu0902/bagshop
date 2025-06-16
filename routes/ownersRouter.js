const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const {
  registerOwner,
  ownerLogin,
  ownerLogout,
} = require("../controllers/ownerAuthController");
const ownerIsLoggedIn = require("../middlewares/ownerIsLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");

router.get("/", ownerIsLoggedIn, (req, res) => {});

router.get("/product", ownerIsLoggedIn, async (req, res) => {
  let foundedOwner = await ownerModel
    .findOne({ email: req.owner.email })
    .populate("products");
  let success = req.flash("success");
  res.render("admin", { owner: foundedOwner, type: "owner", success });
});

router.get("/login", (req, res) => {
  let error = req.flash("error");
  res.render("owner-login", { error, loggedin: false, type: "owner" });
});

// console.log(process.env.NODE_ENV);
try {
  if (process.env.NODE_ENV === "development") {
    router.post("/create", registerOwner);
  }
} catch (err) {
  console.log(err.message);
}
// this route would only work in development phase (environment is "development")

router.post("/login", ownerLogin);

router.get("/admin", ownerIsLoggedIn, (req, res) => {
  let success = req.flash("success");
  res.render("createproducts", { success, type: "owner" });
});

router.get("/editProduct/:id", ownerIsLoggedIn, async (req, res) => {
  let success = req.flash("success");

  const foundedProduct = await productModel.findOne({ _id: req.params.id });
  // res.send(foundedProduct);
  res.render("editProduct", {
    success,
    type: "owner",
    product: foundedProduct,
  });
});

router.get("/logout", ownerLogout);

module.exports = router;
