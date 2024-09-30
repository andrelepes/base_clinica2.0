const Closure = require('../models/Closure');
const { v4: uuidv4 } = require('uuid');
class ClosureController {
  async getByPatientId(req, res) {
    try {
      const closureModel = new Closure();
      const patientId = req.params.patientId;
      const closure = await closureModel.findByPatientId(
        req.tipousuario,
        patientId
      );
      if (closure) {
        res.status(200).json(closure);
      } else {
        res.status(404).send('Closure not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByUserId(req, res) {
    try {
      const closureModel = new Closure();
      const userId = req.user;
      const closure = await closureModel.findByUserId(userId);
      if (closure) {
        res.status(200).json(closure);
      } else {
        res.status(404).send('Closure not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createClosure(req, res) {
    try {
      const closureModel = new Closure();
      const {
        usuario_id,
        paciente_id,
        case_status,
        overall_results_evaluation,
        initial_expectations_met,
        treatment_duration_sessions,
        healthy_life_habits_acquired,
        additional_relevant_information,
      } = req.body;

      await closureModel.create({
        usuario_id,
        paciente_id,
        case_status,
        overall_results_evaluation,
        initial_expectations_met,
        treatment_duration_sessions,
        healthy_life_habits_acquired,
        additional_relevant_information,
      });
      res.status(201).send('Closure created successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateClosure(req, res) {
    try {
      const closureModel = new Closure();
      const closureId = req.params.closureId;
      const updateData = req.body;

      const closure = await closureModel.findById(closureId);

      if (!closure) {
        res.status(404).send('Closure not found');
      }

      await closureModel.updateWithHistory(
        closureId,
        updateData,
        JSON.stringify(closure)
      );
      res.status(200).send('Closure updated successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async signClosure(req, res) {
    try {
      const { usuario_id, closure_id } = req.body;

      const closureModel = new Closure();
      const signatureExists = await closureModel.findClosureSignature(
        usuario_id,
        closure_id
      );

      if (signatureExists) {
        await closureModel.signClosure(
          usuario_id,
          closure_id,
          signatureExists.patient_closure_sign_id,
          true
        );
        res.status(200).send('Alta assinada com sucesso');
      } else {
        const closureSignId = uuidv4();
        await closureModel.signClosure(usuario_id, closure_id, closureSignId);
        res.status(200).send('Alta assinada com sucesso');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteClosure(req, res) {
    try {
      const closureModel = new Closure();
      const closureId = req.params.closureId;
      await closureModel.delete(closureId);
      res.status(200).send('Closure deleted successfully');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ClosureController;
