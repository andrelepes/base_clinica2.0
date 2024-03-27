const db = require('../database/database');

class Evolutions {
  async findAllByUserIdAndPatientId(userId, patientId) {
    const query = `
    SELECT 
      e.evolution_id, 
      e.usuario_id, 
      e.paciente_id, 
      e.attendance_status, 
      e.punctuality_status, 
      e.arrival_mood_state, 
      e.discussion_topic, 
      e.analysis_intervention, 
      e.next_session_plan, 
      e.departure_mood_state, 
      e.therapist_notes, 
      e.evolution_status, 
      (a.data_hora_inicio AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') AS session_date
    FROM 
      evolutions e
    INNER JOIN 
      agendamentos a ON e.agendamento_id = a.agendamento_id
    WHERE 
      e.usuario_id = ${userId} AND e.paciente_id = ${patientId}`;
    try {
      return db.any(query);
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUserId(evolutionId, userId) {
    const query = `
    SELECT 
      e.evolution_id, 
      e.usuario_id, 
      e.paciente_id, 
      e.attendance_status, 
      e.punctuality_status, 
      e.arrival_mood_state, 
      e.discussion_topic, 
      e.analysis_intervention, 
      e.next_session_plan, 
      e.departure_mood_state, 
      e.therapist_notes, 
      e.evolution_status, 
      (a.data_hora_inicio AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') AS session_date
    FROM 
      evolutions e
    INNER JOIN 
      agendamentos a ON e.agendamento_id = a.agendamento_id
    WHERE 
      e.usuario_id = ${userId} AND e.evolution_id = ${evolutionId}`;

    try {
      return db.oneOrNone(query);
    } catch (error) {
      throw error;
    }
  }

  async createForUserIdAndPatientId(evolution) {
    try {
      return db.none(
        `INSERT INTO evolutions (
            usuario_id,
            paciente_id,
            attendance_status,
            punctuality_status,
            arrival_mood_state,
            discussion_topic,
            analysis_intervention,
            next_session_plan,
            departure_mood_state,
            therapist_notes,
            agendamento_id, 
            evolution_status
          ) VALUES (
            ${usuario_id},
            ${paciente_id},
            ${attendance_status},
            ${punctuality_status},
            ${arrival_mood_state},
            ${discussion_topic},
            ${analysis_intervention},
            ${next_session_plan},
            ${departure_mood_state},
            ${therapist_notes},
            ${appointment_id},
            ${evolution_status}
          )`,
        evolution
      );
    } catch (error) {
      throw error;
    }
  }

  async simpleCreateForUserIdAndPatientId(evolution) {
    try {
      return db.none(
        'INSERT INTO evolutions (usuario_id, paciente_id, agendamento_id) VALUES (${usuario_id}, ${paciente_id}, ${agendamento_id})',
        evolution
      );
    } catch (error) {
      throw error;
    }
  }

  async updateByIdAndUserId(evolutionId, evolution) {
    try {
      return db.none(
        `UPDATE 
            evolutions 
          SET 
            attendance_status = ${attendance_status},
            punctuality_status = ${punctuality_status},
            arrival_mood_state = ${arrival_mood_state},
            discussion_topic = ${discussion_topic},
            analysis_intervention = ${analysis_intervention},
            next_session_plan = ${next_session_plan},
            departure_mood_state = ${departure_mood_state},
            therapist_notes = ${therapist_notes},
            evolution_status = ${evolution_status}
          WHERE 
            evolution_id = ${evolutionId} 
            AND usuario_id = ${usuario_id}`,
        { evolutionId, ...evolution }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteByIdAndUserId(evolutionId, userId) {
    try {
      return db.none(
        'DELETE FROM evolutions WHERE evolution_id = $1 AND usuario_id = $2',
        [evolutionId, userId]
      );
    } catch (error) {
      throw error;
    }
  }
  async generatePendingAppointments({ pacienteId, user, tipousuario, clinicaId }) {
    let query = `
      INSERT INTO evolutions (usuario_id, paciente_id, agendamento_id, evolution_status)
      SELECT 
          a.usuario_id, 
          a.paciente_id, 
          a.agendamento_id, 
          false
      FROM 
          agendamentos a
      LEFT JOIN 
          evolutions e ON a.agendamento_id = e.agendamento_id
      WHERE 
          e.evolution_id IS NULL 
          AND (a.data_hora_inicio <= NOW() OR a.data_hora_inicio <= NOW() + INTERVAL '24 hours')
          AND a.status NOT IN ('cancelado', 'remarcado')
    `;

    if (pacienteId) {
      query += ` AND a.paciente_id = ${pacienteId}`;
    }

    if (tipousuario === 'psicologo_vinculado') {
      query += ` AND a.usuario_id = ${user}`;
    }

    if (tipousuario === 'clinica') {
      query += ` AND a.usuario_id IN (SELECT usuario_id FROM usuarios WHERE clinica_id = ${clinicaId})`;
    }

    query += `ORDER BY a.data_hora_inicio ASC;`;
    try {
      await db.query(query);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Evolutions;
