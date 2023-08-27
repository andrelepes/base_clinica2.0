const express = require('express');
const router = express.Router();
const db = require('./database');
const auth = require('./authMiddleware'); // Importando o middleware de autenticação

// GET todos os pacientes ativos
router.get('/', (req, res) => {
    db.any('SELECT * FROM pacientes WHERE status = $1', ['ativo'])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// GET um paciente específico (apenas se estiver ativo)
router.get('/:id', (req, res) => {
    const pacienteId = req.params.id;
    db.one('SELECT * FROM pacientes WHERE id = $1 AND status = $2', [pacienteId, 'ativo'])
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// POST para criar um novo paciente
router.post('/', (req, res) => {
    if (!['psicologo', 'responsavelTecnico'].includes(req.user.funcao)) {
        return res.status(403).json({ msg: 'Apenas psicólogos ou responsável técnico podem adicionar um novo paciente' });
    }
    const { cpf, nome, data_nascimento, telefone, email, cep, endereco } = req.body;

    // Primeiro, verificamos se o CPF já existe
    db.oneOrNone('SELECT * FROM pacientes WHERE cpf = $1', [cpf])
        .then(data => {
            if (data) {
                // Se o CPF já existir, enviamos um erro
                console.log('CPF já existe na base de dados.');
                return res.status(409).json({ error: 'Um paciente com esse CPF já existe!' });
            } else {
                // Se o CPF não existir, inserimos o novo paciente
                console.log('Inserindo novo paciente...');
                return db.none('INSERT INTO pacientes (cpf, nome, data_nascimento, telefone, email, cep, endereco) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
                        [cpf, nome, data_nascimento, telefone, email, cep, endereco])
                        .then(() => {
                            console.log('Paciente inserido com sucesso.');
                            res.json({ message: 'Paciente adicionado com sucesso!' });
                        });
            }
        })
        .catch(error => {
            console.log('Erro ao inserir paciente:', error);
            res.status(500).json({ error: 'Erro interno. Por favor, tente novamente mais tarde.' });
        });
});

// PUT para atualizar um paciente
router.put('/:id', (req, res) => {
    if (!['psicologo', 'responsavelTecnico'].includes(req.user.funcao)) {
        return res.status(403).json({ msg: 'Apenas psicólogos ou responsável técnico podem atualizar um paciente' });
    }
    const pacienteId = req.params.id;
    const { cpf, nome, data_nascimento, telefone, email, cep, endereco } = req.body;
    
    db.none('UPDATE pacientes SET cpf = $1, nome = $2, data_nascimento = $3, telefone = $4, email = $5, cep = $6, endereco = $7 WHERE id = $8', [cpf, nome, data_nascimento, telefone, email, cep, endereco, pacienteId])
        .then(() => {
            res.json({ message: 'Paciente atualizado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// DELETE para marcar um paciente como inativo
router.delete('/:id', (req, res) => {
    if (!['psicologo', 'responsavelTecnico'].includes(req.user.funcao)) {
        return res.status(403).json({ msg: 'Apenas psicólogos ou responsável técnico podem inativar um paciente' });
    }
    const pacienteId = req.params.id;
    
    db.none('UPDATE pacientes SET status = $1 WHERE id = $2', ['inativo', pacienteId])
        .then(() => {
            res.json({ message: 'Paciente marcado como inativo!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

module.exports = router;
