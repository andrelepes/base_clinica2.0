const express = require('express');
const router = express.Router();
const db = require('../../database');
const pacientesController = require('../controllers/pacientesController');
const auth = require('../../authMiddleware');

// Middleware de autenticação
router.use(auth);

// Rota para filtrar pacientes
router.get('/filtrar', pacientesController.filtrarPacientes);

// Rota para listar todos os pacientes
router.get('/', pacientesController.listarPacientes);

// Rota para listar todos os pacientes
router.get('/paginados', pacientesController.listarPacientesPaginados);

// Rota para obter informações de um paciente específico
router.get('/:paciente_id', pacientesController.obterPaciente);

// Rota para criar um novo paciente
router.post('/', pacientesController.criarPaciente);

// Rota para atualizar informações de um paciente
router.put('/:paciente_id', pacientesController.atualizarPaciente);

// Rota para atualizar um paciente como inativo
router.put('/:paciente_id/inativo', pacientesController.marcarComoInativo);

// Rota para reativar um paciente
router.put('/:paciente_id/ativo', pacientesController.marcarComoAtivo);

module.exports = router;
