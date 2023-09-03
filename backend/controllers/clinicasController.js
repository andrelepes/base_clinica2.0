const Clinica = require('../models/Clinica');

// Adicionar uma nova clínica
exports.addClinica = async (req, res) => {
    try {
        const newClinica = await Clinica.create(req.body);
        res.status(201).json({ mensagem: 'Clínica adicionada com sucesso', clinica: newClinica });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Obter informações da clínica logada
exports.getCurrentClinica = async (req, res) => {
    try {
        const clinica = await Clinica.getById(req.params.id); // Aqui você pode usar o ID da clínica logada
        res.status(200).json(clinica);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Atualizar informações da clínica logada
exports.updateClinica = async (req, res) => {
    try {
        console.log('Atualizando informações da clínica');
        await Clinica.update(req.params.id, req.body); // Aqui você pode usar o ID da clínica logada
        res.status(200).json({ mensagem: 'Clínica atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Remover uma clínica
exports.deleteClinica = async (req, res) => {
    try {
        await Clinica.delete(req.params.id); // Aqui você pode usar o ID da clínica logada
        res.status(200).json({ mensagem: 'Clínica removida com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};


// Listar psicólogos vinculados à clínica logada
exports.listLinkedPsychologists = async (req, res) => {
    try {
        const psychologists = await Clinica.listLinkedPsychologists(req.params.clinicaId); // Aqui você pode usar o ID da clínica logada
        res.status(200).json(psychologists);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Listar secretários vinculados à clínica logada
exports.listLinkedSecretaries = async (req, res) => {
    try {
        const secretaries = await Clinica.listLinkedSecretaries(req.params.clinicaId); // Aqui você pode usar o ID da clínica logada
        res.status(200).json(secretaries);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Adicionar um psicólogo vinculado à clínica logada
exports.addLinkedPsychologist = async (req, res) => {
    try {
        console.log('Vinculando um psicólogo à clínica');
        await Clinica.addLinkedPsychologist(req.params.clinicaId, req.body.psychologistId); // Aqui você pode usar o ID da clínica logada
        res.status(201).json({ mensagem: 'Psicólogo vinculado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Adicionar um secretário vinculado à clínica logada
exports.addLinkedSecretary = async (req, res) => {
    try {
        console.log('Vinculando um secretário à clínica');
        await Clinica.addLinkedSecretary(req.params.clinicaId, req.body.secretaryId); // Aqui você pode usar o ID da clínica logada
        res.status(201).json({ mensagem: 'Secretário vinculado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
