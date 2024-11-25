const db = require('../database/database');

class Payments {
  async findByPaymentId(paymentId) {
    try {
      const query = `
            SELECT * FROM payments WHERE payment_id = $1
         `;
      return db.oneOrNone(query, { paymentId });
    } catch (error) {
      throw error;
    }
  }
  async findByClinicId(clinicId) {
    try {
      const query = `
            SELECT * FROM payments WHERE clinic_id = $1
         `;
      return db.oneOrNone(query, { clinicId });
    } catch (error) {
      throw error;
    }
  }

  async findByYear(clinicId) {
    const query = `
    WITH
      pagamentos_por_paciente AS (
        SELECT
          EXTRACT(
            YEAR
            FROM
              created_at
          ) AS ano,
          TO_CHAR(created_at, 'TMMonth') AS mes,
          TO_CHAR(created_at, 'MM') AS mes_numero,
          paciente_id,
          (
            SELECT
              nome_paciente
            FROM
              pacientes p
            WHERE
              p.paciente_id = pay.paciente_id
          ) AS nome_paciente,
          (
            SELECT
              nome_usuario
            FROM
              usuarios u
            WHERE
              u.usuario_id = pay.psicologo_id
          ) AS nome_psicologo,
          jsonb_build_object(
            'payment_id',
            payment_id,
            'created_at',
            created_at,
            'payment_status',
            payment_status,
            'payment_code',
            payment_code,
            'payment_url',
            payment_url,
            'payment_qr_code',
            payment_qr_code,
            'clinica_id',
            clinica_id,
            'updated_at',
            updated_at,
            'price',
            price,
            'mercado_id',
            mercado_id,
            'expires_in',
            expires_in
          ) AS dados_pagamento,
          CASE
            WHEN payment_status = 'pending' THEN 0
            ELSE price
          END AS price
        FROM
          public.payments pay
        WHERE
          clinica_id = \${clinicId}
        ORDER BY
          pay.created_at ASC
      ),
      agregacao_por_mes AS (
        SELECT
          ano,
          mes,
          mes_numero,
          jsonb_agg(
            jsonb_build_object(
              'paciente_id',
              paciente_id,
              'dados_pagamento',
              dados_pagamento,
              'nome_paciente',
              nome_paciente,
              'nome_psicologo',
              nome_psicologo
            )
          ) AS pacientes,
          SUM(price) AS total_price_mes,
          COUNT(paciente_id) AS count_pagamentos_mes
        FROM
          pagamentos_por_paciente
        GROUP BY
          ano,
          mes,
          mes_numero
        ORDER BY
          ano, mes_numero::integer ASC
      ),
      agregacao_por_ano AS (
        SELECT
          ano,
          jsonb_agg(
            jsonb_build_object(
              'pacientes',
              pacientes,
              'mes',
              mes,
              'total_price_mes',
              total_price_mes,
              'count_pagamentos_mes',
              count_pagamentos_mes
            )
          ) AS meses,
          SUM(total_price_mes) AS total_price_ano,
          SUM(count_pagamentos_mes) AS count_pagamentos_ano
        FROM
          agregacao_por_mes
        GROUP BY
          ano
      )
    SELECT
      jsonb_agg(
        jsonb_build_object(
          'meses',
          meses,
          'ano',
          ano,
          'total_price_ano',
          total_price_ano,
          'count_pagamentos_ano',
          count_pagamentos_ano
        )
      ) AS resultado
    FROM
      agregacao_por_ano;
    `;
    return db.manyOrNone(query, { clinicId });
  }

  async createPayment(clinicId, patientId, paymentData) {
    try {
      const query = `
        INSERT INTO 
          payments (
            payment_id, 
            paciente_id, 
            clinica_id, 
            payment_code, 
            payment_url, 
            payment_qr_code, 
            payment_status,
            price,
            mercado_id,
            psicologo_id,
            expires_in
          )
        VALUES (
          \${payment_id}, 
          \${patientId}, 
          \${clinicId}, 
          \${pix_code}, 
          \${pix_url}, 
          \${qr_code}, 
          \${status},
          \${amount},
          \${mercado_id},
          \${psicologo_id},
          \${expiresIn}
        )`;

      await db.none(query, { patientId, clinicId, ...paymentData });
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(paymentId, status) {
    try {
      const query = `
        UPDATE
          payments
        SET
          status = \${status},
          updated_at = NOW(),
        WHERE 
          payment_id = \${paymentId}
      `;
      await db.none(query, { paymentId, status });
    } catch (error) {
      throw error;
    }
  }

  async getMonthlyFeeByClinicId(clinicId) {
    try {
      return await db.oneOrNone(
        'SELECT monthly_fee, expires_in_day FROM usuarios WHERE usuario_id = ${clinicId}',
        { clinicId }
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Payments;
