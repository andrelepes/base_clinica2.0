const Clinica = require('../models/Clinica');
const Psicologos = require('../models/Psicologos');

exports.addClinica = async (req, res) => {
    try {
        const newClinica = await Clinica.create(req.body);
        res.status(201).json({ mensagem: 'Clínica adicionada com sucesso', clinica: newClinica });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.getCurrentClinica = async (req, res) => {
    try {
        const clinica = await Clinica.getById(req.params.id);
        res.status(200).json(clinica);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.updateClinica = async (req, res) => {
    try {
        await Clinica.update(req.params.id, req.body);
        res.status(200).json({ mensagem: 'Clínica atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.deleteClinica = async (req, res) => {
    try {
        await Clinica.delete(req.params.id);
        res.status(200).json({ mensagem: 'Clínica removida com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.listLinkedPsychologists = async (req, res) => {
    try {
        const psychologists = await Clinica.listLinkedPsychologists(req.params.clinicaId);
        res.status(200).json(psychologists);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.listLinkedSecretaries = async (req, res) => {
    try {
        const secretaries = await Clinica.listLinkedSecretaries(req.params.clinicaId);
        res.status(200).json(secretaries);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

exports.addLinkedPsychologist = async (req, res) => {
    try {
        const { nome, email, cpf } = req.body;

        if (!nome || !email || !cpf) {
            return res.status(400).json({ mensagem: 'Nome, email e CPF são campos obrigatórios.' });
        }

        const clinicaId = req.params.clinicaId || req.body.clinicaId;

        const psychologistId = await Psicologos.create(nome, email, cpf);

        await Clinica.addLinkedPsychologist(clinicaId, psychologistId);

        res.status(201).json({ mensagem: 'Psicólogo vinculado com sucesso' });
    } catch (err) {
        console.error('Erro ao vincular psicólogo:', err);
        res.status(500).json({ erro: 'Ocorreu um erro ao tentar vincular o psicólogo. Tente novamente.' });
    }
};

exports.addLinkedSecretary = async (req, res) => {
    try {
        await Clinica.addLinkedSecretary(req.params.clinicaId, req.body.secretaryId);
        res.status(201).json({ mensagem: 'Secretário vinculado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

