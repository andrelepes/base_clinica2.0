const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const anamnesisRoutes = require('express').Router();
const AnamnesisController = require('../controllers/anamnesisController');

const anamnesisController = new AnamnesisController();

anamnesisRoutes.post(
  '/',
  ensureAuthenticated,
  anamnesisController.createAnamnesis
);

anamnesisRoutes.get(
  '/patient/:patientId',
  ensureAuthenticated,
  anamnesisController.getByPatientId
);

anamnesisRoutes.get(
  '/user',
  ensureAuthenticated,
  anamnesisController.getByUserId
);

anamnesisRoutes.put(
  '/sign',
  ensureAuthenticated,
  anamnesisController.signAnamnesis
);

anamnesisRoutes.put(
  '/:anamnesisId',
  ensureAuthenticated,
  anamnesisController.updateAnamnesis
);

anamnesisRoutes.delete(
  '/:anamnesisId',
  ensureAuthenticated,
  anamnesisController.deleteAnamnesis
);

module.exports = { anamnesisRoutes };
