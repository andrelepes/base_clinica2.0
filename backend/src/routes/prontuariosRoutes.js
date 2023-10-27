const express = require('express');
const router = express.Router();
const auth = require('../../authMiddleware');
const prontuariosController = require('../controllers/prontuariosController');

router.post('/', auth, prontuariosController.addProntuario);

router.get('/:pacientes_id/prontuarios', auth, prontuariosController.getProntuariosByPacienteId);

router.put('/:pacientes_id/prontuarios/:prontuario_id', auth, prontuariosController.updateProntuarioById);

router.delete('/prontuarios/:prontuario_id', auth, prontuariosController.deleteProntuario);

module.exports = router;
