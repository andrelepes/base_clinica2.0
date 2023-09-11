const db = require('../../database');

const Clinica = {
    // Listar psicólogos vinculados a uma clínica
    listLinkedPsychologists: (clinicaId) => {
        const query = `
            SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = 'psicologo_vinculado';
        `;
        return db.manyOrNone(query, [clinicaId]);
    },

    // Listar secretários vinculados a uma clínica
    listLinkedSecretaries: (clinicaId) => {
        const query = `
            SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = 'secretario_vinculado';
        `;
        return db.manyOrNone(query, [clinicaId]);
    }
};

module.exports = Clinica;
