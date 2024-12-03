const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');
const clinicMessagesRoutes = require('express').Router();
const ClinicMessagesController = require('../controllers/clinicMessagesController');

const clinicMessagesController = new ClinicMessagesController();

clinicMessagesRoutes.post(
  '/',
  ensureAuthenticated,
  clinicMessagesController.createMessage
);

clinicMessagesRoutes.put(
  '/:messageId',
  ensureAuthenticated,
  clinicMessagesController.updateMessageById
);

clinicMessagesRoutes.get(
  '/clinic',
  ensureAuthenticated,
  clinicMessagesController.getAllMessagesByClinicId
);

clinicMessagesRoutes.get(
  '/',
  ensureAuthenticated,
  clinicMessagesController.getAllMessagesByUserId
);

clinicMessagesRoutes.delete(
  '/:messageId',
  ensureAuthenticated,
  clinicMessagesController.deleteMessageById
);

module.exports = { clinicMessagesRoutes };
