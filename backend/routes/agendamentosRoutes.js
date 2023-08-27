const express = require('express');
const router = express.Router();
const db = require('./database');
const auth = require('./authMiddleware');

// GET todos os agendamentos
router.get('/', auth, (req, res) => {
    db.any('SELECT * FROM agendamentos')
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// GET um agendamento específico
router.get('/:id', auth, (req, res) => {
    const agendamentoId = req.params.id;
    db.oneOrNone('SELECT * FROM agendamentos WHERE id = $1', [agendamentoId])
        .then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: 'Agendamento não encontrado.' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// POST para criar um novo agendamento
router.post('/', auth, (req, res) => {
    if (req.user.funcao !== 'psicologo') {
        return res.status(403).json({ msg: 'Apenas psicólogos podem criar um novo agendamento.' });
    }
    const { data_hora, paciente_id, psicologo_id } = req.body;
    const status = "agendado";
    db.none('INSERT INTO agendamentos (data_hora, paciente_id, psicologo_id, status) VALUES ($1, $2, $3, $4)', [data_hora, paciente_id, psicologo_id, status])
        .then(() => {
            res.json({ message: 'Agendamento adicionado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// PUT para atualizar um agendamento
router.put('/:id', auth, (req, res) => {
    if (req.user.funcao !== 'psicologo') {
        return res.status(403).json({ msg: 'Apenas psicólogos podem atualizar um agendamento.' });
    }
    const agendamentoId = req.params.id;
    const { data_hora, paciente_id, psicologo_id, status } = req.body;

    const query = 'UPDATE agendamentos SET data_hora = $1, paciente_id = $2, psicologo_id = $3, status = $4 WHERE id = $5';
    const values = [data_hora, paciente_id, psicologo_id, status || 'agendado', agendamentoId];

    db.none(query, values)
        .then(() => {
            res.json({ message: 'Agendamento atualizado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// DELETE para excluir um agendamento
router.delete('/:id', auth, (req, res) => {
    if (req.user.funcao !== 'psicologo') {
        return res.status(403).json({ msg: 'Apenas psicólogos podem excluir um agendamento.' });
    }
    const agendamentoId = req.params.id;
    db.none('DELETE FROM agendamentos WHERE id = $1', [agendamentoId])
        .then(() => {
            res.json({ message: 'Agendamento deletado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

module.exports = router;
