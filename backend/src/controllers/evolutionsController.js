const Evolutions = require('../models/Evolutions');
const Agendamentos = require('../models/Agendamentos');

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
      console.log(error)
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
}
module.exports = EvolutionsController;
