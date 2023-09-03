const express = require('express');
const router = express.Router();
const auth = require('../../authMiddleware');
const clinicasController = require('../controllers/clinicasController');

// GET para obter informações da clínica logada
router.get('/:id', auth, clinicasController.getCurrentClinica);  // Atualizado aqui

// GET para listar psicólogos vinculados a uma clínica
router.get('/:id/linked-psychologists', auth, clinicasController.listLinkedPsychologists);

// GET para listar secretários vinculados a uma clínica
router.get('/:id/linked-secretaries', auth, clinicasController.listLinkedSecretaries);

// POST para adicionar uma nova clínica
router.post('/', auth, clinicasController.addClinica);

// PUT para atualizar uma clínica
router.put('/:id', auth, clinicasController.updateClinica);

// DELETE para remover uma clínica
router.delete('/:id', auth, clinicasController.deleteClinica);

// POST para adicionar um psicólogo vinculado
router.post('/:id/add-linked-psychologist', auth, clinicasController.addLinkedPsychologist);

// POST para adicionar um secretário vinculado
router.post('/:id/add-linked-secretary', auth, clinicasController.addLinkedSecretary);

module.exports = router;

