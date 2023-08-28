const Clinica = require('../models/Clinica');

// Listar todas as clínicas
exports.listClinicas = async (req, res) => {
    try {
      const clinicas = await Clinica.find();
      res.status(200).json(clinicas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// Adicionar uma nova clínica
exports.addClinica = async (req, res) => {
  try {
    const newClinica = await Clinica.add(req.body);
    res.status(201).json(newClinica);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar informações da clínica
exports.updateClinica = async (req, res) => {
  try {
    await Clinica.update(req.params.id, req.body);
    res.status(200).json({ message: 'Clínica atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar uma clínica
exports.deleteClinica = async (req, res) => {
  try {
    await Clinica.delete(req.params.id);
    res.status(200).json({ message: 'Clínica deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adicionar um psicólogo vinculado a uma clínica
exports.addLinkedPsychologist = async (req, res) => {
  try {
    await Clinica.addLinkedPsychologist(req.params.clinicaId, req.body.psychologistId);
    res.status(201).json({ message: 'Psicólogo vinculado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Adicionar um secretário vinculado a uma clínica
exports.addLinkedSecretary = async (req, res) => {
  try {
    await Clinica.addLinkedSecretary(req.params.clinicaId, req.body.secretaryId);
    res.status(201).json({ message: 'Secretário vinculado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
