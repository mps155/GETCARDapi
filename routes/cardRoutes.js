const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Card = require("../models/cardModel");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const cards = req.body;
    console.log(cards);
    if (!Array.isArray(cards)) {
      return res
        .status(400)
        .json({ message: "Os dados devem ser uma lista de objetos." });
    }

    const savedCards = [];
    for (const card of cards) {
      const {
        modelo,
        group,
        ano,
        marca,
        cilindrada,
        cilindros,
        potencia,
        velocidade,
        aceleracao,
        raridade,
      } = card;

      const existingCard = await Card.findOne({ group });
      if (existingCard) {
        return res
          .status(400)
          .json({ message: `A carta com o grupo ${group} já existe.` });
      }

      const newCard = new Card({
        modelo,
        group,
        ano,
        marca,
        cilindrada,
        cilindros,
        potencia,
        velocidade,
        aceleracao,
        raridade,
      });
      const savedCard = await newCard.save();
      savedCards.push(savedCard);
    }

    res
      .status(201)
      .json({ message: "Cartas registradas com sucesso"});
  } catch (error) {
    console.error("Erro ao registrar cartas:", error);
    res
      .status(500)
      .json({ message: "Erro ao registrar cartas", error: error.message });
  }
});

// Rota de login
router.post("/consult", async (req, res) => {
  const { email, password } = req.body;

  // Verificar se o usuário existe
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

  // Verificar a senha
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Senha incorreta" });

  // Criar o token JWT
  const token = jwt.sign({ userId: user._id }, "mps155", {
    expiresIn: "1h",
  });
  console.log("login:", token);
  res.json({ token });
});

module.exports = router;
