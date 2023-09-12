const express = require('express');
const router = express.Router();
const db = require('../../database');
const auth = require('../../authMiddleware');

// Middleware de autenticação
router.use(auth);

// GET todos os pacientes ativos
router.get('/', (req, res) => {
    db.any('SELECT * FROM pacientes WHERE status_paciente = $1 AND clinica_id = $2', ['ativo', req.clinicaId])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: 'Erro interno do servidor.' });
        });
});

// GET um paciente específico (apenas se estiver ativo)
router.get('/:id', (req, res) => {
    const pacienteId = req.params.id;
    db.one('SELECT * FROM pacientes WHERE paciente_id = $1 AND status_paciente = $2 AND clinica_id = $3', [pacienteId, 'ativo', req.clinicaId])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: 'Erro interno do servidor.' });
        });
});

// POST para criar um novo paciente
router.post('/', (req, res) => {
    const { nome_paciente, email_paciente, data_nascimento_paciente, telefone_paciente, cpf_paciente, cep_paciente, endereco_paciente } = req.body;
    db.oneOrNone('SELECT * FROM pacientes WHERE cpf_paciente = $1 AND clinica_id = $2', [cpf_paciente, req.clinicaId])
        .then(data => {
            if (data) {
                return res.status(409).json({ erro: 'Um paciente com esse CPF já existe!' });
            } else {
                return db.none('INSERT INTO pacientes (nome_paciente, email_paciente, data_nascimento_paciente, telefone_paciente, cpf_paciente, cep_paciente, endereco_paciente, clinica_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
                        [nome_paciente, email_paciente, data_nascimento_paciente, telefone_paciente, cpf_paciente, cep_paciente, endereco_paciente, req.clinicaId])
                        .then(() => {
                            res.json({ mensagem: 'Paciente adicionado com sucesso!' });
                        });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: 'Erro interno do servidor.' });
        });
});

// PUT para atualizar um paciente
router.put('/:id', (req, res) => {
    const pacienteId = req.params.id;
    const { nome_paciente, email_paciente, data_nascimento_paciente, telefone_paciente, cpf_paciente, cep_paciente, endereco_paciente } = req.body;
    db.none('UPDATE pacientes SET nome_paciente = $1, email_paciente = $2, data_nascimento_paciente = $3, telefone_paciente = $4, cpf_paciente = $5, cep_paciente = $6, endereco_paciente = $7 WHERE paciente_id = $8 AND clinica_id = $9', [nome_paciente, email_paciente, data_nascimento_paciente, telefone_paciente, cpf_paciente, cep_paciente, endereco_paciente, pacienteId, req.clinicaId])
        .then(() => {
            res.json({ mensagem: 'Paciente atualizado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: 'Erro interno do servidor.' });
        });
});

// DELETE para marcar um paciente como inativo
router.delete('/:id', (req, res) => {
    const pacienteId = req.params.id;
    db.none('UPDATE pacientes SET status_paciente = $1 WHERE paciente_id = $2 AND clinica_id = $3', ['inativo', pacienteId, req.clinicaId])
        .then(() => {
            res.json({ mensagem: 'Paciente marcado como inativo!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ erro: 'Erro interno do servidor.' });
        });
});

module.exports = router;
