const express = require('express');
const router = express.Router();
const auth = require('../../authMiddleware');
const prontuariosController = require('../controllers/prontuariosController');

router.post('/', auth, prontuariosController.addProntuario);

router.get('/', auth, prontuariosController.getAllProntuarios);

router.get('/:id', auth, prontuariosController.getProntuarioById);

router.get('/pacientes/:pacientes_id/prontuarios', auth, prontuariosController.getProntuariosByPacienteId);

router.put('/:id', auth, prontuariosController.updateProntuario);

router.put('/:id/concluir', auth, prontuariosController.concludeProntuario);

router.delete('/:id', auth, prontuariosController.deleteProntuario);

module.exports = router;
