const express = require('express');
const router = express.Router();
const DisponibilidadePsicologosController = require('../controllers/DisponibilidadePsicologosController'); // Ajuste o caminho conforme necessário

// Rota para criar nova disponibilidade
router.post('/', DisponibilidadePsicologosController.criarDisponibilidade);

// Rota para listar disponibilidades
router.get('/disponibilidade', DisponibilidadePsicologosController.listarDisponibilidades);


// Aqui, você pode adicionar mais rotas conforme necessário

module.exports = router;
