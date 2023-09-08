const Clinica = require('../models/Clinica');
const Psicologos = require('../models/Psicologos'); // Importe o novo modelo

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
        console.log("Dados da clínica:", clinica);  // Log para depuração
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
    console.log("Iniciando o processo de vinculação de psicólogo...");  // Log adicional
    console.log("Dados recebidos:", req.body);

    try {
        console.log('Req Params:', req.params);  // Log para depuração
        console.log('Req Body:', req.body);  // Log para depuração

        const clinicaId = req.params.clinicaId || req.body.clinicaId;
        const { nome, email, cpf } = req.body;  // Adicione o cpf aqui

        // TODO: Adicione validação para nome, email e cpf aqui

        // Crie um novo psicólogo e obtenha o ID
        const psychologistId = await Psicologos.create(nome, email, cpf);  // Passe o cpf aqui
        console.log('Psicólogo vinculado com sucesso, ID:', psychologistId);  // Log adicional

        // Vincule o novo psicólogo à clínica atual
        await Clinica.addLinkedPsychologist(clinicaId, psychologistId);

        res.status(201).json({ mensagem: 'Psicólogo vinculado com sucesso' });
    } catch (err) {
        console.error('Erro ao vincular psicólogo:', err);
        // TODO: Adicione mensagens de erro personalizadas com base no tipo de erro
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
