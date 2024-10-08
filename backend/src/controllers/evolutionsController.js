const Evolutions = require('../models/Evolutions');
const Agendamentos = require('../models/Agendamentos');
const pathFunction = require('path');
const { deleteFile } = require('../utils/file');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { generateToPDF } = require('../utils/pdfGenerator');

class EvolutionsController {
  async getAllEvolutionsByPatientId(req, res) {
    try {
      const evolutions = new Evolutions();
      const patientId = req.params.patientId;
      const allEvolutions = await evolutions.findAllByPatientId(
        req.tipousuario,
        patientId
      );
      res.status(200).json(allEvolutions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEvolutionByIdAndUserId(req, res) {
    try {
      const evolutions = new Evolutions();
      const evolution = await evolutions.findByIdAndUserId(
        req.params.evolutionId,
        req.user
      );
      if (evolution) {
        res.status(200).json(evolution);
      } else {
        res.status(404).send('Evolution not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createEvolutionForUserIdAndPatientId(req, res) {
    try {
      const {
        attendance_status,
        punctuality_status,
        arrival_mood_state,
        discussion_topic,
        analysis_intervention,
        next_session_plan,
        departure_mood_state,
        therapist_notes,
        appointment_id,
        evolution_status,
      } = req.body;
      const patient_id = req.params.patientId;
      const evolutions = new Evolutions();
      await evolutions.createForUserIdAndPatientId({
        attendance_status,
        punctuality_status,
        arrival_mood_state,
        discussion_topic,
        analysis_intervention,
        next_session_plan,
        departure_mood_state,
        therapist_notes,
        appointment_id,
        evolution_status,
        usuario_id: req.user,
        patient_id,
      });
      res.status(201).send('Evolution created successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateEvolutionByIdAndUserId(req, res) {
    try {
      const {
        attendance_status,
        punctuality_status,
        arrival_mood_state,
        discussion_topic,
        analysis_intervention,
        next_session_plan,
        departure_mood_state,
        therapist_notes,
        evolution_status,
      } = req.body;
      const evolutions = new Evolutions();
      const evolution = await evolutions.findByIdAndUserId(
        req.params.evolutionId,
        req.user
      );
      if (!evolution) {
        return res.status(404).send('Evolution not found');
      }

      if (evolution.evolution_status) {
        const oldRegister = JSON.stringify({
          attendance_status: evolution.attendance_status,
          punctuality_status: evolution.punctuality_status,
          arrival_mood_state: evolution.arrival_mood_state,
          departure_mood_state: evolution.departure_mood_state,
          discussion_topic: evolution.discussion_topic,
          analysis_intervention: evolution.analysis_intervention,
          next_session_plan: evolution.next_session_plan,
          therapist_notes: evolution.therapist_notes,
          evolution_status: evolution.evolution_status,
        });
        await evolutions.updateWithHistory(
          req.params.evolutionId,
          {
            attendance_status,
            punctuality_status,
            arrival_mood_state,
            discussion_topic,
            analysis_intervention,
            next_session_plan,
            departure_mood_state,
            therapist_notes,
            evolution_status,
            usuario_id: req.user,
          },
          oldRegister
        );
        res.status(200).send('Evolution updated successfully');
      } else {
        await evolutions.updateByIdAndUserId(req.params.evolutionId, {
          attendance_status,
          punctuality_status,
          arrival_mood_state,
          discussion_topic,
          analysis_intervention,
          next_session_plan,
          departure_mood_state,
          therapist_notes,
          evolution_status,
          usuario_id: req.user,
        });
        res.status(200).send('Evolution updated successfully');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteEvolutionByIdAndUserId(req, res) {
    try {
      const evolutions = new Evolutions();
      await evolutions.deleteByIdAndUserId(req.params.evolutionId, req.user);
      res.status(200).send('Evolution deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generatePendingEvolution(req, res) {
    const pacienteId = req.query.paciente_id;
    const { user, tipousuario, clinicaId } = req;

    try {
      const evolutions = new Evolutions();
      await evolutions.generatePendingAppointments({
        pacienteId,
        user,
        tipousuario,
        clinicaId,
      });

      res.status(200).send('Pending Evolutions Generated');
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro interno do servidor');
    }
  }

  async uploadArchive(req, res) {
    const evolution_id = req.params.evolutionId;
    const { originalname, mimetype, path } = req.file;
    const user = req.user;

    try {
      const archive = {
        archive_id: uuidv4(),
        archive_name: originalname,
        archive_mime_type: mimetype,
        archive_localization: pathFunction.relative(__dirname, path),
      };
      const evolutions = new Evolutions();

      const evolution = await evolutions.findByIdAndUserId(
        req.params.evolutionId,
        req.user
      );

      if (!evolution) {
        return res.status(404).send('Evolution not found');
      }

      await evolutions.uploadArchiveWithHistory(archive, evolution_id, user);
      res.status(200).send('Arquivo enviado com sucesso');
    } catch (error) {
      deleteFile(path);
      res.status(500).send('Erro interno do servidor');
    }
  }
  async getEvolutionArchiveById(req, res) {
    try {
      const evolutions = new Evolutions();
      const archive = await evolutions.getEvolutionArchiveById(
        req.params.archive_id
      );
      if (!archive) {
        return res.status(404).send('Arquivo não encontrado');
      }

      const localization = pathFunction.join(
        __dirname,
        archive.archive_localization
      );

      fs.access(localization, fs.constants.F_OK, (err) => {
        if (err) {
          res.status(404).send({ error: 'File not found' });
        }

        res.download(localization, archive.archive_name, (err) => {
          if (err) {
            res.status(500).send({
              error: 'Could not download the file. ' + err.message,
            });
          }
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro interno do servidor');
    }
  }

  async deleteEvolutionArchiveById(req, res) {
    try {
      const evolutions = new Evolutions();
      const fileExists = await evolutions.getEvolutionArchiveById(
        req.params.archiveId
      );
      if (!fileExists) {
        return res.status(404).send('Arquivo não encontrado');
      }
      deleteFile(fileExists.archive_localization);
      await evolutions.deleteEvolutionArchiveById(req.params.archiveId);
      res.status(200).send('Evolução excluída com sucesso');
    } catch (error) {
      res.status(500).send('Erro interno do servidor');
    }
  }

  async signEvolution(req, res) {
    const { usuario_id, evolution_id } = req.body;

    try {
      const evolutions = new Evolutions();

      const signatureExists = await evolutions.findEvolutionSignature(
        usuario_id,
        evolution_id
      );

      if (signatureExists) {
        await evolutions.signEvolution(
          usuario_id,
          evolution_id,
          signatureExists.evolution_sign_id,
          true
        );
        res.status(200).send('Evolução assinada com sucesso');
      } else {
        const evolutionSignId = uuidv4();
        await evolutions.signEvolution(
          usuario_id,
          evolution_id,
          evolutionSignId
        );
        res.status(200).send('Evolução assinada com sucesso');
      }
    } catch (error) {
      res.status(500).send('Erro interno do servidor');
    }
  }

  async generateEvolutionPDF(req, res) {
    try {
      const { evolution_id } = req.params;
      const evolutions = new Evolutions();
      const pdfData = await evolutions.getEvolutionDataToPDFDocument(
        evolution_id
      );

      const pdfResponse = await generateToPDF(
        'reports/singleEvolutionReport.hbs',
        pdfData
      );

      res.set({
        'Content-Type': 'application/pdf',
      });
      res.download(pdfResponse, 'evolution.pdf', (err) => {
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
module.exports = EvolutionsController;
