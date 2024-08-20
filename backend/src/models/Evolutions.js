const db = require('../database/database');

class Evolutions {
  async findAllByPatientId(tipousuario, patientId) {
    const isClinica = tipousuario === 'clinica';
    const query = `
    WITH ArchiveCTE AS (
      SELECT e.evolution_id,
        json_agg(
          json_build_object(
            'archive_id',
            arc.archive_id,
            'archive_name',
            arc.archive_name,
            'archive_mime_type',
            arc.archive_mime_type,
            'created_at',
            arc.created_at
          )
        ) FILTER (
          WHERE arc.archive_id IS NOT NULL
        ) AS archive
      FROM evolutions e
        LEFT JOIN archives arc ON e.evolution_id = arc.evolution_id
      GROUP BY e.evolution_id
    ),
    SignCTE AS (
      SELECT 
        e.evolution_id,
        (SELECT count(*) FROM evolution_sign WHERE status = true AND evolution_id = e.evolution_id) as signatures,
        json_agg(
          json_build_object(
            'evolution_sign_id',
            esgn.evolution_sign_id,
            'status',
            esgn.status,
            'nome_usuario',
            (
              SELECT nome_usuario
              FROM usuarios
              WHERE usuario_id = esgn.usuario_id
            ),
            'signed_at',
            esgn.signed_at
          )
        ) FILTER (
          WHERE esgn.evolution_sign_id IS NOT NULL
        ) AS evolution_signs
      FROM evolutions e
        LEFT JOIN evolution_sign esgn ON e.evolution_id = esgn.evolution_id
      GROUP BY e.evolution_id
    )${
      isClinica
        ? `, ChangelogCTE AS (
        SELECT e.evolution_id,
          json_agg(
            json_build_object(
              'nome_modificador',
              (
                SELECT nome_usuario
                FROM usuarios
                WHERE usuario_id = ec.usuario_id
              ),
              'data_atualizacao',
              ec.updated_at,
              'dados_antigos',
              ec.old_record
            )
          ) FILTER (
            WHERE ec.evolution_id IS NOT NULL
          ) AS evolution_changelog
        FROM evolutions e
          LEFT JOIN evolution_changelog ec ON e.evolution_id = ec.evolution_id
        GROUP BY e.evolution_id
      )`
        : ''
    }
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
      sc.signatures,
      COALESCE(ac.archive, '[]') AS archive,
      COALESCE(sc.evolution_signs, '[]') AS evolution_signs${
        isClinica
          ? `, COALESCE(logc.evolution_changelog, '[]') AS evolution_changelog`
          : ``
      }
    FROM 
      evolutions e
    INNER JOIN 
      agendamentos a ON e.agendamento_id = a.agendamento_id
    LEFT JOIN 
      ArchiveCTE ac ON e.evolution_id = ac.evolution_id
    LEFT JOIN 
      SignCTE sc ON e.evolution_id = sc.evolution_id
    ${
      isClinica
        ? `LEFT JOIN
          ChangelogCTE logc ON e.evolution_id = logc.evolution_id`
        : ''
    }     
    WHERE 
      e.paciente_id = ${patientId}`;
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
          AND usuario_id = \${usuario_id};
        UPDATE 
          evolution_sign
        SET 
          status = false
        WHERE 
          evolution_id = ${evolutionId};
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
        (archive_id, archive_name, archive_localization, archive_mime_type, evolution_id) 
      VALUES
        ('${archive_id}', '${archive_name}', '${archive_localization}', '${archive_mime_type}', ${evolution_id})
        `;
      const updateQuery = `
      UPDATE evolutions
      SET archive_id = '${archive_id}'
      WHERE evolution_id = ${evolution_id};
      UPDATE evolution_sign
      SET status = false
      WHERE evolution_id = ${evolution_id};
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

  async deleteEvolutionArchiveById(archive_id) {
    try {
      const query = `
        DELETE FROM archives WHERE archive_id = '${archive_id}'
      `;
      await db.none(query);
    } catch (error) {
      throw error;
    }
  }

  async findEvolutionSignature(usuario_id, evolution_id) {
    const query = `SELECT * FROM evolution_sign WHERE usuario_id = ${usuario_id} AND evolution_id = ${evolution_id}`;

    try {
      return await db.oneOrNone(query);
    } catch (error) {
      throw error;
    }
  }
  async signEvolution(
    usuario_id,
    evolution_id,
    signatureId,
    signature_status = false
  ) {
    const query = signature_status
      ? `UPDATE evolution_sign SET status = ${signature_status} WHERE evolution_sign_id = '${signatureId}'`
      : `INSERT INTO evolution_sign (usuario_id, evolution_id, evolution_sign_id, status) VALUES (${usuario_id}, ${evolution_id}, '${signatureId}', ${true})`;

    try {
      await db.none(query);
    } catch (error) {
      throw error;
    }
  }

  async getEvolutionDataToPDFDocument(evolution_id) {
    const query = `
    WITH SignCTE AS (
      SELECT
        e.evolution_id,
        (SELECT count(*) FROM evolution_sign WHERE status = true AND evolution_id = e.evolution_id) as signatures,
        json_agg(
          json_build_object(
            'evolution_sign_id',
            esgn.evolution_sign_id,
            'status',
            esgn.status,
            'nome_usuario',
            (
              SELECT nome_usuario
              FROM usuarios
              WHERE usuario_id = esgn.usuario_id
            ),
            'signed_at',
            TO_CHAR(esgn.signed_at, 'DD "de" TMMonth "de" YYYY "às" HH24:MI')
            
          )
        ) FILTER (
          WHERE esgn.evolution_sign_id IS NOT NULL
        ) AS evolution_signs
      FROM evolutions e
        LEFT JOIN evolution_sign esgn ON e.evolution_id = esgn.evolution_id
      GROUP BY e.evolution_id
    )
    SELECT
      e.evolution_id,
      e.usuario_id,
      e.paciente_id,
      (SELECT title FROM attended_options WHERE id = e.attendance_status) as attendance_status,
      (SELECT title FROM punctuality_options WHERE id = e.punctuality_status) as punctuality_status,      
      e.arrival_mood_state,
      e.discussion_topic,
      e.analysis_intervention,
      e.next_session_plan,
      e.departure_mood_state,
      e.therapist_notes,
      e.evolution_status,
      TO_CHAR(a.data_hora_inicio, 'DD "de" TMMonth "de" YYYY "às" HH24:MI') AS session_date,
      sc.signatures,
      TO_CHAR(now(), 'DD "de" TMMonth "de" YYYY "às" HH24:MI') AS now,
      COALESCE(sc.evolution_signs, '[]') AS evolution_signs
    FROM
      evolutions e
    INNER JOIN
      agendamentos a ON e.agendamento_id = a.agendamento_id
    LEFT JOIN
      SignCTE sc ON e.evolution_id = sc.evolution_id

    WHERE
      e.evolution_id = ${evolution_id}
    `;
    try {
      return await db.oneOrNone(query);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Evolutions;
