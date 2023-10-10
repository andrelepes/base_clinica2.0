const db = require('../../database');

exports.concederAutorizacao = async (clinica_id, usuario_id, paciente_id) => {
    return await db.none(
        'INSERT INTO autorizacoes (clinica_id, usuario_id, paciente_id, status) VALUES ($1, $2, $3, $4)',
        [clinica_id, usuario_id, paciente_id, 'concedido']
    );
};

exports.retirarAutorizacao = async (clinica_id, usuario_id, paciente_id) => {
    return await db.none(
        'UPDATE autorizacoes SET status = $1 WHERE clinica_id = $2 AND usuario_id = $3 AND paciente_id = $4',
        ['retirado', clinica_id, usuario_id, paciente_id]
    );
};

exports.listarAutorizados = async (paciente_id) => {
    return await db.manyOrNone(
        `SELECT u.usuario_id, u.nome_usuario 
         FROM autorizacoes a
         JOIN usuarios u ON a.usuario_id = u.usuario_id
         WHERE a.paciente_id = $1 AND a.status = $2`,
        [paciente_id, 'concedido']
    );
};
