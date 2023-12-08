const express = require('express');
const router = express.Router();
const consultoriosController = require('../controllers/consultoriosController'); // Ajuste o caminho conforme necessário

router.post('/', consultoriosController.inserirConsultorio);

router.get('/', consultoriosController.listarConsultorios);

router.get('/:consultorio_id', consultoriosController.buscarPorId);

router.put('/:consultorio_id', consultoriosController.atualizarConsultorio);

router.delete('/:consultorio_id', consultoriosController.deletarConsultorio);
// Adicione outras rotas conforme necessário

module.exports = router;
