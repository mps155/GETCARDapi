const mongoose = require("mongoose");

const cardUserSchema = new mongoose.Schema({
  group: { type: String, required: true },
  userId: { type: String, required: true },
});

const CardUser = mongoose.model("CardUser", cardUserSchema);

module.exports = CardUser;
