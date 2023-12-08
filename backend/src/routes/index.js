const { pacientesRoutes } = require('./pacientesRoutes.js');
const { usuariosRoutes } = require('./usuariosRoutes.js');
const { clinicasRoutes } = require('./clinicasRoutes.js');
const { autorizacoesRoutes } = require('./autorizacoesRoutes.js');
const { prontuariosRoutes } = require('./prontuariosRoutes.js');
const { cursosRoutes } = require('./cursosRoutes.js');
const { agendamentosRoutes } = require('./agendamentosRoutes.js');
const { consultoriosRoutes } = require('./consultoriosRoutes.js');
const { disponibilidadeRoutes } = require('./disponibilidadeRoutes.js');

const router = require('express').Router();

router.use('/pacientes', pacientesRoutes);
router.use('/usuarios', usuariosRoutes); // Sem middleware de autenticação
router.use('/clinicas', clinicasRoutes);
router.use('/autorizacoes', autorizacoesRoutes);
router.use('/prontuarios', prontuariosRoutes);
router.use('/agendamentos', agendamentosRoutes);
router.use('/cursos', cursosRoutes);
router.use('/consultorios', consultoriosRoutes);
router.use('/disponibilidade', disponibilidadeRoutes);

module.exports = { router };
