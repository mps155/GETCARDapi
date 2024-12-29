const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const CardUser = require("../models/cardUserModel");
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

// Rota para consultar o perfil
router.post("/register", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = req.body;

    const cardUsers = groups.map((group) => ({
      group,
      userId,
    }));

    await CardUser.insertMany(cardUsers);

    res.status(201).json({ message: "Cartas registradas com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/getAllByUser", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const cardGroupList = (
      await CardUser.find({ userId: userId }).select("group -_id")
    ).map((item) => item.group);

    const cardList = await Card.find({ group: { $in: cardGroupList } });

    res.status(201).json({ cardList });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.get("/getInitialCollection", async (req, res) => {
  try {
    const cardList = await Card.aggregate([
      { $match: { raridade: "ED" } },
      { $sample: { size: 5 } },
    ]);

    res.status(201).json({ cardList });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
