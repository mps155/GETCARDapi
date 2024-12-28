const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: false }, // Corrigido de Number para String
  exp: { type: Number, required: true },
  userId: { type: String, required: true },
  gcc: { type: Number, required: true },
  gcv: { type: Number, required: true }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
