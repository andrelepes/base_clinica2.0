const Anamnesis = require('../models/Anamnesis');
const { v4: uuidv4 } = require('uuid');
const { generateToPDF } = require('../utils/pdfGenerator');
const { deleteFile } = require('../utils/file');

class AnamnesisController {
  async getByPatientId(req, res) {
    try {
      const anamnesisModel = new Anamnesis();
      const patientId = req.params.patientId;
      const anamnesis = await anamnesisModel.findByPatientId(
        req.tipousuario,
        patientId
      );
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

      const anamnesis = await anamnesisModel.findById(anamnesisId);

      if (!anamnesis) {
        res.status(404).send('Anamnesis not found');
      }

      await anamnesisModel.updateWithHistory(
        anamnesisId,
        updateData,
        JSON.stringify(anamnesis)
      );
      res.status(200).send('Anamnesis updated successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async signAnamnesis(req, res) {
    try {
      const { usuario_id, anamnesis_id } = req.body;

      const anamnesisModel = new Anamnesis();
      const signatureExists = await anamnesisModel.findAnamnesisSignature(
        usuario_id,
        anamnesis_id
      );

      if (signatureExists) {
        await anamnesisModel.signAnamnesis(
          usuario_id,
          anamnesis_id,
          signatureExists.anamnesis_sign_id,
          true
        );
        res.status(200).send('Anamnese assinada com sucesso');
      } else {
        const anamnesisSignId = uuidv4();
        await anamnesisModel.signAnamnesis(
          usuario_id,
          anamnesis_id,
          anamnesisSignId
        );
        res.status(200).send('Anamnese assinada com sucesso');
      }
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

  async generateAnamnesisPDF(req, res) {
    try {
      const { anamnesis_id } = req.params;
      const anamnesisModel = new Anamnesis();
      const pdfData = await anamnesisModel.getAnamnesisDataToPDFDocument(
        anamnesis_id
      );

      const pdfResponse = await generateToPDF(
        'reports/anamnesisReport.hbs',
        pdfData
      );

      res.set({
        'Content-Type': 'application/pdf',
      });
      res.download(pdfResponse, 'anamnesis.pdf', (err) => {
        if (err) {
          res.status(500).send({
            error: 'Could not download the file. ' + err.message,
          });
        }
      });

      deleteFile(pdfResponse);
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro interno do servidor');
    }
  }
}

module.exports = AnamnesisController;
