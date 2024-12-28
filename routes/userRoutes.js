const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

// Rota de registro de usuário
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Verificar se o usuário já existe
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Usuário já existe' });

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar o novo usuário
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'Usuário registrado com sucesso' });
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verificar se o usuário existe
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  // Verificar a senha
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

  // Criar o token JWT
  const token = jwt.sign({ userId: user._id }, 'seu_segredo_jwt', { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;