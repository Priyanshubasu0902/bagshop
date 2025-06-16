const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const ownerModel = require("../models/owner-model");
const ownerIsLoggedIn = require("../middlewares/ownerIsLoggedIn");

router.get("/", (req, res) => {
  res.send("hey products");
});

router.post(
  "/create",
  ownerIsLoggedIn,
  upload.single("image"),
  async (req, res) => {
    // res.send(req.file);
    try {
      let { name, price, quantity, discount, bgcolor, panelcolor, textcolor } =
        req.body;
      let createdProduct = await productModel.create({
        image: req.file.buffer,
        name,
        price,
        quantity,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
      });

      let foundedOwner = await ownerModel.findOne({ email: req.owner.email });
      foundedOwner.products.push(createdProduct._id);
      await foundedOwner.save();

      // res.send(createdProduct);
      req.flash("success", "Product created successfully");
      res.redirect("/owners/admin");
    } catch (err) {
      res.send(err.message);
    }
  }
);

router.post(
  "/edit/:id",
  ownerIsLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      let { name, price, quantity, discount, bgcolor, panelcolor, textcolor } =
        req.body;

      const updatedFields = {
        name,
        price,
        quantity,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
      };

      if (req.file) {
        updatedFields.image = req.file.buffer;
      }

      let updatedProduct = await productModel.findOneAndUpdate(
        { _id: req.params.id },
        updatedFields
      );
      req.flash("success", "Product edited successfully");
      res.redirect("/owners/admin");
    } catch (err) {
      res.send(err.mesage);
    }
  }
);

router.get("/delete/:id", ownerIsLoggedIn, async (req, res) => {
  try {
    const deletedProduct = await productModel.findOneAndDelete({
      _id: req.params.id,
    });
    const foundedOwner = await ownerModel.findOne({ _id: req.owner.id });
    foundedOwner.products.splice(
      foundedOwner.products.indexOf(deletedProduct._id),
      1
    );
    foundedOwner.save();
    req.flash("success", "Product deleted successfully");
    res.redirect("/owners/product");
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/deleteAll", ownerIsLoggedIn, async (req, res)=> {
    try{
        
        const owner = await ownerModel.findOne({_id: req.owner.id});
        owner.products.forEach(async (product)=>{
            const deletedProduct = await productModel.findOneAndDelete({_id: product});
        })
        // owner.products.splice(0, owner.products.length);
        owner.products = [];
        owner.save();
        req.flash("success", "All Products deleted");
        res.redirect('/owners/product')
    }
    catch(err) {
        res.send(err.message)
    }
})

module.exports = router;
