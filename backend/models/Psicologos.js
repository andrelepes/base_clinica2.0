const db = require('../../database'); // Ajuste o caminho conforme necessário

class Psicologos {
  static async create(nome, email, cpf, clinicaId) {  // Adicione o parâmetro clinicaId
    try {
      const result = await db.one('INSERT INTO psicologos (nome, email, cpf, clinica_id) VALUES ($1, $2, $3, $4) RETURNING id', [nome, email, cpf, clinicaId]);  // Inclua o clinicaId na query
      return result.id;
    } catch (error) {
      console.error('Erro ao inserir psicólogo:', error);
      throw error;
    }
  }
}

module.exports = Psicologos;
