const db = require('../../database');

const Clinica = {
    // Listar todas as clínicas
    listAll: () => {
        const query = `
            SELECT * FROM clinicas;
        `;
        return db.manyOrNone(query);
    },

    // Obter informações de uma clínica por ID
    getById: (id) => {
        const query = `
            SELECT * FROM clinicas WHERE id = $1;
        `;
        return db.oneOrNone(query, [id]);
    },

    // Listar psicólogos vinculados a uma clínica
    listLinkedPsychologists: (clinicaId) => {
        const query = `
            SELECT * FROM linked_psychologists WHERE clinica_id = $1;
        `;
        return db.manyOrNone(query, [clinicaId]);
    },

    // Listar secretários vinculados a uma clínica
    listLinkedSecretaries: (clinicaId) => {
        const query = `
            SELECT * FROM linked_secretaries WHERE clinica_id = $1;
        `;
        return db.manyOrNone(query, [clinicaId]);
    },

    // Adicionar uma nova clínica
    add: (clinica) => {
        const query = `
            INSERT INTO clinicas(nome, cpfCnpj, telefone, cep, endereco, email, tipoUsuario)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;
        return db.one(query, [clinica.nome, clinica.cpfCnpj, clinica.telefone, clinica.cep, clinica.endereco, clinica.email, clinica.tipoUsuario]);
    },

    // Atualizar uma clínica existente
    update: (id, clinica) => {
        const query = `
            UPDATE clinicas
            SET nome = $1, cpfCnpj = $2, telefone = $3, cep = $4, endereco = $5, email = $6
            WHERE id = $7;
        `;
        return db.none(query, [clinica.nome, clinica.cpfCnpj, clinica.telefone, clinica.cep, clinica.endereco, clinica.email, id]);
    },

    // Deletar uma clínica
    delete: (id) => {
        const query = `
            DELETE FROM clinicas WHERE id = $1;
        `;
        return db.none(query, [id]);
    },

    // Adicionar um psicólogo vinculado a uma clínica
    addLinkedPsychologist: (clinicaId, psychologistId) => {
        const query = `
            INSERT INTO linked_psychologists(clinica_id, psychologist_id)
            VALUES($1, $2);
        `;
        return db.none(query, [clinicaId, psychologistId]);
    },

    // Adicionar um secretário vinculado a uma clínica
    addLinkedSecretary: (clinicaId, secretaryId) => {
        const query = `
            INSERT INTO linked_secretaries(clinica_id, secretary_id)
            VALUES($1, $2);
        `;
        return db.none(query, [clinicaId, secretaryId]);
    }
};

module.exports = Clinica;
