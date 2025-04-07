const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    image: Buffer,  // this field stores the image file as Buffer
    name: String,
    price: Number, 
    quantity: Number,
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: String,
    panelcolor: String,
    textcolor: String
});

module.exports = mongoose.model("product", productSchema);