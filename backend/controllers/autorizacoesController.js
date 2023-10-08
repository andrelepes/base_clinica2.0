const Autorizacoes = require('../models/Autorizacoes');

exports.concederAutorizacao = async (req, res) => {
    const { clinica_id, usuario_id, paciente_id } = req.body;

    try {
        await Autorizacoes.concederAutorizacao(clinica_id, usuario_id, paciente_id);
        res.json({ message: 'Autorização concedida com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

exports.retirarAutorizacao = async (req, res) => {
    const { clinica_id, usuario_id, paciente_id } = req.body;

    try {
        await Autorizacoes.retirarAutorizacao(clinica_id, usuario_id, paciente_id);
        res.json({ message: 'Autorização retirada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

exports.listarAutorizados = async (req, res) => {
    const pacienteId = req.params.paciente_id;

    try {
        const psicologosAutorizados = await Autorizacoes.listarAutorizados(pacienteId);
        res.json(psicologosAutorizados);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};
