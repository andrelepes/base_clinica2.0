const Clinica = require('../models/Clinica');

// Listar todas as clínicas
exports.listClinicas = async (req, res) => {
    try {
        console.log("Listando todas as clínicas");  // Nova mensagem de depuração
        // Implementar a lógica para listar todas as clínicas usando pg-promise
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  
// Adicionar uma nova clínica
exports.addClinica = async (req, res) => {
    try {
        const { nome, cpfCnpj, telefone, cep, endereco, email, tipoUsuario } = req.body;
        const newClinica = await Clinica.add({ nome, cpfCnpj, telefone, cep, endereco, email, tipoUsuario });
        res.status(201).json(newClinica);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar informações da clínica
exports.updateClinica = async (req, res) => {
    try {
        console.log("Atualizando informações da clínica");  // Nova mensagem de depuração
        await Clinica.update(req.params.id, req.body);
        res.status(200).json({ message: 'Clínica atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deletar uma clínica
exports.deleteClinica = async (req, res) => {
    try {
        console.log("Deletando uma clínica");  // Nova mensagem de depuração
        await Clinica.delete(req.params.id);
        res.status(200).json({ message: 'Clínica deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Adicionar um psicólogo vinculado a uma clínica
exports.addLinkedPsychologist = async (req, res) => {
    try {
        console.log("Vinculando um psicólogo a uma clínica");  // Nova mensagem de depuração
        await Clinica.addLinkedPsychologist(req.params.clinicaId, req.body.psychologistId);
        res.status(201).json({ message: 'Psicólogo vinculado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Adicionar um secretário vinculado a uma clínica
exports.addLinkedSecretary = async (req, res) => {
    try {
        console.log("Vinculando um secretário a uma clínica");  // Nova mensagem de depuração
        await Clinica.addLinkedSecretary(req.params.clinicaId, req.body.secretaryId);
        res.status(201).json({ message: 'Secretário vinculado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
