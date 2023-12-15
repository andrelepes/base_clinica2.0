const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');
const evolutionsRoutes = require('express').Router();
const EvolutionsController = require('../controllers/evolutionsController');

const evolutionsController = new EvolutionsController();

evolutionsRoutes.post(
  '/:patientId',
  ensureAuthenticated,
  evolutionsController.createEvolutionForUserIdAndPatientId
);

evolutionsRoutes.get(
  '/:patientId',
  ensureAuthenticated,
  evolutionsController.getAllEvolutionsByUserIdAndPatientId
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
