const Prontuarios = require('../models/Prontuarios');

const addProntuario = async (req, res) => {
    const { paciente_id, psicologo_id, data_hora_agendamento, notas_sessao } = req.body;

    // Verificação de permissão
    if (['psicologo', 'psicologo_vinculado'].includes(req.tipousuario) && req.user !== paciente_id) {
        return res.status(403).json({ msg: 'Permissão negada.' });
    }
    if (['clinica'].includes(req.tipousuario) && req.clinicaId !== paciente_id) {
        return res.status(403).json({ msg: 'Permissão negada.' });
    }

    try {
        await Prontuarios.addProntuario(paciente_id, psicologo_id, data_hora_agendamento, notas_sessao);
        res.json({ message: 'Prontuário adicionado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

const getAllProntuarios = async (req, res) => {
    try {
        const prontuarios = await Prontuarios.getAllProntuarios();
        res.json(prontuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

const getProntuarioById = async (req, res) => {
    const prontuarioId = req.params.id;

    try {
        const prontuario = await Prontuarios.getProntuarioById(prontuarioId);
        res.json(prontuario);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

const getProntuariosByPacienteId = async (req, res) => {
    const pacienteId = req.params.id;

    try {
        const prontuarios = await Prontuarios.getProntuariosByPacienteId(pacienteId);
        res.json(prontuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

const updateProntuario = async (req, res) => {
    const prontuarioId = req.params.id;
    const { paciente_id, psicologo_id, data_hora_agendamento, data_prontuario, notas_sessao } = req.body;

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
    if(data_hora_agendamento !== undefined) {
        updates.push('data_hora_agendamento = $' + (values.length + 1));
        values.push(data_hora_agendamento);
    }
    if(data_prontuario !== undefined) {
        updates.push('data_prontuario = $' + (values.length + 1));
        values.push(data_prontuario);
    }
    if(notas_sessao !== undefined) {
        updates.push('notas_sessao = $' + (values.length + 1));
        values.push(notas_sessao);
    }
    values.push(prontuarioId);

    try {
        if(updates.length > 0) {
            const query = 'UPDATE prontuarios SET ' + updates.join(', ') + ' WHERE prontuario_id = $' + values.length;
            await Prontuarios.updateProntuario(query, values);
            res.json({ message: 'Prontuário atualizado com sucesso!' });
        } else {
            res.json({ message: 'Nenhuma atualização realizada.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};


const concludeProntuario = async (req, res) => {
    const prontuarioId = req.params.id;

    try {
        await Prontuarios.concludeProntuario(prontuarioId);
        res.json({ message: 'Prontuário marcado como concluído!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

const deleteProntuario = async (req, res) => {
    const prontuarioId = req.params.id;

    try {
        const result = await Prontuarios.deleteProntuario(prontuarioId);
        if (result.rowCount === 0) {
            return res.status(404).send({ message: 'Prontuário não encontrado.' });
        }
        res.json({ message: 'Prontuário excluído com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

module.exports = {
    addProntuario,
    getAllProntuarios,
    getProntuarioById,
    getProntuariosByPacienteId,
    updateProntuario,
    concludeProntuario,
    deleteProntuario
};
