const db = require('../../database'); // Ajuste o caminho conforme necessário

class Usuarios {
  // Método para verificar se um e-mail já está registrado
  static async emailJaRegistrado(email) {
    try {
      const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email_usuario = $1', [email]);
      return usuario !== null;
    } catch (error) {
      console.error('Erro ao verificar e-mail:', error);
      throw error;
    }
  }

  // Método para inserir um novo usuário
  static async inserirUsuario(nome_usuario, email_usuario, senhaCriptografada, tipousuario, clinica_id) {
    // Verifique se o tipo de usuário é válido
    const tiposPermitidos = ['clinica', 'psicologo', 'psicologo_vinculado', 'secretario_vinculado'];
    if (!tiposPermitidos.includes(tipousuario)) {
      throw new Error('Tipo de usuário inválido');
    }

    try {
      await db.none('INSERT INTO usuarios (nome_usuario, email_usuario, senha, tipousuario, clinica_id) VALUES ($1, $2, $3, $4, $5)',
        [nome_usuario, email_usuario, senhaCriptografada, tipousuario, clinica_id]);
      return { success: true, message: 'Usuário registrado com sucesso!' };
    } catch (error) {
      console.error('Erro ao inserir usuário:', error);
      return { success: false, message: 'Erro ao inserir usuário' };
    }
  }

// Método para inserir um novo usuário vinculado
  static async inserirUsuarioVinculado({ nome_usuario, email_usuario, senha, tipousuario, clinica_id, status_usuario }) {
 // Verifique se o tipo de usuário é válido
 const tiposPermitidos = ['clinica', 'psicologo', 'psicologo_vinculado', 'secretario_vinculado'];
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
  // Outros métodos relacionados a usuários podem ser adicionados aqui
}

module.exports = Usuarios;