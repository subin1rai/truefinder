const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  preferences: String,
});

module.exports = mongoose.model("Profile", profileSchema);
