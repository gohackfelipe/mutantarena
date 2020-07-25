const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  email: String,
  name: String,
  admin: Boolean
});

module.exports = mongoose.model("User", User);
