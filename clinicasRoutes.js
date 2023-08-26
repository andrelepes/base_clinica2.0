const express = require('express');
const router = express.Router();
const db = require('./database');
const auth = require('./authMiddleware'); // Importando o middleware de autenticação

// GET todas as clínicas ativas
router.get('/', auth, (req, res) => {
    db.any('SELECT * FROM clinicas WHERE status = $1', ['ativo'])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// GET uma clínica específica (apenas se estiver ativa)
router.get('/:id', auth, (req, res) => {
    const clinicaId = req.params.id;
    db.one('SELECT * FROM clinicas WHERE id = $1 AND status = $2', [clinicaId, 'ativo'])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// POST para criar uma nova clínica
router.post('/', auth, (req, res) => {
    if (req.user.funcao !== 'responsavelTecnico') {
        return res.status(403).json({ msg: 'Apenas o responsável técnico pode adicionar uma nova clínica' });
    }
    const { nome, endereco, telefone, email, senha } = req.body;

    db.none('INSERT INTO clinicas (nome, endereco, telefone, email, senha) VALUES ($1, $2, $3, $4, $5)', 
            [nome, endereco, telefone, email, senha])
        .then(() => {
            res.json({ message: 'Clínica adicionada com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// PUT para atualizar uma clínica
router.put('/:id', auth, (req, res) => {
    if (req.user.funcao !== 'responsavelTecnico') {
        return res.status(403).json({ msg: 'Apenas o responsável técnico pode atualizar uma clínica' });
    }
    const clinicaId = req.params.id;
    const { nome, endereco, telefone, email, senha } = req.body;
    
    db.none('UPDATE clinicas SET nome = $1, endereco = $2, telefone = $3, email = $4, senha = $5 WHERE id = $6', [nome, endereco, telefone, email, senha, clinicaId])
        .then(() => {
            res.json({ message: 'Clínica atualizada com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// DELETE para marcar uma clínica como inativa
router.delete('/:id', auth, (req, res) => {
    if (req.user.funcao !== 'responsavelTecnico') {
        return res.status(403).json({ msg: 'Apenas o responsável técnico pode inativar uma clínica' });
    }
    const clinicaId = req.params.id;
    
    db.none('UPDATE clinicas SET status = $1 WHERE id = $2', ['inativo', clinicaId])
        .then(() => {
            res.json({ message: 'Clínica marcada como inativa!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

module.exports = router;
