const usuariosRoutes = require('express').Router();
const UserController = require('../controllers/usuariosController'); // Importando o controller

// Rotas
usuariosRoutes.post('/login', UserController.login); // Utilizando a função login do controller
usuariosRoutes.post('/registrar', UserController.register); // Utilizando a função register do controller
usuariosRoutes.post(
  '/solicitar-recuperacao-senha',
  UserController.forgotPassword
); // Utilizando a função forgotPassword do controller
usuariosRoutes.get('/:id', UserController.getUserById); // Utilizando a função getUserById do controller
usuariosRoutes.post(
  '/add-linked-psychologist',
  UserController.addLinkedPsychologist
);
usuariosRoutes.get(
  '/linked-psychologists/:clinicaId',
  UserController.getLinkedPsychologists
);
usuariosRoutes.put('/update-status/:usuario_id', UserController.updateStatus);
usuariosRoutes.post('/add-linked-secretary', UserController.addLinkedSecretary); // Adicionar um secretário vinculado
usuariosRoutes.get(
  '/linked-secretaries/:clinicaId',
  UserController.getLinkedSecretaries
); // Obter secretários vinculados a uma clínica específica

module.exports = { usuariosRoutes };