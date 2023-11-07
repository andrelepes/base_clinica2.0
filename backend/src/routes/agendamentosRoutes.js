const ensureAuthenticated = require('../middlewares/ensureAuthenticated.js');

const agendamentosRoutes = require('express').Router();

const db = require('../database/database');

// GET all appointments
agendamentosRoutes.get('/', ensureAuthenticated, (req, res) => {
    db.any('SELECT * FROM agendamentos')
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// GET a specific appointment
agendamentosRoutes.get('/:id', ensureAuthenticated, (req, res) => {
    const agendamentoId = req.params.id;
    db.oneOrNone('SELECT * FROM agendamentos WHERE agendamento_id = $1', [agendamentoId])
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

// POST to create a new appointment
agendamentosRoutes.post('/', ensureAuthenticated, (req, res) => {
    const allowedRoles = ['clinica', 'psicologo', 'psicologo_vinculado', 'secretario_vinculado'];
    if (!allowedRoles.includes(req.user.funcao)) {
        return res.status(403).json({ msg: 'Você não tem permissão para criar um novo agendamento.' });
    }
    const { data_hora_agendamento, paciente_id, usuario_id } = req.body;
    const status_agendamento = 'agendado';
    db.none('INSERT INTO agendamentos (data_hora_agendamento, paciente_id, usuario_id, status_agendamento) VALUES ($1, $2, $3, $4)', [data_hora_agendamento, paciente_id, usuario_id, status_agendamento])
        .then(() => {
            res.json({ message: 'Agendamento adicionado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// PUT to update an appointment
agendamentosRoutes.put('/:id', ensureAuthenticated, (req, res) => {
    const allowedRoles = ['clinica', 'psicologo', 'psicologo_vinculado', 'secretario_vinculado'];
    if (!allowedRoles.includes(req.user.funcao)) {
        return res.status(403).json({ msg: 'Você não tem permissão para atualizar um agendamento.' });
    }
    const agendamentoId = req.params.id;
    const { data_hora_agendamento, paciente_id, usuario_id, status_agendamento } = req.body;

    const query = 'UPDATE agendamentos SET data_hora_agendamento = $1, paciente_id = $2, usuario_id = $3, status_agendamento = $4 WHERE agendamento_id = $5';
    const values = [data_hora_agendamento, paciente_id, usuario_id, status_agendamento || 'agendado', agendamentoId];

    db.none(query, values)
        .then(() => {
            res.json({ message: 'Agendamento atualizado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// DELETE to delete an appointment
agendamentosRoutes.delete('/:id', ensureAuthenticated, (req, res) => {
    const allowedRoles = ['clinica', 'psicologo', 'psicologo_vinculado', 'secretario_vinculado'];
    if (!allowedRoles.includes(req.user.funcao)) {
        return res.status(403).json({ msg: 'Você não tem permissão para excluir um agendamento.' });
    }
    const agendamentoId = req.params.id;
    db.none('DELETE FROM agendamentos WHERE agendamento_id = $1', [agendamentoId])
        .then(() => {
            res.json({ message: 'Agendamento deletado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

module.exports = { agendamentosRoutes };
