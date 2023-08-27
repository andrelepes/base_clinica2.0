const express = require('express');
const router = express.Router();
const db = require('./database');
const { check, validationResult } = require('express-validator');
const moment = require('moment'); 

// GET para obter todos os cursos
router.get('/', (req, res) => {
    console.log("Acessando todos os cursos");
    db.any('SELECT * FROM cursos')
        .then(cursos => {
            res.json(cursos);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

router.get('/data', (req, res) => {
    console.log("Filtrando cursos por data");
    const { dataInicio, dataFim } = req.query;
    db.any('SELECT * FROM cursos WHERE data_conclusao BETWEEN $1 AND $2', [dataInicio, dataFim])
        .then(cursos => {
            res.json(cursos);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

router.get('/horas', (req, res) => {
    console.log("Filtrando cursos por horas");
    const { minHoras, maxHoras } = req.query;
    db.any('SELECT * FROM cursos WHERE horas_curso BETWEEN $1 AND $2', [minHoras, maxHoras])
        .then(cursos => {
            res.json(cursos);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

router.get('/busca', (req, res) => {
    console.log("Buscando cursos por termo");
    const { termo } = req.query;
    db.any('SELECT * FROM cursos WHERE titulo ILIKE $1 OR descricao ILIKE $1', [`%${termo}%`])
        .then(cursos => {
            res.json(cursos);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// POST para criar um novo curso com validação
router.post('/', [
    check('titulo').isString().withMessage('Título deve ser uma string').notEmpty().withMessage('Título é obrigatório'),
    check('descricao').isString().withMessage('Descrição deve ser uma string'),
    check('data_conclusao').custom(value => {
        return moment(value, ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'], true).isValid(); 
    }).withMessage('Data de conclusão deve ser uma data válida'),
    check('horas_curso').isInt({ min: 1 }).withMessage('Horas do curso deve ser um número inteiro maior que 0')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { titulo, descricao, data_conclusao, horas_curso } = req.body;
    db.none('INSERT INTO cursos(titulo, descricao, data_conclusao, horas_curso) VALUES($1, $2, $3, $4)', [titulo, descricao, data_conclusao, horas_curso])
        .then(() => {
            res.json({ message: 'Curso adicionado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// PUT para atualizar um curso existente
router.put('/:id', [
    check('titulo').isString().withMessage('Título deve ser uma string').notEmpty().withMessage('Título é obrigatório'),
    check('descricao').isString().withMessage('Descrição deve ser uma string'),
    check('data_conclusao').custom(value => {
        console.log("Data fornecida:", value); // Mantendo o log para diagnóstico
        return moment(value, ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY', moment.ISO_8601], true).isValid();
    }).withMessage('Data de conclusão deve ser uma data válida'),    
    check('horas_curso').isInt({ min: 1 }).withMessage('Horas do curso deve ser um número inteiro maior que 0')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const cursoId = req.params.id;
    const { titulo, descricao, data_conclusao, horas_curso } = req.body;

    db.none('UPDATE cursos SET titulo = $1, descricao = $2, data_conclusao = $3, horas_curso = $4 WHERE id = $5', [titulo, descricao, data_conclusao, horas_curso, cursoId])
        .then(() => {
            res.json({ message: 'Curso atualizado com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// DELETE para excluir um curso pelo ID
router.delete('/:id', (req, res) => {
    const cursoId = req.params.id;
    db.none('DELETE FROM cursos WHERE id = $1', [cursoId])
        .then(() => {
            res.json({ message: 'Curso excluído com sucesso!' });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
});

// Exportando o router no final do arquivo
module.exports = router;
