const express = require('express');
const consultoriosRoutes = express.Router();
const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');
const consultoriosController = require('../controllers/consultoriosController'); // Ajuste o caminho conforme necessário

consultoriosRoutes.use(ensureAuthenticated);

consultoriosRoutes.post('/', consultoriosController.inserirConsultorio);

consultoriosRoutes.get('/', consultoriosController.listarConsultorios);

consultoriosRoutes.get(
  '/clinica/',
  consultoriosController.getConsultoriosByClinica
);

consultoriosRoutes.get('/:consultorio_id', consultoriosController.buscarPorId);

consultoriosRoutes.put(
  '/:consultorio_id',
  consultoriosController.updateOffice
);

consultoriosRoutes.delete(
  '/:consultorio_id',
  consultoriosController.deletarConsultorio
);

// Adicione outras rotas conforme necessário

module.exports = { consultoriosRoutes };
