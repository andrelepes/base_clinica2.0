const db = require('../database/database'); // Ajuste o caminho conforme necessário

class Pacientes {
  // Método para verificar se um Email já está registrado
  static async emailJaRegistrado(email) {
    try {
      const paciente = await db.oneOrNone('SELECT * FROM pacientes WHERE email_paciente = $1', [email]);
      return paciente !== null;
    } catch (error) {
      console.error('E-mail já registrado:', error);
      throw error;
    }
  }

  // Método para inserir um novo paciente
  static async inserirPaciente(paciente) {
  try {
    await db.none('INSERT INTO pacientes (nome_paciente, email_paciente, telefone_paciente, usuario_id, clinica_id, cpf_paciente, data_nascimento_paciente, cep_paciente, endereco_paciente) VALUES (${nome_paciente}, ${email_paciente}, ${telefone_paciente}, ${usuario_id}, ${clinica_id}, ${cpf_paciente}, ${data_nascimento_paciente}, ${cep_paciente}, ${endereco_paciente})', paciente);
    return { success: true, message: 'Paciente registrado com sucesso!' };
  } catch (error) {
    console.error('Erro ao inserir paciente:', error);
    return { success: false, message: 'Erro ao inserir paciente' };
  }
  }

// Método para listar todos os pacientes
static async listarPacientes(tipousuario, clinica_id, usuario_id) {
  try {
    let pacientes;
    switch (tipousuario) {
      case 'psicologo':
        pacientes = await db.any('SELECT * FROM pacientes WHERE usuario_id = $1', [usuario_id]);
        break;
      case 'clinica':
      case 'secretario_vinculado':
      case 'psicologo_vinculado':
        pacientes = await db.any('SELECT * FROM pacientes WHERE clinica_id = $1', [clinica_id]);
        break;
      default:
        throw new Error('Tipo de usuário não reconhecido.');
    }
    return pacientes;
  } catch (error) {
    console.error('Erro ao tentar listar pacientes:', error);
    throw error;
  }
}

  // Método para atualizar informações de um paciente
  static async atualizarPaciente(paciente_id, nome_paciente, data_nascimento_paciente, telefone_paciente, email_paciente, cep_paciente, endereco_paciente, diagnostico, historico_medico, status_paciente, cpf_paciente, tipousuario, clinica_id, usuario_id) {
    try {    
        let query;
        const values = [paciente_id, nome_paciente, data_nascimento_paciente, telefone_paciente, email_paciente, cep_paciente, endereco_paciente, diagnostico, historico_medico, status_paciente, cpf_paciente, usuario_id];
        
        switch (tipousuario) {
            case 'psicologo':
                query = 'UPDATE pacientes SET nome_paciente = $2, data_nascimento_paciente = $3, telefone_paciente = $4, email_paciente = $5, cep_paciente = $6, endereco_paciente = $7, diagnostico = $8, historico_medico = $9, status_paciente = $10, cpf_paciente = $11, usuario_id = $12 WHERE paciente_id = $1';
                break;
            case 'clinica':
            case 'secretario_vinculado':
            case 'psicologo_vinculado':
                query = 'UPDATE pacientes SET nome_paciente = $2, data_nascimento_paciente = $3, telefone_paciente = $4, email_paciente = $5, cep_paciente = $6, endereco_paciente = $7, diagnostico = $8, historico_medico = $9, status_paciente = $10, cpf_paciente = $11, usuario_id = $12 WHERE paciente_id = $1 AND clinica_id = $13';
                values.push(clinica_id);
                break;
            default:
                throw new Error('Tipo de usuário não reconhecido.');
        }
        await db.none(query, values);
        return { success: true, message: 'Paciente atualizado com sucesso!' };
    } catch (error) {
        console.error('Erro ao atualizar paciente:', error);
        throw error;
    }
}

// Método para filtrar pacientes 
static async filtrarPacientes(nome, status, tipousuario, clinica_id, usuario_id) {
  try {
    const nomeBusca = nome ? `%${nome}%` : null; // Formato para busca parcial com LIKE no SQL
    let query = 'SELECT * FROM pacientes WHERE 1=1'; // Base da consulta
    const values = [];

    if (nomeBusca) {
      query += ` AND LOWER(nome_paciente) LIKE LOWER($${values.length + 1})`; // Tornando a busca insensível ao caso
      values.push(nomeBusca);
    }

    if (status) {
      query += ` AND status_paciente = $${values.length + 1}`;
      values.push(status);
    }

    switch (tipousuario) {
      case 'psicologo':
        query += ` AND usuario_id = $${values.length + 1}`;
        values.push(usuario_id);
        break;
      case 'clinica':
      case 'secretario_vinculado':
      case 'psicologo_vinculado':
        query += ` AND clinica_id = $${values.length + 1}`;
        values.push(clinica_id);
        break;
      default:
        throw new Error('Tipo de usuário não reconhecido.');
    }

    const pacientes = await db.any(query, values);
    return pacientes;

  } catch (error) {
    console.error('Erro ao filtrar pacientes:', error);
    throw error;
  }
}

