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
    return { success: true, message: 'Usuário registrado com sucesso!', firstAccess };
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
    return { success: true, message: 'Usuário registrado com sucesso!', firstAccess };
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
      'SELECT nome_usuario, email_usuario, cpfcnpj, data_nascimento_usuario, telefone_usuario, cep_usuario, endereco_usuario, qualificacoes, registro_profissional, status_usuario, start_hour, end_hour, email_auxiliar, monthly_fee, expires_in_day FROM usuarios WHERE usuario_id = $1',
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

  static async getAllPsychologistsByClinicId(clinica_id) {
    try {
      const query = `
          SELECT 
             usuario_id,
             nome_usuario
          FROM 
              usuarios
          WHERE 
              clinica_id  = ${clinica_id} AND
              tipousuario = 'psicologo_vinculado'
          ORDER BY 
              nome_usuario
      `;
      return await db.any(query);
    } catch (error) {
        throw error;
    }
  }

  static async getPsychologistsHoursByClinicId(clinica_id) {
    try {
      const query = `
      SELECT
        u.usuario_id,
        u.nome_usuario,
        COALESCE(SUM(a.tipo_sessao)/60, 0) AS total_horas_sessao,
        (SELECT COUNT(*) FROM evolutions e WHERE e.usuario_id = u.usuario_id AND e.evolution_status = false) as pending_evolutions_count
      FROM
        usuarios u
      LEFT JOIN agendamentos a ON u.usuario_id = a.usuario_id
        AND a.data_hora_fim <= CURRENT_TIMESTAMP
      WHERE
        u.clinica_id = ${clinica_id}
        AND u.tipousuario = 'psicologo_vinculado'
      GROUP BY
        u.usuario_id
      ORDER BY
        u.nome_usuario;
      `;
      return await db.any(query);
    } catch (error) {
        throw error;
    }
  }
  static async getAdditionalDataByPsychologist(clinica_id) {
    try {
      const query = `
      SELECT
          u.usuario_id,
          to_char(a.data_hora_inicio, 'DD/MM/YYYY HH24:MI') AS data_hora_inicio,
          a.status,
          p.nome_paciente,
          CASE
            WHEN e.evolution_status IS FALSE THEN 'Não'
            WHEN e.evolution_status IS TRUE THEN 'Sim'
          END AS evolution_status
      FROM
          usuarios u
      LEFT JOIN agendamentos a ON u.usuario_id = a.usuario_id
          AND a.data_hora_fim <= CURRENT_TIMESTAMP
      LEFT JOIN pacientes p ON a.paciente_id = p.paciente_id
      LEFT JOIN evolutions e ON e.paciente_id = p.paciente_id 
      WHERE
          u.clinica_id = ${clinica_id}
          AND u.tipousuario = 'psicologo_vinculado'
      GROUP BY
          u.usuario_id, a.data_hora_inicio, a.status, p.nome_paciente, e.evolution_status
      ORDER BY
          u.usuario_id, a.data_hora_inicio
      `
      return await db.any(query);
    } catch (error) {
        throw error;
    }
  }

  static async updateUserById({user_id, user}){
    try {
      return await db.oneOrNone(
        'UPDATE usuarios SET nome_usuario = ${nome_usuario}, email_usuario = ${email_usuario} WHERE usuario_id=${usuario_id}',
        { ...user }
      );
    } catch (error) {
      throw error;
    }
  }
  static async updateUserInformationById(user_id, user, tipousuario){
    try {
      const query = `
      UPDATE
        usuarios
      SET
        nome_usuario = \${nome_usuario},
        email_usuario = \${email_usuario},
        cpfcnpj = \${cpfcnpj},
        endereco_usuario = \${endereco_usuario},
        telefone_usuario = \${telefone_usuario},
        cep_usuario = \${cep_usuario},
        email_auxiliar = \${email_auxiliar},
        start_hour = \${start_hour},
        end_hour = \${end_hour}
        ${tipousuario !== 'clinica' ? `,data_nascimento_usuario = \${data_nascimento}`: ''}
      WHERE
        usuario_id = ${user_id}
      `

      if(tipousuario=== 'clinica'){
        const updateAllValues = `UPDATE usuarios SET monthly_fee = \${monthly_fee}, expires_in_day = \${expires_in_day} WHERE clinica_id = ${user_id};`
        await db.tx(async (t) => {
          await t.none(query, { ...user });
  
          await t.none(updateAllValues, { ...user });
        });

        return;
      }
      
      return await db.oneOrNone(
        query,
        { ...user }
      );
    } catch (error) {
      throw error;
    }
  }



  static async deleteUserById(usuario_id){
    try {
      await db.none(
        'DELETE FROM usuarios WHERE usuario_id=${usuario_id}',
        { usuario_id }
      );
      return { success: true, message: 'Usuário deletado com sucesso!' };
    } catch (error) {
      throw error;
    }
  }

  static async getPsychologistHoursById(user_id){
    try {
      const query = `      
        SELECT
          COALESCE(SUM(a.tipo_sessao) / 60, 0) AS total_horas_sessao,
          (
            SELECT
              COUNT(*)
            FROM
              evolutions e_sub
            WHERE
              e_sub.usuario_id = a.usuario_id
              AND e_sub.evolution_status = false
          ) AS pending_evolutions_count,
          jsonb_agg(
            jsonb_build_object(
              'paciente_id',
              p.paciente_id,
              'data_hora_inicio',
              to_char(a.data_hora_inicio, 'DD/MM/YYYY HH24:MI'),
              'nome_paciente',
              p.nome_paciente,
              'status',
              a.status,
              'evolution_status',
              CASE
                WHEN e.evolution_status IS FALSE THEN 'Não'
                WHEN e.evolution_status IS TRUE THEN 'Sim'
                ELSE 'Não Aplicável'
              END
            )
          ) AS hours_data
        FROM
          agendamentos a
          LEFT JOIN pacientes p ON p.paciente_id = a.paciente_id
          LEFT JOIN evolutions e ON e.agendamento_id = a.agendamento_id
        WHERE
          a.usuario_id = ${user_id}
          AND a.data_hora_fim <= CURRENT_TIMESTAMP
        GROUP BY
          a.usuario_id;        
      `
      return await db.oneOrNone(query);
    } catch (error) {
        throw error;
    }
  }
  static async updateCoordinatorInfo(data){
    try {
      const query = `
      UPDATE
        clinic_details
      SET
        nome_coordenador = \${nome_coordenador},
        email_coordenador = \${email_coordenador},
        cpf_coordenador = \${cpf_coordenador},
        telefone_coordenador = \${telefone_coordenador},
      WHERE
        clinic_id = \${clinic_id}
      `
      return await db.none(query, { ...data });
    } catch (error) {
        throw error;
    }
  }
  static async createCoordinatorInfo(data){
    try {
      const query = `
      INSERT INTO
        clinic_details (clinic_id, nome_coordenador, email_coordenador, cpf_coordenador, telefone_coordenador)
      VALUES
        (\${clinic_id}, \${nome_coordenador}, \${email_coordenador}, \${cpf_coordenador}, \${telefone_coordenador})
      `
      return await db.none(query, { ...data });
    } catch (error) {
        throw error;
    }
  }

  static async getCoordinatorInfo(clinic_id){
    try {
      const query = `
      SELECT
        nome_coordenador,
        email_coordenador,
        cpf_coordenador,
        telefone_coordenador
      FROM
        clinic_details
      WHERE
        clinic_id = ${clinic_id}
      `
      return await db.oneOrNone(query);
    } catch (error) {
        throw error;
    }
  }
}

module.exports = Usuarios;