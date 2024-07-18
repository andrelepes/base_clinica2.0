const db = require('../database/database');

const Clinica = {
    listLinkedPsychologists: (clinicaId) => {
        const query = `
            SELECT 
                u.usuario_id,
                u.nome_usuario,
                u.email_usuario,
                u.email_auxiliar,
                u.status_usuario,
                u.tipousuario,
                u.clinica_id,
                COALESCE(
                    json_agg(
                    json_build_object(
                        'paciente_id', a.paciente_id,
                        'nome_paciente', p.nome_paciente,
                        'status', a.status
                    )
                    ) FILTER (WHERE a.paciente_id IS NOT NULL AND a.status = 'ativo'), 
                    '[]'
                ) AS pacientes_autorizados
            FROM 
                usuarios u
            LEFT JOIN 
                autorizacoes a 
            ON 
                u.usuario_id = a.usuario_id
            LEFT JOIN
                pacientes p
            ON
                a.paciente_id = p.paciente_id
            WHERE 
                u.clinica_id = $1 AND
                u.tipousuario = 'psicologo_vinculado'
            GROUP BY 
                u.usuario_id
        `;
        return db.manyOrNone(query, [clinicaId]);
    },
    listLinkedSecretaries: (clinicaId) => {
        const query = `
            SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = 'secretario_vinculado';
        `;
        return db.manyOrNone(query, [clinicaId]);
    },
    addLinkedPsychologist: async ({ nome_usuario, email_usuario, senha, tipousuario, clinica_id, status_usuario }) => {
        const tiposPermitidos = ['clinica', 'psicologo_vinculado', 'secretario_vinculado'];
        if (!tiposPermitidos.includes(tipousuario)) {
            throw new Error('Tipo de usuário inválido');
        }
        try {
            await db.none(
                'INSERT INTO usuarios (nome_usuario, email_usuario, senha, tipousuario, clinica_id, status_usuario) VALUES ($1, $2, $3, $4, $5, $6)',
                [nome_usuario, email_usuario, senha, tipousuario, clinica_id, status_usuario]
            );
            return { success: true, message: 'Usuário registrado com sucesso!' };
        } catch (error) {
            console.error('Erro ao inserir usuário:', error);
            return { success: false, message: 'Erro ao inserir usuário' };
        }
    }
};

module.exports = Clinica;

