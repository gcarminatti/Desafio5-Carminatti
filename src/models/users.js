import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: String,
  email: String,
  password: String,
});

const userModel = mongoose.model("Users", schema);

export default userModel;
