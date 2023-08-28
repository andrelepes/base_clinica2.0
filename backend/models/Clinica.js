const db = require('../../database'); 

const Clinica = {
  // Adicionar uma nova clínica
  add: (clinica) => {
    const query = `
      INSERT INTO clinicas(nome, tipoUsuario, cpfCnpj, telefone, cep, endereco)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
    return db.one(query, [clinica.nome, clinica.tipoUsuario, clinica.cpfCnpj, clinica.telefone, clinica.cep, clinica.endereco]);
  },
  
  // Atualizar uma clínica existente
  update: (id, clinica) => {
    const query = `
      UPDATE clinicas
      SET nome = $1, tipoUsuario = $2, cpfCnpj = $3, telefone = $4, cep = $5, endereco = $6
      WHERE id = $7;
    `;
    return db.none(query, [clinica.nome, clinica.tipoUsuario, clinica.cpfCnpj, clinica.telefone, clinica.cep, clinica.endereco, id]);
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
