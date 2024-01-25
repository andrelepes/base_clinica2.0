const db = require('../database/database'); // Ajuste o caminho conforme necessário
const { v4: uuidv4 } = require('uuid')

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
      console.log("Tentando inserir usuário no banco de dados");  // Log adicional
      await db.none('INSERT INTO usuarios (nome_usuario, email_usuario, senha, tipousuario, clinica_id) VALUES ($1, $2, $3, $4, $5)',
        [nome_usuario, email_usuario, senhaCriptografada, tipousuario, clinica_id]);
        console.log("Usuário inserido com sucesso no banco de dados");  // Log adicional
      return { success: true, message: 'Usuário registrado com sucesso!' };
    } catch (error) {
      console.error('Erro ao inserir usuário (arquivo Usuarios.js):', error);
      return { success: false, message: 'Erro ao inserir usuário ((arquivo Usuarios.js)' };
    }
  }

// Método para inserir um novo usuário vinculado
static async addLinkedPsychologist({ nome_usuario, email_usuario, tipousuario, clinica_id, status_usuario }) {
  const tiposPermitidos = ['clinica', 'psicologo_vinculado', 'secretario_vinculado'];
  if (!tiposPermitidos.includes(tipousuario)) {
    throw new Error('Tipo de usuário inválido');
  }
  
  // Gerar uma senha temporária (você pode usar qualquer lógica para isso)
  const senhaTemporaria = "12345";
  const firstAccess = uuidv4();
  
  try {
    await db.none(
      'INSERT INTO usuarios (nome_usuario, email_usuario, senha, tipousuario, clinica_id, status_usuario, first_access) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [nome_usuario, email_usuario, senhaTemporaria, tipousuario, clinica_id, status_usuario, firstAccess]
    );
    return { success: true, message: 'Usuário registrado com sucesso!' };
  } catch (error) {
    console.error('Erro ao inserir usuário:', error);
    return { success: false, message: 'Erro ao inserir usuário' };
  }
}
  static async getLinkedPsychologists(clinicaId) {
    console.log("Função getLinkedPsychologists no modelo chamada");  // Log 1
    try {
      const psychologists = await db.any('SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = $2', [clinicaId, 'psicologo_vinculado']);
      console.log("Operação bem-sucedida");  // Log 2
      return { success: true, data: psychologists };
    } catch (error) {
      console.error('Erro ao buscar psicólogos vinculados:', error);
      console.log("Erro na função getLinkedPsychologists no modelo:", error);  // Log 3
      return { success: false, message: 'Erro ao buscar psicólogos vinculados' };
    }
  }
  static async atualizarStatusUsuario(usuario_id, novoStatus) {
    try {
      await db.none('UPDATE usuarios SET status_usuario = $1 WHERE usuario_id = $2', [novoStatus, usuario_id]);
      return { success: true, message: 'Status atualizado com sucesso!' };
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return { success: false, message: 'Erro ao atualizar status' };
    }
  }
// Método para inserir um novo secretário vinculado
static async addLinkedSecretary({ nome_usuario, email_usuario, tipousuario, clinica_id, status_usuario }) {
  const tiposPermitidos = ['clinica', 'psicologo_vinculado', 'secretario_vinculado'];
  if (!tiposPermitidos.includes(tipousuario)) {
    throw new Error('Tipo de usuário inválido');
  }
  
  // Gerar uma senha temporária (você pode usar qualquer lógica para isso)
  const senhaTemporaria = "12345";
  const firstAccess = uuidv4();
  
  try {
    await db.none(
      'INSERT INTO usuarios (nome_usuario, email_usuario, senha, tipousuario, clinica_id, status_usuario, first_access) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [nome_usuario, email_usuario, senhaTemporaria, tipousuario, clinica_id, status_usuario, firstAccess]
    );
    return { success: true, message: 'Usuário registrado com sucesso!' };
  } catch (error) {
    console.error('Erro ao inserir usuário:', error);
    return { success: false, message: 'Erro ao inserir usuário' };
  }
}

// Método para obter secretários vinculados
static async getLinkedSecretaries(clinicaId) {
  try {
    const secretaries = await db.any('SELECT * FROM usuarios WHERE clinica_id = $1 AND tipousuario = $2', [clinicaId, 'secretario_vinculado']);
    return { success: true, data: secretaries };
  } catch (error) {
    console.error('Erro ao buscar secretários vinculados:', error);
    return { success: false, message: 'Erro ao buscar secretários vinculados' };
  }
}
// Método para buscar um usuário por ID
static async buscarPorId(usuario_id) {
  try {
    const usuario = await db.oneOrNone(
      'SELECT nome_usuario, email_usuario, cpfcnpj, data_nascimento_usuario, telefone_usuario, cep_usuario, endereco_usuario, qualificacoes, horarios_disponiveis, registro_profissional, status_usuario FROM usuarios WHERE usuario_id = $1',
      [usuario_id]
    );
    return usuario;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    throw error;
  }
}
  static async getUserByFirstAccessToken(firstAccessToken){
    try {
      const user = await db.oneOrNone(
        'SELECT nome_usuario, email_usuario, tipousuario FROM usuarios WHERE first_access = ${firstAccessToken}',
        {firstAccessToken}
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
  static async firstAccess(
    nome_usuario,
    email_auxiliar,
    senhaCriptografada,
    firstAccessToken
  ) {
    try {
      const result = await db.oneOrNone(
        'UPDATE usuarios SET nome_usuario = ${nome_usuario}, email_auxiliar = ${email_auxiliar}, senha = ${senhaCriptografada}, status_usuario = \'ativo\', first_access = null where first_access = ${firstAccessToken} RETURNING usuario_id, nome_usuario, tipousuario, clinica_id',
        { nome_usuario, email_auxiliar, senhaCriptografada, firstAccessToken }
      );
      return {
        success: true,
        message: 'Usuário registrado com sucesso!',
        user: {
          usuario_id: result.usuario_id,
          nome_usuario: result.nome_usuario,
          tipousuario: result.tipousuario,
          clinica_id: result.clinica_id,
        },
      };
    } catch (error) {
      console.error(error)
      return {
        success: false,
        error,
        message: 'Erro ao inserir usuário',
      };
    }
  }
}

module.exports = Usuarios;