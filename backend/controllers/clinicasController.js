const Clinica = require('../models/Clinica');

// Listar todas as clínicas
exports.listClinicas = async (req, res) => {
    try {
        console.log('Listando todas as clínicas');
        // Implementar a lógica para listar todas as clínicas usando pg-promise
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Listar informações da clínica por ID
exports.getClinicaById = async (req, res) => {
    try {
        const clinica = await Clinica.getById(req.params.id);
        res.status(200).json(clinica);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Listar psicólogos vinculados a uma clínica
exports.listLinkedPsychologists = async (req, res) => {
    try {
        const psychologists = await Clinica.listLinkedPsychologists(req.params.clinicaId);
        res.status(200).json(psychologists);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Listar secretários vinculados a uma clínica
exports.listLinkedSecretaries = async (req, res) => {
    try {
        const secretaries = await Clinica.listLinkedSecretaries(req.params.clinicaId);
        res.status(200).json(secretaries);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Adicionar uma nova clínica
exports.addClinica = async (req, res) => {
    try {
        console.log('Corpo da requisição:', req.body);
        const { nome, cpfCnpj, telefone, cep, endereco, email, tipoUsuario } = req.body;

        // Verificação de campos obrigatórios
        if (!nome || !email || !tipoUsuario) {
            return res.status(400).json({ mensagem: 'Campos obrigatórios faltando' });
        }

        // Logic to generate clinica_id
        const clinica_id = await Clinica.generateClinicaId();

        const novaClinica = await Clinica.add({ nome, cpfCnpj, telefone, cep, endereco, email, tipoUsuario, clinica_id });
        res.status(201).json(novaClinica);
    } catch (err) {
        console.log('Erro:', err);
        res.status(500).json({ erro: err.message });
    }
};

// Atualizar informações da clínica
exports.updateClinica = async (req, res) => {
    try {
        console.log('Atualizando informações da clínica');
        await Clinica.update(req.params.id, req.body);
        res.status(200).json({ mensagem: 'Clínica atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Deletar uma clínica
exports.deleteClinica = async (req, res) => {
    try {
        console.log('Deletando uma clínica');
        await Clinica.delete(req.params.id);
        res.status(200).json({ mensagem: 'Clínica deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Adicionar um psicólogo vinculado a uma clínica
exports.addLinkedPsychologist = async (req, res) => {
    try {
        console.log('Vinculando um psicólogo a uma clínica');
        await Clinica.addLinkedPsychologist(req.params.clinicaId, req.body.psychologistId);
        res.status(201).json({ mensagem: 'Psicólogo vinculado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Adicionar um secretário vinculado a uma clínica
exports.addLinkedSecretary = async (req, res) => {
    try {
        console.log('Vinculando um secretário a uma clínica');
        await Clinica.addLinkedSecretary(req.params.clinicaId, req.body.secretaryId);
        res.status(201).json({ mensagem: 'Secretário vinculado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
