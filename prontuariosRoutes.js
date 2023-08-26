const express = require('express');
const router = express.Router();
const db = require('./database');
const auth = require('./authMiddleware'); // Importe o middleware de autenticação

router.post('/', auth, async (req, res) => {
    const { paciente_id, psicologo_id, data, notas_sessao } = req.body;

    try {
        await db.none(
            'INSERT INTO prontuarios (paciente_id, psicologo_id, data, notas_sessao) VALUES ($1, $2, $3, $4)',
            [paciente_id, psicologo_id, data, notas_sessao]
        );
        res.json({ message: 'Prontuário adicionado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

router.get('/', auth, async (req, res) => { 
    try {
        const prontuarios = await db.manyOrNone('SELECT * FROM prontuarios WHERE status != $1', ['concluído']);
        res.json(prontuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

router.get('/:id', auth, async (req, res) => {
    const prontuarioId = req.params.id;

    try {
        const prontuario = await db.one('SELECT * FROM prontuarios WHERE id = $1', [prontuarioId]);
        res.json(prontuario);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

router.get('/pacientes/:id/prontuarios', auth, async (req, res) => {
    const pacienteId = req.params.id;

    try {
        const prontuarios = await db.manyOrNone('SELECT * FROM prontuarios WHERE paciente_id = $1', [pacienteId]);
        res.json(prontuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

router.put('/:id', auth, async (req, res) => {
    const prontuarioId = req.params.id;
    const { paciente_id, psicologo_id, data, notas_sessao } = req.body;

    // Criar lista de atualizações com base nos dados enviados
    let updates = [];
    let values = [];
    if(paciente_id !== undefined) {
        updates.push('paciente_id = $' + (values.length + 1));
        values.push(paciente_id);
    }
    if(psicologo_id !== undefined) {
        updates.push('psicologo_id = $' + (values.length + 1));
        values.push(psicologo_id);
    }
    if(data !== undefined) {
        updates.push('data = $' + (values.length + 1));
        values.push(data);
    }
    if(notas_sessao !== undefined) {
        updates.push('notas_sessao = $' + (values.length + 1));
        values.push(notas_sessao);
    }
    values.push(prontuarioId);

    try {
        if(updates.length > 0) {
            const query = 'UPDATE prontuarios SET ' + updates.join(', ') + ' WHERE id = $' + values.length;
            await db.none(query, values);
            res.json({ message: 'Prontuário atualizado com sucesso!' });
        } else {
            res.json({ message: 'Nenhuma atualização realizada.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

router.put('/:id/concluir', auth, async (req, res) => {
    const prontuarioId = req.params.id;

    try {
        await db.none(
            'UPDATE prontuarios SET status = $1 WHERE id = $2',
            ['concluído', prontuarioId]
        );
        res.json({ message: 'Prontuário marcado como concluído!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

router.delete('/:id', auth, async (req, res) => {
    const prontuarioId = req.params.id;

    try {
        const result = await db.result('DELETE FROM prontuarios WHERE id = $1', [prontuarioId]);
        if (result.rowCount === 0) {
            return res.status(404).send({ message: 'Prontuário não encontrado.' });
        }
        res.json({ message: 'Prontuário excluído com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
