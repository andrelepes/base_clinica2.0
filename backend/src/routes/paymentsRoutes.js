const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const paymentsRoutes = require('express').Router();
const PaymentsController = require('../controllers/paymentsController');

const paymentsController = new PaymentsController();

paymentsRoutes.get(
  '/paywithpix/:patient_id',
  ensureAuthenticated,
  paymentsController.createPayment
);

paymentsRoutes.get(
  '/getallpayments/',
  ensureAuthenticated,
  paymentsController.searchPayments
);
paymentsRoutes.get(
  '/getallpayments/year',
  ensureAuthenticated,
  paymentsController.searchPaymentsByYear
);

module.exports = { paymentsRoutes };
