const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Importando as rotas de perfil

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://admin:mps155@myapi.dpv3ofe.mongodb.net/?retryWrites=true&w=majority&appName=MyAPI";

// Conexão com o MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Usando as rotas de usuário
app.use('/api/users', userRoutes);

// Usando as rotas de perfil
app.use('/api/profile', profileRoutes); // Rota para o perfil

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
