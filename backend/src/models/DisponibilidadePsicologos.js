const db = require('../database/database'); // Ajuste o caminho conforme necessário

class DisponibilidadePsicologos {
    // Método para inserir nova disponibilidade
    static async inserirDisponibilidade(disponibilidade) {
        try {
            const { usuario_id, dia_semana, hora_inicio, hora_fim } = disponibilidade;
            await db.none('INSERT INTO disponibilidade_psicologos (usuario_id, dia_semana, hora_inicio, hora_fim) VALUES ($1, $2, $3, $4)', [usuario_id, dia_semana, hora_inicio, hora_fim]);
            return { success: true, message: 'Disponibilidade registrada com sucesso!' };
        } catch (error) {
            console.error('Erro ao inserir disponibilidade:', error);
            return { success: false, message: 'Erro ao inserir disponibilidade' };
        }
    }

    static async listarTodasDisponibilidades(clinicaId) {
        try {
            return await db.any('SELECT * FROM disponibilidade_psicologos WHERE clinica_id = $1', [clinicaId]);
        } catch (error) {
            console.error('Erro ao listar todas as disponibilidades:', error);
            throw error;
        }
    }

    static async listarDisponibilidadePorUsuario(usuarioId) {
        try {
            return await db.any('SELECT * FROM disponibilidade_psicologos WHERE usuario_id = $1', [usuarioId]);
        } catch (error) {
            console.error('Erro ao listar disponibilidade por usuário:', error);
            throw error;
        }
    }

}

module.exports = DisponibilidadePsicologos;

