const express = require('express');
const disponibilidadeRoutes = express.Router();
const DisponibilidadePsicologosController = require('../controllers/DisponibilidadePsicologosController'); // Ajuste o caminho conforme necessário

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

disponibilidadeRoutes.use(ensureAuthenticated);

// Rota para criar nova disponibilidade
disponibilidadeRoutes.post(
  '/',
  DisponibilidadePsicologosController.criarDisponibilidade
);

// Rota para listar disponibilidades
disponibilidadeRoutes.get(
  '/disponibilidade',
  DisponibilidadePsicologosController.listarDisponibilidades
);

// Aqui, você pode adicionar mais rotas conforme necessário

module.exports = { disponibilidadeRoutes };
