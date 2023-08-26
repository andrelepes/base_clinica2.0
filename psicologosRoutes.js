const express = require('express');
const router = express.Router();
const db = require('./database');
const auth = require('./authMiddleware');

// GET todos os psicólogos
router.get('/', auth, (req, res) => {
    db.any('SELECT * FROM psicologos WHERE clinica_id = $1', [req.user.clinica_id])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// GET um psicólogo específico
router.get('/:id', auth, (req, res) => {
    const psicologoId = req.params.id;
    if (req.user.funcao !== 'responsavelTecnico' && req.user.id !== psicologoId) {
        return res.status(403).json({ msg: 'Acesso negado' });
    }
    db.one('SELECT * FROM psicologos WHERE id = $1 AND clinica_id = $2', [psicologoId, req.user.clinica_id])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// POST para criar um novo psicólogo
router.post('/', auth, (req, res) => {
    if (req.user.funcao !== 'responsavelTecnico') {
        return res.status(403).json({ msg: 'Apenas o responsável técnico pode adicionar um novo psicólogo' });
    }
    const { nome, cpf, crp, telefone, email } = req.body;
    db.none('INSERT INTO psicologos (nome, cpf, crp, telefone, email, clinica_id) VALUES ($1, $2, $3, $4, $5, $6)', 
            [nome, cpf, crp, telefone, email, req.user.clinica_id])
        .then(() => {
            res.json({ message: 'Psicólogo adicionado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// PUT para atualizar um psicólogo
router.put('/:id', auth, (req, res) => {
    const psicologoId = req.params.id;
    if (req.user.funcao !== 'responsavelTecnico' && req.user.id !== psicologoId) {
        return res.status(403).json({ msg: 'Acesso negado' });
    }
    const { nome, cpf, crp, telefone, email } = req.body;
    db.none('UPDATE psicologos SET nome = $1, cpf = $2, crp = $3, telefone = $4, email = $5 WHERE id = $6 AND clinica_id = $7', 
           [nome, cpf, crp, telefone, email, psicologoId, req.user.clinica_id])
        .then(() => {
            res.json({ message: 'Psicólogo atualizado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// DELETE para marcar um psicólogo como inativo
router.delete('/:id', auth, (req, res) => {
    if (req.user.funcao !== 'responsavelTecnico') {
        return res.status(403).json({ msg: 'Apenas o responsável técnico pode inativar um psicólogo' });
    }
    const psicologoId = req.params.id;
    db.none('UPDATE psicologos SET status = $1 WHERE id = $2 AND clinica_id = $3', ['inativo', psicologoId, req.user.clinica_id])
        .then(() => {
            res.json({ message: 'Psicólogo marcado como inativo!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

module.exports = router;
