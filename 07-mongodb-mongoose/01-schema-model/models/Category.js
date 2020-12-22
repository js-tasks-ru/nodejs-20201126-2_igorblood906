const mongoose = require("mongoose");
const connection = require("../libs/connection");

const CATEGORY = {
  title: {
    type: String,
    index: true,
    required: true,
  },
};

const subCategorySchema = new mongoose.Schema(CATEGORY);

const categorySchema = new mongoose.Schema({
  subcategories: [subCategorySchema],
  ...CATEGORY,
});

module.exports = connection.model("Category", categorySchema);
