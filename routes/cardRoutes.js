const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Card = require("../models/cardModel");

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Pega o token do header 'Authorization'
  console.log("valid:", token);

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, "mps155", (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};

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

router.get("/getAllCards", authenticateToken, async (req, res) => {
  
  const cardList = await Card.find({});
  console.log(cardList);
  res.json({ cardList });
});

module.exports = router;
