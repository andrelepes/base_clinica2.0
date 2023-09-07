const db = require('../../database'); // Ajuste o caminho conforme necessário

class Psicologos {
  static async create(nome, email) {
    try {
      const result = await db.one('INSERT INTO psicologos (nome, email) VALUES ($1, $2) RETURNING id', [nome, email]);
      return result.id;
    } catch (error) {
      console.error('Erro ao inserir psicólogo:', error);
      throw error;
    }
  }
}

module.exports = Psicologos;
