const db = require('../../database'); // Ajuste o caminho conforme necessário

class Psicologos {
    static async create(nome, email, cpf) {  // Adicione o parâmetro cpf
        try {
          const result = await db.one('INSERT INTO psicologos (nome, email, cpf) VALUES ($1, $2, $3) RETURNING id', [nome, email, cpf]);  // Inclua o cpf na query
          return result.id;
        } catch (error) {
          console.error('Erro ao inserir psicólogo:', error);
          throw error;
        }
      }
}

module.exports = Psicologos;
