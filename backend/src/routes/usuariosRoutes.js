const usuariosRoutes = require('express').Router();
const UserController = require('../controllers/usuariosController'); // Importando o controller
const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

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
usuariosRoutes.get(
  '/first-access/:firstAccessToken',
  UserController.getFirstAccessInfo
);
usuariosRoutes.post(
  '/first-access/:firstAccessToken',
  UserController.createFromFirstAccess
);

usuariosRoutes.get(
  '/psychologists/from/clinic',
  ensureAuthenticated,
  UserController.getAllPsychologistsFromClinic
);

usuariosRoutes.put(
  '/update/:usuario_id',
  ensureAuthenticated,
  UserController.updateUserByUserId
);
module.exports = { usuariosRoutes };
