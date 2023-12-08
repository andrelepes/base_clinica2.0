const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/AgendamentosController'); // Ajuste o caminho conforme necessário

// Rota para criar um novo agendamento
router.post('/', AgendamentoController.criarAgendamento);

// Rota para listar todos os agendamentos
router.get('/', AgendamentoController.listarAgendamentos);

// Rota para obter um agendamento específico por ID
router.get('/:id', AgendamentoController.obterAgendamentoPorId);

// Rota para atualizar um agendamento específico por ID
router.put('/:id', AgendamentoController.atualizarAgendamento);

// Rota para deletar um agendamento específico por ID
router.delete('/:id', AgendamentoController.deletarAgendamento);


module.exports = router;
