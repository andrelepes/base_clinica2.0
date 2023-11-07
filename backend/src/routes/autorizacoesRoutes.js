const  ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

const autorizacoesRoutes = require('express').Router();
const autorizacoesController = require('../controllers/autorizacoesController');

// Rota para conceder autorização
autorizacoesRoutes.post(
  '/autorizar',
  ensureAuthenticated,
  autorizacoesController.concederAutorizacao
);

// Rota para retirar autorização
autorizacoesRoutes.delete(
  '/retirarAutorizacao/:clinica_id/:usuario_id/:paciente_id',
  ensureAuthenticated,
  autorizacoesController.retirarAutorizacao
);

// Rota para listar psicólogos autorizados para um paciente específico
autorizacoesRoutes.get(
  '/autorizados/:paciente_id',
  ensureAuthenticated,
  autorizacoesController.listarAutorizados
);

module.exports = { autorizacoesRoutes };
