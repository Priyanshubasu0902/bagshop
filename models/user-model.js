const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity:{
        type: Number,
        default: 0
      }
    },
  ],
  orders: [],
  contact: Number,
  picture: String,
});

module.exports = mongoose.model("user", userSchema);
