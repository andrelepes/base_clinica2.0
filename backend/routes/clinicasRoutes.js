const express = require('express');
const router = express.Router();
const db = require('../../database');
const auth = require('../../authMiddleware');
const clinicasController = require('../controllers/clinicasController');

// GET para listar todas as clínicas
router.get('/', auth, clinicasController.listClinicas);

// POST para adicionar uma nova clínica
router.post('/', clinicasController.addClinica);

// PUT para atualizar uma clínica
router.put('/:id', auth, clinicasController.updateClinica);

// DELETE para remover uma clínica
router.delete('/:id', auth, clinicasController.deleteClinica);

// POST para adicionar um psicólogo vinculado
router.post('/add-linked-psychologist', auth, clinicasController.addVinculados);

// POST para adicionar um secretário vinculado
router.post('/add-linked-secretary', auth, clinicasController.addVinculados);

module.exports = router;