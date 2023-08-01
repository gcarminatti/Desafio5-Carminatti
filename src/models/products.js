import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
});

const userModel = mongoose.model("Products", productsSchema);

export default userModel;
