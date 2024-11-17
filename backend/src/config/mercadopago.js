const { MercadoPagoConfig } = require('mercadopago');

const mercadoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

module.exports = { mercadoClient };
