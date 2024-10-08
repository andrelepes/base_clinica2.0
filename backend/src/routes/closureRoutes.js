const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const closureRoutes = require('express').Router();
const ClosureController = require('../controllers/closureController');

const closureController = new ClosureController();

closureRoutes.post(
  '/',
  ensureAuthenticated,
  closureController.createClosure
);

closureRoutes.get(
  '/reports/pdf/:closure_id',
  ensureAuthenticated,
  closureController.generateClosurePDF
);

closureRoutes.get(
  '/patient/:patientId',
  ensureAuthenticated,
  closureController.getByPatientId
);

closureRoutes.get(
  '/user',
  ensureAuthenticated,
  closureController.getByUserId
);

closureRoutes.put(
  '/sign',
  ensureAuthenticated,
  closureController.signClosure
);

closureRoutes.put(
  '/:closureId',
  ensureAuthenticated,
  closureController.updateClosure
);

closureRoutes.delete(
  '/:closureId',
  ensureAuthenticated,
  closureController.deleteClosure
);

module.exports = { closureRoutes };
