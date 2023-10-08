const db = require('../../database');

const addProntuario = async (paciente_id, psicologo_id, data_hora_agendamento, notas_sessao) => {
    return await db.none(
        'INSERT INTO prontuarios (paciente_id, psicologo_id, data_hora_agendamento, notas_sessao) VALUES ($1, $2, $3, $4)',
        [paciente_id, psicologo_id, data_hora_agendamento, notas_sessao]
    );
};

const getAllProntuarios = async () => {
    return await db.manyOrNone('SELECT * FROM prontuarios WHERE status_prontuario != $1', ['concluído']);
};

const getProntuarioById = async (prontuarioId) => {
    return await db.one('SELECT * FROM prontuarios WHERE prontuario_id = $1', [prontuarioId]);
};

const getProntuariosByPacienteId = async (pacienteId) => {
    return await db.manyOrNone('SELECT * FROM prontuarios WHERE paciente_id = $1', [pacienteId]);
};

const updateProntuario = async (query, values) => {
    return await db.none(query, values);
};

const concludeProntuario = async (prontuarioId) => {
    return await db.none(
        'UPDATE prontuarios SET status_prontuario = $1 WHERE prontuario_id = $2',
        ['concluído', prontuarioId]
    );
};

const deleteProntuario = async (prontuarioId) => {
    return await db.result('DELETE FROM prontuarios WHERE prontuario_id = $1', [prontuarioId]);
};

module.exports = {
    addProntuario,
    getAllProntuarios,
    getProntuarioById,
    getProntuariosByPacienteId,
    updateProntuario,
    concludeProntuario,
    deleteProntuario,
    updateProntuario
};