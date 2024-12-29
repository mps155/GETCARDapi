const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  group: { type: String, required: true, unique: true },
  modelo: { type: String, required: true },
  cilindrada: { type: Number, required: true },
  cilindros: { type: Number, required: true },
  potencia: { type: Number, required: true },
  velocidade: { type: Number, required: true },
  aceleracao: { type: Number, required: true },
  raridade: { type: String, required: true },
  ano: { type: Number, required: true },
  marca: { type: String, required: true },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
