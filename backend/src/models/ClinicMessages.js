const db = require('../database/database');

class ClinicMessages {
  async create(clinic_id, data, usuario_id) {
    const query = `
      INSERT INTO clinic_messages(
         subject,
         message,
         clinic_id
         ${usuario_id ? ',usuario_id' : ''}
      ) VALUES (
         \${subject},
         \${message},
         \${clinic_id}
         ${usuario_id ? ',${usuario_id}' : ''}
      )      
      `;
    try {
      return db.none(query, { ...data, usuario_id, clinic_id });
    } catch (error) {
      throw error;
    }
  }

  async update(message_id, data) {
    const query = `
      UPDATE clinic_messages SET
         subject = \${subject},
         message = \${message},
         usuario_id = \${usuario_id}
      WHERE
         message_id = \${message_id}
      `;
    try {
      return db.none(query, { ...data, message_id });
    } catch (error) {
      throw error;
    }
  }

  async delete(message_id) {
    try {
      return db.none(
        'DELETE FROM clinic_messages WHERE message_id = ${message_id}',
        { message_id }
      );
    } catch (error) {
      throw error;
    }
  }

  async getMessagesById(usuario_id){
    try {
      const query = `
        SELECT 
          cm.message_id,
          TO_CHAR(cm.created_at, 'DD/MM/YYYY "às" HH24:MI') as created_at,
          TO_CHAR(cm.updated_at, 'DD/MM/YYYY "às" HH24:MI') as updated_at,
          cm.subject,
          cm.message,
          CASE
            WHEN usuario_id is NULL THEN 'Todos'
            ELSE (SELECT nome_usuario FROM usuarios u WHERE u.usuario_id = cm.usuario_id)
          END AS receiver 
        FROM 
          clinic_messages cm
        WHERE 
          cm.usuario_id = \${usuario_id} 
          OR (
            cm.clinic_id = (SELECT clinica_id FROM usuarios WHERE usuario_id = \${usuario_id) 
            AND 
            cm.usuario_id IS NULL
          )
      `
      return db.any(query, { usuario_id });
    } catch (error) {
      throw error;
    }
  }
  async getMessagesByClinicId(clinic_id){
    try {
      const query = `
        SELECT 
          cm.message_id,
          TO_CHAR(cm.created_at, 'DD/MM/YYYY "às" HH24:MI') as created_at,
          TO_CHAR(cm.updated_at, 'DD/MM/YYYY "às" HH24:MI') as updated_at,
          cm.subject,
          cm.message,
          CASE
            WHEN usuario_id is NULL THEN 'Todos'
            ELSE (SELECT nome_usuario FROM usuarios u WHERE u.usuario_id = cm.usuario_id)
          END AS receiver 
        FROM 
          clinic_messages cm
        WHERE 
          cm.clinic_id = \${clinic_id}
      `
      return db.any(query, { clinic_id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClinicMessages;
