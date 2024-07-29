const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');
const evolutionsRoutes = require('express').Router();
const EvolutionsController = require('../controllers/evolutionsController');

const evolutionsController = new EvolutionsController();

evolutionsRoutes.post(
  '/paciente/:patientId',
  ensureAuthenticated,
  evolutionsController.createEvolutionForUserIdAndPatientId
);

evolutionsRoutes.get(
  '/paciente/:patientId',
  ensureAuthenticated,
  evolutionsController.getAllEvolutionsByPatientId
);

evolutionsRoutes.get(
  '/generate',
  ensureAuthenticated,
  evolutionsController.generatePendingEvolution
);

evolutionsRoutes.get(
  '/:evolutionId',
  ensureAuthenticated,
  evolutionsController.getEvolutionByIdAndUserId
);

evolutionsRoutes.put(
  '/:evolutionId',
  ensureAuthenticated,
  evolutionsController.updateEvolutionByIdAndUserId
);

evolutionsRoutes.delete(
  '/:evolutionId',
  ensureAuthenticated,
  evolutionsController.deleteEvolutionByIdAndUserId
);

module.exports = { evolutionsRoutes };
