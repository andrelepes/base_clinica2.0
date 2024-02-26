const Anamnesis = require('../models/Anamnesis');

class AnamnesisController {
  async getByPatientId(req, res) {
    try {
      const anamnesisModel = new Anamnesis();
      const patientId = req.params.patientId;
      const anamnesis = await anamnesisModel.findByPatientId(patientId);
      if (anamnesis) {
        res.status(200).json(anamnesis);
      } else {
        res.status(404).send('Anamnesis not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByUserId(req, res) {
    try {
      const anamnesisModel = new Anamnesis();
      const userId = req.user;
      const anamnesis = await anamnesisModel.findByUserId(userId);
      if (anamnesis) {
        res.status(200).json(anamnesis);
      } else {
        res.status(404).send('Anamnesis not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createAnamnesis(req, res) {
    try {
      const anamnesisModel = new Anamnesis();
      const {
        usuario_id,
        paciente_id,
        marital_status,
        care_modality,
        gender,
        occupation,
        education_level,
        socioeconomic_level,
        special_needs,
        referred_by,
        undergoing_treatment,
        treatment_expectation,
        diagnosis,
        healthy_life_habits,
        relevant_information,
      } = req.body;

      await anamnesisModel.create({
        usuario_id,
        paciente_id,
        marital_status,
        care_modality,
        gender,
        occupation,
        education_level,
        socioeconomic_level,
        special_needs,
        referred_by,
        undergoing_treatment,
        treatment_expectation,
        diagnosis,
        healthy_life_habits,
        relevant_information,
      });
      res.status(201).send('Anamnesis created successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAnamnesis(req, res) {
    try {
      const anamnesisModel = new Anamnesis();
      const anamnesisId = req.params.anamnesisId;
      const updateData = req.body;

      await anamnesisModel.update(anamnesisId, updateData);
      res.status(200).send('Anamnesis updated successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAnamnesis(req, res) {
    try {
      const anamnesisModel = new Anamnesis();
      const anamnesisId = req.params.anamnesisId;
      await anamnesisModel.delete(anamnesisId);
      res.status(200).send('Anamnesis deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AnamnesisController;
