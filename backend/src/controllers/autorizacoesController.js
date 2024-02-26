const Autorizacoes = require('../models/Autorizacoes');

exports.concederAutorizacao = async (req, res) => {
    // Log para imprimir o corpo da requisição
    console.log("Corpo da requisição:", req.body);

    const { clinica_id, usuario_id, paciente_id } = req.body;

    // Logs para imprimir os valores extraídos do corpo da requisição
    console.log("clinica_id:", clinica_id);
    console.log("usuario_id:", usuario_id);
    console.log("paciente_id:", paciente_id);

    try {
        await Autorizacoes.concederAutorizacao(clinica_id, usuario_id, paciente_id);
        res.json({ message: 'Autorização concedida com sucesso!' });
    } catch (error) {
        console.error("Erro ao conceder autorização:", error);
        res.status(500).send('Erro no servidor');
    }
};

exports.retirarAutorizacao = async (req, res) => {
    const { clinica_id, usuario_id, paciente_id } = req.params;
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
        res.json(psicologosAutorizados || []); // Retorna uma lista vazia se não houver psicólogos autorizados
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
};

