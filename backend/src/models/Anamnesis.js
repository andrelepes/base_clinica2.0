const db = require('../database/database');
class Anamnesis {
  async findByPatientId(tipousuario, pacienteId) {
    try {
      const isClinica = tipousuario === 'clinica';
      const query = `
      WITH SignCTE AS (
        SELECT 
          a.anamnesis_id,
          (SELECT count(*) FROM anamnesis_sign WHERE status = true AND anamnesis_id = a.anamnesis_id) as signatures,
          json_agg(
            json_build_object(
              'anamnesis_sign_id',
              asgn.anamnesis_sign_id,
              'status',
              asgn.status,
              'nome_usuario',
              (
                SELECT nome_usuario
                FROM usuarios
                WHERE usuario_id = asgn.usuario_id
              ),
              'signed_at',
              asgn.signed_at
            )
          ) FILTER (
            WHERE asgn.anamnesis_sign_id IS NOT NULL
          ) AS anamnesis_signs
        FROM anamnesis a
          LEFT JOIN anamnesis_sign asgn ON a.anamnesis_id = asgn.anamnesis_id
        GROUP BY a.anamnesis_id
      )${
        isClinica
          ? `, ChangelogCTE AS (
          SELECT a.anamnesis_id,
            json_agg(
              json_build_object(
                'nome_modificador',
                (
                  SELECT nome_usuario
                  FROM usuarios
                  WHERE usuario_id = ac.usuario_id
                ),
                'data_atualizacao',
                ac.updated_at,
                'dados_antigos',
                ac.old_record
              )
            ) FILTER (
              WHERE ac.anamnesis_id IS NOT NULL
            ) AS anamnesis_changelog
          FROM anamnesis a
            LEFT JOIN anamnesis_changelog ac ON a.anamnesis_id = ac.anamnesis_id
          GROUP BY a.anamnesis_id
        )`
          : ''
      }
      SELECT 
        an.*, 
        u.nome_usuario,
        COALESCE(sc.anamnesis_signs, '[]') AS anamnesis_signs${
          isClinica
            ? `, COALESCE(logc.anamnesis_changelog, '[]') AS anamnesis_changelog`
            : ``
        }
      FROM 
        anamnesis AS an 
      JOIN 
        usuarios AS u ON an.usuario_id = u.usuario_id 
      LEFT JOIN 
        SignCTE sc ON an.anamnesis_id = sc.anamnesis_id
      ${
        isClinica
          ? `LEFT JOIN
            ChangelogCTE logc ON an.anamnesis_id = logc.anamnesis_id`
          : ''
      }  
      WHERE 
        an.paciente_id = \${pacienteId}
      `;
      return db.oneOrNone(query, { pacienteId });
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(usuarioId) {
    try {
      return db.any('SELECT * FROM anamnesis WHERE usuario_id = ${usuarioId}', {
        usuarioId,
      });
    } catch (error) {
      throw error;
    }
  }
  async findById(anamnesisId) {
    try {
      return db.any(
        'SELECT * FROM anamnesis WHERE anamnesis_id = ${anamnesisId}',
        {
          anamnesisId,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async create(anamnesisData) {
    try {
      return db.none(
        'INSERT INTO anamnesis (usuario_id, paciente_id, marital_status, care_modality, gender, occupation, education_level, socioeconomic_level, special_needs, referred_by, undergoing_treatment, treatment_expectation, diagnosis, healthy_life_habits, relevant_information) VALUES (${usuario_id}, ${paciente_id}, ${marital_status}, ${care_modality}, ${gender}, ${occupation}, ${education_level}, ${socioeconomic_level}, ${special_needs}, ${referred_by}, ${undergoing_treatment}, ${treatment_expectation}, ${diagnosis}, ${healthy_life_habits}, ${relevant_information})',
        anamnesisData
      );
    } catch (error) {
      throw error;
    }
  }

  async update(anamnesisId, anamnesisData) {
    try {
      return db.none(
        'UPDATE anamnesis SET usuario_id = ${usuario_id}, paciente_id = ${paciente_id}, marital_status = ${marital_status}, care_modality = ${care_modality}, gender = ${gender}, occupation = ${occupation}, education_level = ${education_level}, socioeconomic_level = ${socioeconomic_level}, special_needs = ${special_needs}, referred_by = ${referred_by}, undergoing_treatment = ${undergoing_treatment}, treatment_expectation = ${treatment_expectation}, diagnosis = ${diagnosis}, healthy_life_habits = ${healthy_life_habits}, relevant_information = ${relevant_information} WHERE anamnesis_id = ${anamnesisId}',
        { anamnesisId, ...anamnesisData }
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(anamnesisId) {
    try {
      return db.none(
        'DELETE FROM anamnesis WHERE anamnesis_id = ${anamnesisId}',
        { anamnesisId }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateWithHistory(anamnesisId, anamnesisData, oldRegister) {
    const insertChangelogQuery = `
      INSERT INTO anamnesis_changelog (
        anamnesis_id,
        old_record,
        usuario_id 
      ) VALUES (
        ${anamnesisId},
        '${oldRegister}',
        ${anamnesisData.usuario_id}
      )
    `;
    const updateAnamnesisQuery = `
    UPDATE 
      anamnesis 
    SET 
      usuario_id = \${usuario_id},
      paciente_id = \${paciente_id},
      marital_status = \${marital_status},
      care_modality = \${care_modality},
      gender = \${gender},
      occupation = \${occupation},
      education_level = \${education_level},
      socioeconomic_level = \${socioeconomic_level},
      special_needs = \${special_needs},
      referred_by = \${referred_by},
      undergoing_treatment = \${undergoing_treatment},
      treatment_expectation = \${treatment_expectation},
      diagnosis = \${diagnosis},
      healthy_life_habits = \${healthy_life_habits},
      relevant_information = \${relevant_information} 
    WHERE 
      anamnesis_id = \${anamnesisId}; 
    UPDATE 
      anamnesis_sign 
    SET 
      status = false 
    WHERE 
      anamnesis_id = \${anamnesisId}`;
    try {
      await db.tx(async (t) => {
        await t.none(insertChangelogQuery);
        await t.none(updateAnamnesisQuery, { anamnesisId, ...anamnesisData });
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAnamnesisSignature(usuario_id, anamnesis_id) {
    const query = `SELECT * FROM anamnesis_sign WHERE usuario_id = ${usuario_id} AND anamnesis_id = ${anamnesis_id}`;

    try {
      return await db.oneOrNone(query);
    } catch (error) {
      throw error;
    }
  }

  async signAnamnesis(
    usuario_id,
    anamnesis_id,
    signatureId,
    signature_status = false
  ) {
    const query = signature_status
      ? `UPDATE anamnesis_sign SET status = ${signature_status} WHERE anamnesis_sign_id = '${signatureId}'`
      : `INSERT INTO anamnesis_sign (usuario_id, anamnesis_id, anamnesis_sign_id, status) VALUES (${usuario_id}, ${anamnesis_id}, '${signatureId}', ${true})`;

    try {
      await db.none(query);
    } catch (error) {
      throw error;
    }
  }

  async getAnamnesisDataToPDFDocument(anamnesis_id) {
    const query = `
    WITH SignCTE AS (
      SELECT 
        a.anamnesis_id,
        (SELECT count(*) FROM anamnesis_sign WHERE status = true AND anamnesis_id = a.anamnesis_id) as signatures,
        json_agg(
          json_build_object(
            'anamnesis_sign_id', asgn.anamnesis_sign_id,
            'status', asgn.status,
            'nome_usuario', (
              SELECT nome_usuario
              FROM usuarios
              WHERE usuario_id = asgn.usuario_id
            ),
            'signed_at', TO_CHAR(asgn.signed_at, 'DD "de" TMMonth "de" YYYY "às" HH24:MI')
          )
        ) FILTER (
          WHERE asgn.anamnesis_sign_id IS NOT NULL
        ) AS anamnesis_signs
      FROM anamnesis a
        LEFT JOIN anamnesis_sign asgn ON a.anamnesis_id = asgn.anamnesis_id
      GROUP BY a.anamnesis_id
    ),
    PatientCTE as (
      SELECT 
        p.paciente_id, 
        TO_CHAR(p.data_nascimento_paciente,'DD/MM/YYYY') as data_nascimento_paciente, 
        row_to_json(p) AS patient_data 
      FROM 
        pacientes p 
      GROUP BY 
        p.paciente_id
    )
    SELECT 
      u.nome_usuario,
      an.marital_status,
      an.gender,
      an.socioeconomic_level,
      an.occupation,
      an.education_level,
      an.care_modality,
      an.special_needs,
      an.referred_by,
      an.relevant_information,
      pcte.data_nascimento_paciente, 
      string_to_array(an.treatment_expectation, ',') as treatment_expectation,
      string_to_array(an.undergoing_treatment, ',') as undergoing_treatment,
      string_to_array(an.diagnosis, ',') as diagnosis,
      string_to_array(an.healthy_life_habits, ',') as healthy_life_habits,
      COALESCE(sc.anamnesis_signs, '[]') AS anamnesis_signs,
      COALESCE(pcte.patient_data, '{}') AS patient_data
    FROM 
      anamnesis AS an 
    JOIN 
      usuarios AS u ON an.usuario_id = u.usuario_id 
    LEFT JOIN 
      SignCTE sc ON an.anamnesis_id = sc.anamnesis_id
    LEFT JOIN
      PatientCTE pcte ON an.paciente_id = pcte.paciente_id
    WHERE 
      an.anamnesis_id = \${anamnesis_id}
    `;
    try {
      return await db.oneOrNone(query, { anamnesis_id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Anamnesis;
