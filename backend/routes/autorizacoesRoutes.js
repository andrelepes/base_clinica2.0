const express = require('express');
const router = express.Router();
const auth = require('../../authMiddleware');
const autorizacoesController = require('../controllers/autorizacoesController');

// Rota para conceder autorização
router.post('/autorizar', auth, autorizacoesController.concederAutorizacao);

// Rota para retirar autorização
router.delete('/retirarAutorizacao/:clinica_id/:usuario_id/:paciente_id', auth, autorizacoesController.retirarAutorizacao);

// Rota para listar psicólogos autorizados para um paciente específico
router.get('/autorizados/:paciente_id', auth, autorizacoesController.listarAutorizados);

module.exports = router;