  // Método para buscar um paciente por ID
  static async buscarPorId(paciente_id) {
  try {
    const paciente = await db.oneOrNone('SELECT p.*, (SELECT count(*) FROM autorizacoes WHERE paciente_id = $1) as authorization_total FROM pacientes p WHERE paciente_id = $1', [paciente_id]);
    return paciente;
  } catch (error) {
    console.error('Erro ao buscar paciente por ID:', error);
    throw error;
  }
  }
  static async listarPacientesPaginados(tipousuario, clinica_id, usuario_id, page = 1) {
    try {
      const limit = 10; // Número de registros por página
      const offset = (page - 1) * limit; // Calcula o offset com base na página atual
  
      let pacientes;
      switch (tipousuario) {
        case 'psicologo':
          pacientes = await db.any('SELECT * FROM pacientes WHERE usuario_id = $1 LIMIT $2 OFFSET $3', [usuario_id, limit, offset]);
          break;
  
        case 'clinica':
          pacientes = await db.any('SELECT * FROM pacientes WHERE clinica_id = $1 LIMIT $2 OFFSET $3', [clinica_id, limit, offset]);
          break;
  
        case 'secretario_vinculado':
          pacientes = await db.any('SELECT * FROM pacientes WHERE clinica_id = $1 AND usuario_id = $2 LIMIT $3 OFFSET $4', [clinica_id, usuario_id, limit, offset]);
          break;
  
        case 'psicologo_vinculado':
          pacientes = await db.any('SELECT * FROM pacientes WHERE clinica_id = $1 AND usuario_id = $2 LIMIT $3 OFFSET $4', [clinica_id, usuario_id, limit, offset]);
          break;
  
        default:
          throw new Error('Tipo de usuário não reconhecido.');
      }
      return pacientes;
    } catch (error) {
      console.error('Erro ao tentar listar pacientes:', error);
      throw error;
    }
  }

// Método para marcar paciente como inativo
static async marcarComoInativo(paciente_id, clinica_id, usuario_id, tipousuario) {
  try {
      let query;
      const values = [paciente_id, 'inativo', usuario_id];

      if (tipousuario === 'psicologo') {
          query = 'UPDATE pacientes SET status_paciente = $2, inativado_por = $3 WHERE paciente_id = $1';
      } else {
          query = 'UPDATE pacientes SET status_paciente = $2, inativado_por = $3 WHERE paciente_id = $1 AND clinica_id = $4';
          values.push(clinica_id);
      }

      await db.none(query, values);
      return { success: true, message: 'Paciente marcado como inativo com sucesso!' };
  } catch (error) {
      console.error('Erro ao marcar paciente como inativo:', error);
      throw error;
  }
}

// Método para marcar paciente como ativo
static async marcarComoAtivo(paciente_id, clinica_id, tipousuario) {
  try {
      let query;
      const values = [paciente_id, 'ativo'];

      if (tipousuario === 'psicologo') {
          query = 'UPDATE pacientes SET status_paciente = $2, inativado_por = NULL WHERE paciente_id = $1';
      } else {
          query = 'UPDATE pacientes SET status_paciente = $2, inativado_por = NULL WHERE paciente_id = $1 AND clinica_id = $3';
          values.push(clinica_id);
      }

      await db.none(query, values);
      return { success: true, message: 'Paciente reativado com sucesso!' };
  } catch (error) {
      console.error('Erro ao reativar paciente:', error);
      throw error;
  }
}

static async filtrarPacientesComEvolucoesPendentes(tipousuario, clinica_id, usuario_id) {
  try {
    let query = `
    SELECT 
      p.*, 
      (SELECT COUNT(*) FROM evolutions e WHERE e.paciente_id = p.paciente_id AND e.evolution_status = false) AS pending_evolutions_count,
      COALESCE(
        json_agg(
          json_build_object(
            'nome_psicologo', u.nome_usuario
          )
        ) FILTER (WHERE a.usuario_id IS NOT NULL AND a.status = 'ativo'), 
        '[]'
      ) AS psicologos_autorizados
    FROM 
      pacientes p
    LEFT JOIN 
      autorizacoes a ON p.paciente_id = a.paciente_id
    LEFT JOIN 
      usuarios u ON a.usuario_id = u.usuario_id
    WHERE 
      1=1
    `; 
    const values = [];
    
    switch (tipousuario) {
      case 'psicologo':
        query += ` AND p.usuario_id = $${values.length + 1}`;
        values.push(usuario_id);
        break;
      case 'clinica':
      case 'secretario_vinculado':
        query += ` AND p.clinica_id = $${values.length + 1}`;
        values.push(clinica_id);
        break;
      case 'psicologo_vinculado':
        query += ` AND p.clinica_id = $${values.length + 1} AND EXISTS (
          SELECT 1 FROM autorizacoes a2 
          WHERE a2.paciente_id = p.paciente_id 
          AND a2.usuario_id = $${values.length + 2}
        )`;
        values.push(clinica_id, usuario_id);
        break;
      default:
        throw new Error('Tipo de usuário não reconhecido.');
    }

    query += `
      GROUP BY p.paciente_id
    `;

    const pacientes = await db.any(query, values);
    return pacientes;

  } catch (error) {
    console.error('Erro ao filtrar pacientes:', error);
    throw error;
  }
}

static async getAllByClinicId(clinica_id){
  try {
    const query = `
        SELECT 
            paciente_id,
            nome_paciente
        FROM 
            pacientes
        WHERE 
            clinica_id  = ${clinica_id} 
            AND status_paciente = 'ativo'
        ORDER BY 
            nome_paciente
    `;
    return await db.any(query);
  } catch (error) {
      throw error;
  }
}
static async getAllAuthorized(usuario_id){
  try {
    const query = `
        SELECT 
            paciente_id,
            nome_paciente
        FROM 
            pacientes
        WHERE 
            paciente_id IN (SELECT paciente_id FROM autorizacoes WHERE usuario_id = ${usuario_id}) 
            AND status_paciente = 'ativo'
        ORDER BY 
            nome_paciente
    `;
    return await db.any(query);
  } catch (error) {
      throw error;
  }
}

static async vinculatePatients(usuario_id, clinica_id, pacientes) {
  try {
    const insertValues = pacientes.map(paciente => `(${usuario_id}, ${paciente}, ${clinica_id}, 'ativo', now())`).join(', ');
    await db.tx(async t => {
      const insertQuery = `
        INSERT INTO autorizacoes (usuario_id, paciente_id, clinica_id, status, data_concessao)
        VALUES
        ${insertValues}
        ON CONFLICT (usuario_id, paciente_id, clinica_id)
        DO UPDATE SET status = EXCLUDED.status, data_concessao = EXCLUDED.data_concessao, data_retirada = null
        WHERE autorizacoes.status = 'inativo';
      `;
      await t.none(insertQuery);

      const updateQuery = `
        UPDATE autorizacoes
        SET 
          status = 'inativo',
          data_retirada = now()
        WHERE usuario_id = $1
          AND clinica_id = $2
          AND paciente_id NOT IN (${pacientes.join(', ')});
      `;
      await t.none(updateQuery, [usuario_id, clinica_id]);
    });
  } catch (error) {
    throw error;
  }
}

}

module.exports = Pacientes;
