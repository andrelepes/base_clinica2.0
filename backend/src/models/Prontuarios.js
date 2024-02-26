const db = require('../database/database');

const addProntuario = async (paciente_id, usuario_id, data_hora_agendamento, notas_sessao) => {
    return await db.none(
        'INSERT INTO prontuarios (paciente_id, usuario_id, data_hora_agendamento, notas_sessao) VALUES ($1, $2, $3, $4)',
        [paciente_id, usuario_id, data_hora_agendamento, notas_sessao]
    );
};

const isPacienteAssociatedToPsicologo = async (paciente_id, usuario_id) => {
    const result = await db.oneOrNone(
        'SELECT COUNT(*) FROM pacientes WHERE paciente_id = $1 AND usuario_id = $2',
        [paciente_id, usuario_id]
    );
    return parseInt(result.count) === 1;
};
const isPacienteAssociatedToClinica = async (paciente_id, clinica_id) => {
    const result = await db.oneOrNone(
        'SELECT COUNT(*) FROM pacientes WHERE paciente_id = $1 AND clinica_id = $2',
        [paciente_id, clinica_id]
    );
    return parseInt(result.count) === 1;
};

const getProntuariosByPacienteId = async (pacienteId) => {
    return await db.manyOrNone('SELECT * FROM prontuarios WHERE paciente_id = $1', [pacienteId]);
}

const getPacienteById = async (pacienteId) => {
    return await db.oneOrNone('SELECT * FROM pacientes WHERE paciente_id = $1', [pacienteId]);
};

const updateProntuarioDetails = async (prontuarioId, data_hora_agendamento, notas_sessao) => {
    return await db.none(
        'UPDATE prontuarios SET data_hora_agendamento = $1, notas_sessao = $2 WHERE prontuario_id = $3',
        [data_hora_agendamento, notas_sessao, prontuarioId]
    );
};
const getProntuarioById = async (prontuarioId) => {
    return await db.oneOrNone('SELECT * FROM prontuarios WHERE prontuario_id = $1', [prontuarioId]);
};

async function deleteProntuarioById(prontuarioId, userId) {
    try {
        const result = await db.query(
            'DELETE FROM prontuarios WHERE prontuario_id = $1 AND usuario_id = $2',
            [prontuarioId, userId]
        );
        return result.rowCount;  // Retorna o número de linhas afetadas.
    } catch (error) {
        console.error('Error deleting prontuario:', error);
        throw error;
    }
}


module.exports = {
    isPacienteAssociatedToPsicologo,
    getPacienteById,
    updateProntuarioDetails,
    deleteProntuarioById,
    addProntuario,
    getProntuariosByPacienteId,
    isPacienteAssociatedToClinica,
    getProntuarioById
};
