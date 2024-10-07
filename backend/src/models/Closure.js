const db = require('../database/database');
class Closure {
  async findByPatientId(tipousuario, pacienteId) {
    try {
      const isClinica = tipousuario === 'clinica';
      const query = `
      WITH SignCTE AS (
        SELECT 
          pc.patient_closure_id,
          (SELECT count(*) FROM patient_closure_sign WHERE status = true AND patient_closure_id = pc.patient_closure_id) as signatures,
          json_agg(
            json_build_object(
              'patient_closure_sign_id',
              pcsgn.patient_closure_sign_id,
              'status',
              pcsgn.status,
              'nome_usuario',
              (
                SELECT nome_usuario
                FROM usuarios
                WHERE usuario_id = pcsgn.usuario_id
              ),
              'signed_at',
              pcsgn.signed_at
            )
          ) FILTER (
            WHERE pcsgn.patient_closure_sign_id IS NOT NULL
          ) AS patient_closure_signs
        FROM patient_closure pc
          LEFT JOIN patient_closure_sign pcsgn ON pc.patient_closure_id = pcsgn.patient_closure_id
        GROUP BY pc.patient_closure_id
      )${
        isClinica
          ? `, ChangelogCTE AS (
          SELECT pc.patient_closure_id,
            json_agg(
              json_build_object(
                'nome_modificador',
                (
                  SELECT nome_usuario
                  FROM usuarios
                  WHERE usuario_id = pclog.usuario_id
                ),
                'data_atualizacao',
                pclog.updated_at,
                'dados_antigos',
                pclog.old_record
              )
            ) FILTER (
              WHERE pclog.patient_closure_id IS NOT NULL
            ) AS patient_closure_changelog
          FROM patient_closure pc
            LEFT JOIN patient_closure_changelog pclog ON pc.patient_closure_id = pclog.patient_closure_id
          GROUP BY pc.patient_closure_id
        )`
          : ''
      }
      SELECT 
        pc.*, 
        u.nome_usuario,
        COALESCE(sc.patient_closure_signs, '[]') AS patient_closure_signs${
          isClinica
            ? `, COALESCE(logc.patient_closure_changelog, '[]') AS patient_closure_changelog`
            : ``
        }
      FROM 
        patient_closure AS pc 
      JOIN 
        usuarios AS u ON pc.usuario_id = u.usuario_id 
      LEFT JOIN 
        SignCTE sc ON pc.patient_closure_id = sc.patient_closure_id
      ${
        isClinica
          ? `LEFT JOIN
            ChangelogCTE logc ON pc.patient_closure_id = logc.patient_closure_id`
          : ''
      }  
      WHERE 
        pc.paciente_id = \${pacienteId}
      `;
      return db.oneOrNone(query, { pacienteId });
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(usuarioId) {
    try {
      return db.any(
        'SELECT * FROM patient_closure WHERE usuario_id = ${usuarioId}',
        {
          usuarioId,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async findById(closureId) {
    try {
      return db.any(
        'SELECT * FROM patient_closure WHERE patient_closure_id = ${closureId}',
        {
          closureId,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async create(patientClosureData) {
    try {
      return db.none(
        'INSERT INTO patient_closure (usuario_id, paciente_id, case_status, overall_results_evaluation, initial_expectations_met, treatment_duration_sessions, healthy_life_habits_acquired, additional_relevant_information) VALUES (${usuario_id}, ${paciente_id}, ${case_status}, ${overall_results_evaluation}, ${initial_expectations_met}, ${treatment_duration_sessions}, ${healthy_life_habits_acquired}, ${additional_relevant_information})',
        patientClosureData
      );
    } catch (error) {
      throw error;
    }
  }

  async update(patientClosureId, patientClosureData) {
    try {
      return db.none(
        'UPDATE patient_closure SET usuario_id = ${usuario_id}, paciente_id = ${paciente_id}, case_status = ${case_status}, overall_results_evaluation = ${overall_results_evaluation}, initial_expectations_met = ${initial_expectations_met}, treatment_duration_sessions = ${treatment_duration_sessions}, healthy_life_habits_acquired = ${healthy_life_habits_acquired}, additional_relevant_information = ${additional_relevant_information}  WHERE patient_closure_id = ${patientClosureId}',
        { patientClosureId, ...patientClosureData }
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(patientClosureId) {
    try {
      return db.none(
        'DELETE FROM patient_closure WHERE patient_closure_id = ${patientClosureId}',
        { patientClosureId }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateWithHistory(closureId, closureData, oldRegister) {
    const insertChangelogQuery = `
      INSERT INTO patient_closure_changelog (
        patient_closure_id,
        old_record,
        usuario_id 
      ) VALUES (
        ${closureId},
        '${oldRegister}',
        ${closureData.usuario_id}
      )
    `;
    const updateClosureQuery = `
    UPDATE 
      patient_closure 
    SET 
      usuario_id = \${usuario_id},
      paciente_id = \${paciente_id}, 
      case_status = \${case_status}, 
      overall_results_evaluation = \${overall_results_evaluation}, 
      initial_expectations_met = \${initial_expectations_met}, 
      treatment_duration_sessions = \${treatment_duration_sessions}, 
      healthy_life_habits_acquired = \${healthy_life_habits_acquired}, 
      additional_relevant_information = \${additional_relevant_information}
    WHERE 
      patient_closure_id = \${closureId}; 
    UPDATE 
      patient_closure_sign 
    SET 
      status = false 
    WHERE 
      patient_closure_id = \${closureId}`;
    try {
      await db.tx(async (t) => {
        await t.none(insertChangelogQuery);
        await t.none(updateClosureQuery, { closureId, ...closureData });
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findClosureSignature(usuario_id, closure_id) {
    const query = `SELECT * FROM patient_closure_sign WHERE usuario_id = ${usuario_id} AND patient_closure_id = ${closure_id}`;
    try {
      return await db.oneOrNone(query);
    } catch (error) {
      throw error;
    }
  }

  async signClosure(
    usuario_id,
    closure_id,
    signatureId,
    signature_status = false
  ) {
    const query = signature_status
      ? `UPDATE patient_closure_sign SET status = ${signature_status} WHERE patient_closure_sign_id = '${signatureId}'`
      : `INSERT INTO patient_closure_sign (usuario_id, patient_closure_id, patient_closure_sign_id, status) VALUES (${usuario_id}, ${closure_id}, '${signatureId}', ${true})`;
    try {
      await db.none(query);
    } catch (error) {
      throw error;
    }
  }

  async getClosureDataToPDFDocument(closure_id) {
    const query = `
    WITH SignCTE AS (
      SELECT 
        pc.patient_closure_id,
        (SELECT count(*) FROM patient_closure_sign WHERE status = true AND patient_closure_id = pc.patient_closure_id) as signatures,
        json_agg(
          json_build_object(
            'closure_sign_id', pcsgn.patient_closure_sign_id,
            'status', pcsgn.status,
            'nome_usuario', (
              SELECT nome_usuario
              FROM usuarios
              WHERE usuario_id = pcsgn.usuario_id
            ),
            'signed_at', TO_CHAR(pcsgn.signed_at, 'DD "de" TMMonth "de" YYYY "às" HH24:MI')
          )
        ) FILTER (
          WHERE pcsgn.patient_closure_sign_id IS NOT NULL
        ) AS closure_signs
      FROM patient_closure pc
        LEFT JOIN patient_closure_sign pcsgn ON pc.patient_closure_id = pcsgn.patient_closure_id
      GROUP BY pc.patient_closure_id
    )
    SELECT 
      pc.case_status,
      pc.overall_results_evaluation,
      string_to_array(pc.initial_expectations_met, ',') as initial_expectations_met,
      treatment_duration_sessions,
      string_to_array(pc.healthy_life_habits_acquired, ',') as healthy_life_habits_acquired,
      pc.additional_relevant_information,
      TO_CHAR(pc.created_at, 'DD/MM/YYYY "às" HH24:MI') as created_at,
      (SELECT nome_paciente FROM pacientes p WHERE p.paciente_id = pc.paciente_id),
      u.nome_usuario,
      COALESCE(sc.closure_signs, '[]') AS closure_signs
    FROM 
      patient_closure AS pc 
    JOIN 
      usuarios AS u ON pc.usuario_id = u.usuario_id 
    LEFT JOIN 
      SignCTE sc ON pc.patient_closure_id = sc.patient_closure_id
    WHERE 
      pc.patient_closure_id = \${closure_id}
    `;
    try {
      return await db.oneOrNone(query, { closure_id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Closure;
