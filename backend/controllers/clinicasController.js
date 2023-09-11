const Clinica = require('../models/Clinica');

exports.listLinkedPsychologists = async (req, res) => {
    try {
        const psychologists = await Clinica.listLinkedPsychologists(req.params.id);
        res.status(200).json(psychologists);
    } catch (err) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os psicólogos vinculados. Tente novamente.' });
    }
};

exports.listLinkedSecretaries = async (req, res) => {
    try {
        const secretaries = await Clinica.listLinkedSecretaries(req.params.id);
        res.status(200).json(secretaries);
    } catch (err) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os secretários vinculados. Tente novamente.' });
    }
};

module.exports = exports;