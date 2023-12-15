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

}

module.exports = Agendamentos;

