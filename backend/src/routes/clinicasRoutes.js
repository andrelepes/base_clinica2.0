const express = require('express');
const router = express.Router();
const auth = require('../../authMiddleware');
const clinicasController = require('../controllers/clinicasController');

// GET e POST para listar psicólogos vinculados a uma clínica
router.get('/:id/linked-psychologists', auth, clinicasController.listLinkedPsychologists);

// GET para listar secretários vinculados a uma clínica
router.get('/:id/linked-secretaries', auth, clinicasController.listLinkedSecretaries);

module.exports = router;