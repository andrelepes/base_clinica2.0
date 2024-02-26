const express = require('express');
const agendamentosRoutes = express.Router();
const AgendamentoController = require('../controllers/AgendamentosController'); // Ajuste o caminho conforme necessário

const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

agendamentosRoutes.use(ensureAuthenticated);

// Rota para criar um novo agendamento
agendamentosRoutes.post('/', AgendamentoController.criarAgendamento);

// Rota para listar todos os agendamentos
agendamentosRoutes.get('/', AgendamentoController.listarAgendamentos);

agendamentosRoutes.get('/consultorios', AgendamentoController.getAppointmentsGroupedByOfficeByClinicId);

agendamentosRoutes.get('/pacientes', AgendamentoController.getAppointmentsGroupedByPatientByClinicId);

agendamentosRoutes.get('/meus', AgendamentoController.getAppointmentsByUserId);

agendamentosRoutes.get('/:id', AgendamentoController.obterAgendamentoPorId);

agendamentosRoutes.get('/consultorio/:consultorio_id', AgendamentoController.getAppointmentsByOffice);

agendamentosRoutes.get('/next/:paciente_id', AgendamentoController.getNextAppointment);

// Rota para atualizar um agendamento específico por ID
agendamentosRoutes.put('/:id', AgendamentoController.atualizarAgendamento);

// Rota para deletar um agendamento específico por ID
agendamentosRoutes.delete('/:id', AgendamentoController.deletarAgendamento);

module.exports = { agendamentosRoutes };
