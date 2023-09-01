const db = require('../../database'); // Ajuste o caminho conforme necessário

class Usuarios {
  // Método para verificar se um e-mail já está registrado
  static async emailJaRegistrado(email) {
    try {
      const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email = $1', [email]);
      return usuario !== null;
    } catch (error) {
      console.error('Erro ao verificar e-mail:', error);
      throw error;
    }
  }

  // Método para inserir um novo usuário
  static async inserirUsuario(nome, email, senhaCriptografada, tipoUsuario, clinica_id) {
    try {
      await db.none('INSERT INTO usuarios (nome, email, senha, tipoUsuario, clinica_id) VALUES ($1, $2, $3, $4, $5)',
        [nome, email, senhaCriptografada, tipoUsuario, clinica_id]);
      return { success: true, message: 'Usuário registrado com sucesso!' };
    } catch (error) {
      console.error('Erro ao inserir usuário:', error);
      return { success: false, message: 'Erro ao inserir usuário' };
    }
  }

  // Outros métodos relacionados a usuários podem ser adicionados aqui
}

module.exports = Usuarios;

