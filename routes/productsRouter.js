const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');
const ownerModel = require('../models/owner-model');
const ownerIsLoggedIn = require('../middlewares/ownerIsLoggedIn');

router.get('/', (req, res) => {
    res.send('hey products');
});

router.post('/create', ownerIsLoggedIn, upload.single('image'), async (req, res) => {
    // res.send(req.file);
    try{
        let {name, price, quantity, discount, bgcolor, panelcolor,textcolor} = req.body; 
        let createdProduct = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            quantity,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });

        let foundedOwner = await ownerModel.findOne({email: req.owner.email});
        foundedOwner.products.push(createdProduct._id); 
        await foundedOwner.save();

        // res.send(createdProduct);
        req.flash('success', "Product created successfully")
        res.redirect('/owners/admin');
    }
    catch(err) {
        res.send(err.message);
    }
});


module.exports = router;