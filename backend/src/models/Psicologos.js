const db = require('../../database');

class Psicologos {
  static async create(nome, email, cpf, clinicaId) {
    try {
      const result = await db.one('INSERT INTO usuarios (nome_usuario, email_usuario, cpfcnpj, clinica_id, tipousuario) VALUES ($1, $2, $3, $4, \'psicologo\') RETURNING usuario_id', [nome, email, cpf, clinicaId]);
      return result.usuario_id;
    } catch (error) {
      console.error('Erro ao inserir psicólogo:', error);
      throw error;
    }
  }
}

module.exports = Psicologos;