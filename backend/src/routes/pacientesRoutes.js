const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

const pacientesRoutes = require('express').Router();
const pacientesController = require('../controllers/pacientesController');

pacientesRoutes.use(ensureAuthenticated);

// Rota para filtrar pacientes
pacientesRoutes.get('/filtrar', pacientesController.filtrarPacientes);

// Rota para listar todos os pacientes
pacientesRoutes.get('/', pacientesController.listarPacientes);

// Rota para listar todos os pacientes
pacientesRoutes.get('/paginados', pacientesController.listarPacientesPaginados);

// Rota para obter informações de um paciente específico
pacientesRoutes.get('/:paciente_id', pacientesController.obterPaciente);

// Rota para criar um novo paciente
pacientesRoutes.post('/', pacientesController.criarPaciente);

// Rota para atualizar informações de um paciente
pacientesRoutes.put('/:paciente_id', pacientesController.atualizarPaciente);

// Rota para atualizar um paciente como inativo
pacientesRoutes.put(
  '/:paciente_id/inativo',
  pacientesController.marcarComoInativo
);

// Rota para reativar um paciente
pacientesRoutes.put('/:paciente_id/ativo', pacientesController.marcarComoAtivo);

module.exports = { pacientesRoutes };
