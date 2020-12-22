const mongoose = require("mongoose");
const connection = require("../libs/connection");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    required: true,
  },
  description: {
    type: String,
    index: true,
    required: true,
  },
  price: {
    type: Number,
    index: true,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subCategory",
    required: true,
  },
  images: [String],
});

module.exports = connection.model("Product", productSchema);
