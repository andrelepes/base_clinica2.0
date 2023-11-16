const DisponibilidadePsicologos = require('../models/DisponibilidadePsicologos'); // Ajuste o caminho conforme necessário

class DisponibilidadePsicologosController {
    // Função para criar uma nova disponibilidade
    static async criarDisponibilidade(req, res) {
        console.log("Dados recebidos:", req.body);
        try {
            const usuarioLogadoId = req.user; // Supondo que req.user contém o ID do usuário logado
            const { usuario_id } = req.body;

            // Verifica se o usuário logado é o mesmo que está tentando criar a disponibilidade
            if (usuarioLogadoId !== usuario_id) {
                return res.status(403).send({ message: 'Não autorizado a criar disponibilidade para outro usuário.' });
            }

            const resultado = await DisponibilidadePsicologos.inserirDisponibilidade(req.body);
            res.status(201).send(resultado);
        } catch (error) {
            console.error('Erro ao criar disponibilidade:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }

    static async listarDisponibilidades(req, res) {
        try {
            const tipousuario = req.tipousuario;
            const clinicaId = req.clinicaId;
            const usuarioId = req.user;

            let disponibilidades;

            if (tipousuario === 'psicologo') {
                disponibilidades = await DisponibilidadePsicologos.listarDisponibilidadePorUsuario(usuarioId);
            } else if (tipousuario === 'clinica') {
                disponibilidades = await DisponibilidadePsicologos.listarTodasDisponibilidades(clinicaId);
            } else if (tipousuario === 'secretario_vinculado' || tipousuario === 'psicologo_vinculado') {
                disponibilidades = await DisponibilidadePsicologos.listarDisponibilidadePorClinica(clinicaId); // Supondo que exista um método para isso
            } else {
                return res.status(403).send({ message: 'Não autorizado.' });
            }

            res.status(200).send({ disponibilidades });
        } catch (error) {
            console.error('Erro ao listar disponibilidades:', error);
            res.status(500).send({ message: 'Erro interno do servidor' });
        }
    }

}

module.exports = DisponibilidadePsicologosController;
