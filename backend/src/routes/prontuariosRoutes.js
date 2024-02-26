const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

const prontuariosRoutes = require('express').Router();

const prontuariosController = require('../controllers/prontuariosController');

prontuariosRoutes.post(
  '/',
  ensureAuthenticated,
  prontuariosController.addProntuario
);

prontuariosRoutes.get(
  '/:pacientes_id/prontuarios',
  ensureAuthenticated,
  prontuariosController.getProntuariosByPacienteId
);

prontuariosRoutes.put(
  '/:pacientes_id/prontuarios/:prontuario_id',
  ensureAuthenticated,
  prontuariosController.updateProntuarioById
);

prontuariosRoutes.delete(
  '/prontuarios/:prontuario_id',
  ensureAuthenticated,
  prontuariosController.deleteProntuario
);

module.exports = { prontuariosRoutes };
