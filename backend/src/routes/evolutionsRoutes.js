const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');
const evolutionsRoutes = require('express').Router();
const EvolutionsController = require('../controllers/evolutionsController');
const multer = require('multer');
const path = require('path');

const uploadConfig = require('../config/upload');

const uploadPath = path.resolve('uploads', 'evolutions', 'archive');

const uploadArchive = multer(uploadConfig.upload(uploadPath));

const evolutionsController = new EvolutionsController();

evolutionsRoutes.post(
  '/paciente/:patientId',
  ensureAuthenticated,
  evolutionsController.createEvolutionForUserIdAndPatientId
);

evolutionsRoutes.put(
  '/sign',
  ensureAuthenticated,
  evolutionsController.signEvolution
);

evolutionsRoutes.get(
  '/reports/pdf/:evolution_id',
  ensureAuthenticated,
  evolutionsController.generateEvolutionPDF
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
  '/archive/:archive_id',
  ensureAuthenticated,
  evolutionsController.getEvolutionArchiveById
);

evolutionsRoutes.get(
  '/:evolutionId',
  ensureAuthenticated,
  evolutionsController.getEvolutionByIdAndUserId
);

evolutionsRoutes.put(
  '/archive/:evolutionId',
  ensureAuthenticated,
  uploadArchive.single('archive'),
  evolutionsController.uploadArchive
);

evolutionsRoutes.put(
  '/:evolutionId',
  ensureAuthenticated,
  evolutionsController.updateEvolutionByIdAndUserId
);

evolutionsRoutes.delete(
  '/archive/:archiveId',
  ensureAuthenticated,
  evolutionsController.deleteEvolutionArchiveById
);

evolutionsRoutes.delete(
  '/:evolutionId',
  ensureAuthenticated,
  evolutionsController.deleteEvolutionByIdAndUserId
);

module.exports = { evolutionsRoutes };
