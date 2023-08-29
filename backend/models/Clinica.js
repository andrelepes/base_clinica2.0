const db = require('../../database'); 

const Clinica = {
    // Adicionar uma nova clínica
    add: (clinica) => {
        console.log("Tentando adicionar nova clínica ao banco de dados.");  // Mensagem de depuração
        const query = `
            INSERT INTO clinicas(nome, cpfCnpj, telefone, cep, endereco, email)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;
        return db.one(query, [clinica.nome, clinica.cpfCnpj, clinica.telefone, clinica.cep, clinica.endereco, clinica.email]);
    },
  
    // Atualizar uma clínica existente
    update: (id, clinica) => {
        console.log(`Atualizando clínica com ID ${id}`);  // Mensagem de depuração
        const query = `
            UPDATE clinicas
            SET nome = $1, cpfCnpj = $2, telefone = $3, cep = $4, endereco = $5, email = $6
            WHERE id = $7;
        `;
        return db.none(query, [clinica.nome, clinica.cpfCnpj, clinica.telefone, clinica.cep, clinica.endereco, clinica.email, id]);
    },
  
    // Deletar uma clínica
    delete: (id) => {
        console.log(`Deletando clínica com ID ${id}`);  // Mensagem de depuração
        const query = `
            DELETE FROM clinicas WHERE id = $1;
        `;
        return db.none(query, [id]);
    },
  
    // Adicionar um psicólogo vinculado a uma clínica
    addLinkedPsychologist: (clinicaId, psychologistId) => {
        console.log(`Vinculando psicólogo com ID ${psychologistId} à clínica com ID ${clinicaId}`);  // Mensagem de depuração
        const query = `
            INSERT INTO linked_psychologists(clinica_id, psychologist_id)
            VALUES($1, $2);
        `;
        return db.none(query, [clinicaId, psychologistId]);
    },
  
    // Adicionar um secretário vinculado a uma clínica
    addLinkedSecretary: (clinicaId, secretaryId) => {
        console.log(`Vinculando secretário com ID ${secretaryId} à clínica com ID ${clinicaId}`);  // Mensagem de depuração
        const query = `
            INSERT INTO linked_secretaries(clinica_id, secretary_id)
            VALUES($1, $2);
        `;
        return db.none(query, [clinicaId, secretaryId]);
    }
};

module.exports = Clinica;
