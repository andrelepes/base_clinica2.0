const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

const clinicasRoutes = require('express').Router();
const clinicasController = require('../controllers/clinicasController');

// GET e POST para listar psicólogos vinculados a uma clínica
clinicasRoutes.get(
  '/:id/linked-psychologists',
  ensureAuthenticated,
  clinicasController.listLinkedPsychologists
);

// GET para listar secretários vinculados a uma clínica
clinicasRoutes.get(
  '/:id/linked-secretaries',
  ensureAuthenticated,
  clinicasController.listLinkedSecretaries
);

module.exports = { clinicasRoutes };
