const db = require('../database/database'); // Ajuste o caminho conforme necessário

class Agendamentos {
    // Método para inserir um novo agendamento
    static async inserirAgendamento(agendamento) {
        const query = `
            INSERT INTO agendamentos (
                paciente_id, 
                usuario_id, 
                data_hora_inicio, 
                status, 
                notas_agendamento, 
                consultorio_id, 
                data_hora_fim, 
                historico, 
                tipo_sessao, 
                recorrencia
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;

        try {
            await db.none(query, [
                agendamento.paciente_id,
                agendamento.usuario_id,
                agendamento.data_hora_inicio,
                agendamento.status,
                agendamento.notas_agendamento,
                agendamento.consultorio_id,
                agendamento.data_hora_fim,
                agendamento.historico,
                agendamento.tipo_sessao,
                agendamento.recorrencia
            ]);
            return { success: true, message: 'Agendamento registrado com sucesso!' };
        } catch (error) {
            console.error('Erro ao inserir agendamento:', error);
            return { success: false, message: 'Erro ao inserir agendamento' };
        }
    }
    static async isPacienteAssociatedToPsicologo(pacienteId, usuarioId) {
        const query = `
            SELECT COUNT(*) FROM pacientes 
            WHERE paciente_id = $1 AND usuario_id = $2
        `;

        try {
            const count = await db.one(query, [pacienteId, usuarioId]);
            return parseInt(count.count) > 0;
        } catch (error) {
            console.error('Erro ao verificar associação entre paciente e psicólogo:', error);
            return false;
        }
    }

    static async isPacienteAssociatedToClinica(pacienteId, clinicaId) {
        const query = `
            SELECT COUNT(*) FROM pacientes 
            WHERE paciente_id = $1 AND clinica_id = $2
        `;

        try {
            const result = await db.one(query, [pacienteId, clinicaId]);
            return parseInt(result.count) > 0;
        } catch (error) {
            console.error('Erro ao verificar associação entre paciente e clínica:', error);
            return false; // Se houver erro na query, retorna false por padrão
        }
    }
    static async isUserAssociatedToClinica(usuarioId, clinicaId) {
        const query = `
            SELECT COUNT(*) FROM usuarios 
            WHERE usuario_id = $1 AND clinica_id = $2
        `;

        try {
            const result = await db.one(query, [usuarioId, clinicaId]);
            return parseInt(result.count) > 0;
        } catch (error) {
            console.error('Erro ao verificar associação entre usuário e clínica:', error);
            return false;
        }
    }
        // Método para listar todos os agendamentos
        static async listarTodos() {
            try {
                return await db.any('SELECT * FROM agendamentos');
            } catch (error) {
                console.error('Erro ao listar todos os agendamentos:', error);
                throw error; // Propaga o erro para ser tratado pelo controlador
            }
        }
    
        // Método para buscar um agendamento pelo ID
        static async buscarPorId(agendamentoId) {
            try {
                return await db.oneOrNone('SELECT * FROM agendamentos WHERE agendamento_id = $1', agendamentoId);
            } catch (error) {
                console.error('Erro ao buscar agendamento por ID:', error);
                throw error; // Propaga o erro para ser tratado pelo controlador
            }
        }
        static async atualizarAgendamento(agendamentoId, dadosAtualizacao) {
            // Constrói um objeto com os campos que serão atualizados, ignorando os campos undefined
            const camposAtualizados = {};
            for (const campo in dadosAtualizacao) {
                if (dadosAtualizacao[campo] !== undefined) {
                    camposAtualizados[campo] = dadosAtualizacao[campo];
                }
            }
        
            // Monta a consulta com base nos campos que realmente serão atualizados
            const setQueryPart = Object.keys(camposAtualizados)
                .map((campo, idx) => `${campo} = $${idx + 2}`)
                .join(', ');
        
            const query = `
                UPDATE agendamentos SET ${setQueryPart}
                WHERE agendamento_id = $1
            `;
        
            // Monta o array de valores para a consulta SQL
            const valores = [agendamentoId, ...Object.values(camposAtualizados)];
        
            try {
                await db.none(query, valores);
            } catch (error) {
                console.error('Erro ao atualizar agendamento:', error);
                throw error;
            }
        }
    
        static async deletarAgendamento(agendamentoId) {
            const query = `
                DELETE FROM agendamentos
                WHERE agendamento_id = $1
            `;
    
            try {
                await db.none(query, [agendamentoId]);
            } catch (error) {
                console.error('Erro ao deletar agendamento:', error);
                throw error; // Propaga o erro para ser tratado pelo controlador
            }
        }

        static async getAppointmentsByPatientId(pacienteId) {
            try {
                return await db.any('SELECT * FROM agendamentos WHERE paciente_id = ${pacienteId}', pacienteId);
            } catch (error) {
                throw error;
            }
        }
        static async getNextAppointmentByPatientId(pacienteId) {
            try {
                return await db.oneOrNone(`
                    SELECT 
                        agendamentos.agendamento_id,                     
                        consultorios.nome_consultorio,
                        (agendamentos.data_hora_inicio AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as data_hora_inicio,
                        (agendamentos.data_hora_fim AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo') as data_hora_fim,
                        agendamentos.recorrencia,
                        agendamentos.status,
                        agendamentos.tipo_sessao,
                        agendamentos.usuario_id
                    FROM 
                        agendamentos
                    INNER JOIN consultorios
                        ON agendamentos.consultorio_id = consultorios.consultorio_id
                    WHERE 
                        agendamentos.paciente_id = $1 AND 
                        agendamentos.data_hora_inicio > NOW()
                    ORDER BY 
                        agendamentos.data_hora_inicio ASC
                    LIMIT 1
                `, [pacienteId]);
            } catch (error) {
                throw error;
            }
        }
        
        static async getAppointmentsByOfficeId(consultorio_id){
            try {
                const query = `
                    SELECT 
                        a.agendamento_id,
                        p.nome_paciente AS nome_paciente,
                        u.nome_usuario AS nome_usuario,
                        a.data_hora_inicio,
                        a.status,
                        a.consultorio_id,
                        c.nome_consultorio,
                        a.data_hora_fim,
                        a.recorrencia,
                        a.tipo_sessao
                    FROM 
                        agendamentos a
                    INNER JOIN pacientes p ON a.paciente_id = p.paciente_id
                    INNER JOIN usuarios u ON a.usuario_id = u.usuario_id
                    INNER JOIN consultorios c ON a.consultorio_id = c.consultorio_id
                    WHERE a.consultorio_id = ${consultorio_id}
                    ORDER BY a.consultorio_id
                `;
                return await db.any(query);
            } catch (error) {
                throw error;
            }
        }
        static async getAppointmentsByUserId(userId){
            try {
                const query = `
                    SELECT 
                        a.agendamento_id,
                        p.nome_paciente AS nome_paciente,
                        u.nome_usuario AS nome_usuario,
                        a.data_hora_inicio,
                        a.status,
                        a.consultorio_id,
                        c.nome_consultorio,
                        a.data_hora_fim,
                        a.recorrencia,
                        a.tipo_sessao
                    FROM 
                        agendamentos a
                    INNER JOIN pacientes p ON a.paciente_id = p.paciente_id
                    INNER JOIN usuarios u ON a.usuario_id = u.usuario_id
                    INNER JOIN consultorios c ON a.consultorio_id = c.consultorio_id
                    WHERE a.usuario_id = ${userId}
                    ORDER BY a.data_hora_inicio
                `;
                return await db.any(query);
            } catch (error) {
                throw error;
            }
        }
        static async getAppointmentsByClinicId(clinicId){
            try {
                const query = `
                    SELECT 
                        a.agendamento_id,
                        p.paciente_id,
                        p.nome_paciente AS nome_paciente,
                        u.nome_usuario AS nome_usuario,
                        a.data_hora_inicio,
                        a.status,
                        a.consultorio_id,
                        c.nome_consultorio,
                        a.data_hora_fim,
                        a.recorrencia,
                        a.tipo_sessao
                    FROM 
                        agendamentos a
                    INNER JOIN pacientes p ON a.paciente_id = p.paciente_id
                    INNER JOIN usuarios u ON a.usuario_id = u.usuario_id
                    INNER JOIN consultorios c ON a.consultorio_id = c.consultorio_id
                    WHERE u.clinica_id  = ${clinicId}
                    ORDER BY a.consultorio_id
                `;
                return await db.any(query);
            } catch (error) {
                throw error;
            }
        }

        static async getNextAppointmentByClinicId(clinicId){
            try {
                const query = `
                    SELECT 
                        a.agendamento_id,                        
                        a.data_hora_inicio,                        
                        a.consultorio_id,
                        c.nome_consultorio,
                        a.data_hora_fim,
                        u.usuario_id,
                        p.paciente_id
                    FROM 
                        agendamentos a
                    INNER JOIN pacientes p ON a.paciente_id = p.paciente_id
                    INNER JOIN usuarios u ON a.usuario_id = u.usuario_id
                    INNER JOIN consultorios c ON a.consultorio_id = c.consultorio_id
                    WHERE 
                        u.clinica_id  = ${clinicId} AND
                        a.data_hora_inicio > NOW()
                    ORDER BY 
                        a.consultorio_id,
                        a.data_hora_inicio ASC
                `;
                return await db.any(query);
            } catch (error) {
                throw error;
            }
        }
        static async createWithRecurrency({paciente_id, usuario_id, data_hora_inicio, status, consultorio_id, weekInterval, tipo_sessao, recorrencia}){
            try {
                const query = `
                    INSERT INTO
                        agendamentos (
                            paciente_id,
                            usuario_id,
                            data_hora_inicio,
                            status,
                            consultorio_id,
                            data_hora_fim,
                            tipo_sessao,
                            recorrencia
                        )
                    SELECT
                        ${paciente_id},
                        ${usuario_id},
                        gs,
                        '${status}',
                        ${consultorio_id},
                        gs + interval '${tipo_sessao} minutes',
                        ${tipo_sessao},
                        '${recorrencia}'
                    FROM
                        generate_series(
                            '${data_hora_inicio}'::timestamp,
                        (
                            date_trunc('year', current_date) + interval '1 year' - interval '1 day'
                        )::timestamp,
                            '${weekInterval} days'::interval
                        ) AS gs;
                `;
                return await db.none(query);
            } catch (error) {
                throw error;
            }
        }

}

module.exports = Agendamentos;

