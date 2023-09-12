const express = require('express');
const router = express.Router();
const db = require('../../database');
const auth = require('../../authMiddleware');

// GET todos os psicólogos vinculados a uma clínica
router.get('/', auth, (req, res) => {
    db.any('SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = \'psicologo_vinculado\'', [req.clinicaId])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: error });
        });
});

// GET um psicólogo específico vinculado a uma clínica
router.get('/:id', auth, (req, res) => {
    const psicologoId = req.params.id;
    db.one('SELECT * FROM usuarios WHERE usuario_id = $1 AND clinica_id = $2 AND tipousuario = \'psicologo_vinculado\'', [psicologoId, req.clinicaId])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: error });
        });
});

// POST para criar um novo psicólogo vinculado a uma clínica
router.post('/', auth, (req, res) => {
    const { nome_usuario, email_usuario } = req.body;
    db.none('INSERT INTO usuarios (nome_usuario, email_usuario, clinica_id, tipousuario) VALUES ($1, $2, $3, \'psicologo_vinculado\')', 
            [nome_usuario, email_usuario, req.clinicaId])
        .then(() => {
            res.json({ mensagem: 'Psicólogo vinculado adicionado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: error });
        });
});

module.exports = router;