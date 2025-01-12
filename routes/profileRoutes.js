const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Profile = require("../models/profileModel"); // Importando o modelo Profile

const router = express.Router();

// Middleware para verificar o token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Pega o token do header 'Authorization'
  
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, "mps155", (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user; // O user decodificado do JWT será atribuído a req.user
    next();
  });
};

// Rota para consultar o perfil
router.get("/", authenticateToken, async (req, res) => {
  try {
    // O userId do usuário é extraído do JWT (req.user é o usuário decodificado)
    const userId = req.user.userId;
    // Buscar o perfil associado ao userId
    const profile = await Profile.findOne({
      userId: userId,
    });

    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
