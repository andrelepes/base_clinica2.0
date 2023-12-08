const db = require('../../database'); // Ajuste o caminho conforme necessário

class Consultorios {
    // Método para inserir um novo consultorio
    static async inserirConsultorio(consultorio) {
        const query = `
            INSERT INTO consultorios (
                clinica_id, 
                nome_consultorio, 
                descricao
            ) VALUES (
                $1, 
                $2, 
                $3
            )
        `;
    
        try {
            await db.none(query, [consultorio.clinica_id, consultorio.nome_consultorio, consultorio.descricao]);
            return { success: true, message: 'Consultório registrado com sucesso!' };
        } catch (error) {
            console.error('Erro ao inserir consultório:', error);
            return { success: false, message: 'Erro ao inserir consultório' };
        }
    }
     
    static async isConsultorioAssociatedToClinica(consultorioId, clinicaId) {
        const query = `SELECT COUNT(*) FROM consultorios WHERE consultorio_id = $1 AND clinica_id = $2`;
        try {
            const result = await db.one(query, [consultorioId, clinicaId]);
            return parseInt(result.count) > 0;
        } catch (error) {
            console.error('Erro ao verificar associação do consultório com clínica:', error);
            return false;
        }
    }

    // Método para listar todos os consultórios
static async listarConsultorios() {
    try {
        const consultorios = await db.any('SELECT * FROM consultorios');
        return consultorios;
    } catch (error) {
        console.error('Erro ao listar consultórios:', error);
        throw error;
    }
}

// Método para buscar um consultório por ID
static async buscarPorId(consultorio_id) {
    try {
        const consultorio = await db.oneOrNone('SELECT * FROM consultorios WHERE consultorio_id = $1', [consultorio_id]);
        return consultorio;
    } catch (error) {
        console.error('Erro ao buscar consultório por ID:', error);
        throw error;
    }
}

// Método para atualizar um consultório
static async atualizarConsultorio(consultorio_id, consultorio) {
    try {
        await db.none('UPDATE consultorios SET clinica_id = $1, nome_consultorio = $2, descricao = $3 WHERE consultorio_id = $4', [consultorio.clinica_id, consultorio.nome_consultorio, consultorio.descricao, consultorio_id]);
        return { success: true, message: 'Consultório atualizado com sucesso!' };
    } catch (error) {
        console.error('Erro ao atualizar consultório:', error);
        throw error;
    }
}

// Método para deletar um consultório
static async deletarConsultorio(consultorio_id) {
    try {
        await db.none('DELETE FROM consultorios WHERE consultorio_id = $1', [consultorio_id]);
        return { success: true, message: 'Consultório deletado com sucesso!' };
    } catch (error) {
        console.error('Erro ao deletar consultório:', error);
        throw error;
    }
}

    // Outros métodos, como atualizarConsultorio, listarConsultorios, obterConsultorioPorId, etc.
}

module.exports = Consultorios;
