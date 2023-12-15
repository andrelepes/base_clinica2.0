const db = require('../database/database');

class Evolutions {
  async findAllByUserIdAndPatientId(userId, patientId) {
    return db.any('SELECT * FROM evolutions WHERE usuario_id = ${userId} and paciente_id = ${patientId}', {userId, patientId});
  }

  async findByIdAndUserId(evolutionId, userId) {
    return db.oneOrNone(
      'SELECT * FROM evolutions WHERE evolution_id = $1 AND usuario_id = $2',
      [evolutionId, userId]
    );
  }

  async createForUserIdAndPatientId(evolution) {
    return db.none(
      'INSERT INTO evolutions (usuario_id, paciente_id, attendance_status, punctuality_status, arrival_mood_state, discussion_topic, analysis_intervention, next_session_plan, departure_mood_state, therapist_notes, session_date, evolution_status) VALUES (${usuario_id}, ${paciente_id}, ${attendance_status}, ${punctuality_status}, ${arrival_mood_state}, ${discussion_topic}, ${analysis_intervention}, ${next_session_plan}, ${departure_mood_state}, ${therapist_notes}, ${appointment_id}, ${evolution_status})',
      evolution
    );
  }

  async updateByIdAndUserId(evolutionId, evolution) {
    return db.none(
      'UPDATE evolutions SET attendance_status = ${attendance_status}, punctuality_status = ${punctuality_status}, arrival_mood_state = ${arrival_mood_state}, discussion_topic = ${discussion_topic}, analysis_intervention = ${analysis_intervention}, next_session_plan = ${next_session_plan}, departure_mood_state = ${departure_mood_state}, therapist_notes = ${therapist_notes}, evolution_status = ${evolution_status} WHERE evolution_id = ${evolutionId} AND usuario_id = ${usuario_id}',
      { evolutionId, ...evolution }
    );
  }

  async deleteByIdAndUserId(evolutionId, userId) {
    return db.none(
      'DELETE FROM evolutions WHERE evolution_id = $1 AND usuario_id = $2',
      [evolutionId, userId]
    );
  }
}

module.exports = Evolutions;
