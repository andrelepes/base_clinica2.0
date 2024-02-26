const db = require('../database/database');

const Clinica = {
    listLinkedPsychologists: (clinicaId) => {
        const query = `
            SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = 'psicologo_vinculado';
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

