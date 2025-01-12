const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Usuário já existe" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  const newProfile = new Profile({
    userId: newUser._id, 
    name: name,
    exp: 0,
    gcc: 0,
    gcv: 0
  });

  await newProfile.save();

  res.status(201).json({ message: "Usuário registrado com sucesso" });
});

// Rota de login
router.post("/login", async (req, res) => {
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
  res.json({ token });
});

module.exports = router;
