const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, '..', '.env')});
const { router } = require('./routes/index.js');

const app = express();

// Middleware para CORS
app.use(cors());

app.use(express.json());

// Definindo as rotas
app.use('/api', router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
