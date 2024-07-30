const db = require('../database/database');

class Evolutions {
  async findAllByPatientId(tipousuario, patientId) {
    const isClinica = tipousuario === 'clinica';
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
      a.data_hora_inicio AS session_date,
      COALESCE(
        CASE
          WHEN arc.archive_id IS NULL THEN '{}'
          ELSE json_build_object(
            'archive_id', arc.archive_id,
            'archive_name', arc.archive_name,
            'archive_mime_type', arc.archive_mime_type,
            'created_at', arc.created_at          
          )
        END,
        '{}'
      ) AS archive
      ${
        isClinica
          ? `,COALESCE(
        json_agg(
          json_build_object(
            'nome_modificador', u.nome_usuario,
            'data_atualizacao', ec.updated_at,
            'dados_antigos', ec.old_record
          )
        ) FILTER (WHERE ec.evolution_id IS NOT NULL), 
        '[]'
      ) AS evolution_changelog`
          : ``
      }
    FROM 
      evolutions e
    INNER JOIN 
      agendamentos a ON e.agendamento_id = a.agendamento_id
    LEFT JOIN
      archives arc ON e.archive_id = arc.archive_id
    ${
      isClinica
        ? `LEFT JOIN
          evolution_changelog ec ON e.evolution_id = ec.evolution_id
       LEFT JOIN 
          usuarios u ON ec.usuario_id = u.usuario_id  `
        : ''
    }     
    WHERE 
      e.paciente_id = ${patientId}
    ${
      isClinica
        ? `GROUP BY
      arc.archive_id, e.evolution_id, a.data_hora_inicio`
        : ''
    }`;
    try {
      console.log(query);
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
      a.data_hora_inicio AS session_date
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
            attendance_status = \${attendance_status},
            punctuality_status = \${punctuality_status},
            arrival_mood_state = \${arrival_mood_state},
            discussion_topic = \${discussion_topic},
            analysis_intervention = \${analysis_intervention},
            next_session_plan = \${next_session_plan},
            departure_mood_state = \${departure_mood_state},
            therapist_notes = \${therapist_notes},
            evolution_status = \${evolution_status}
          WHERE 
            evolution_id = ${evolutionId} 
            AND usuario_id = \${usuario_id}`,
        { ...evolution }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateWithHistory(evolutionId, evolution, oldRegister) {
    const insertChangelogQuery = `
        INSERT INTO evolution_changelog (
          evolution_id,
          old_record,
          usuario_id 
        ) VALUES (
          ${evolutionId},
          '${oldRegister}',
          ${evolution.usuario_id}
        )
      `;

    const updateEvolutionQuery = `
        UPDATE 
          evolutions 
        SET 
          attendance_status = \${attendance_status},
          punctuality_status = \${punctuality_status},
          arrival_mood_state = \${arrival_mood_state},
          discussion_topic = \${discussion_topic},
          analysis_intervention = \${analysis_intervention},
          next_session_plan = \${next_session_plan},
          departure_mood_state = \${departure_mood_state},
          therapist_notes = \${therapist_notes},
          evolution_status = \${evolution_status}
        WHERE 
          evolution_id = ${evolutionId}
          AND usuario_id = \${usuario_id}
      `;

    try {
      await db.tx(async (t) => {
        // Inserir oldRegister no changelog
        await t.none(insertChangelogQuery);

        // Atualizar a evolução
        await t.none(updateEvolutionQuery, { ...evolution });
      });
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
  async generatePendingAppointments({
    pacienteId,
    user,
    tipousuario,
    clinicaId,
  }) {
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

    query += ` ORDER BY a.data_hora_inicio ASC;`;
    try {
      await db.query(query);
    } catch (error) {
      throw error;
    }
  }

  async uploadArchiveWithHistory(
    { archive_id, archive_name, archive_mime_type, archive_localization },
    evolution_id,
    user_id
  ) {
    try {
      const query = `INSERT INTO archives 
        (archive_id, archive_name, archive_localization, archive_mime_type) 
      VALUES
        ('${archive_id}', '${archive_name}', '${archive_localization}', '${archive_mime_type}')
        `;
      const updateQuery = `
      UPDATE evolutions
      SET archive_id = '${archive_id}'
      WHERE evolution_id = ${evolution_id}
      `;
      const insertChangelogQuery = `
        INSERT INTO evolution_changelog (
          evolution_id,
          old_record,
          usuario_id 
        ) VALUES (
          ${evolution_id},
          '${JSON.stringify({ archive_id })}',
          ${user_id}
        )
      `;
      await db.tx(async (t) => {
        await t.none(query);
        await t.none(updateQuery);
        await t.none(insertChangelogQuery);
      });
    } catch (error) {
      throw error;
    }
  }
  async getEvolutionArchiveById(archive_id) {
    try {
      const query = `
        SELECT * FROM archives WHERE archive_id = '${archive_id}'
      `;

      return await db.oneOrNone(query);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Evolutions;
