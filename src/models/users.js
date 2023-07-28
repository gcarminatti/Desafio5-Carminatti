import mongoose from "mongoose";

const schema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const userModel = mongoose.model("users", schema);

export default userModel;
