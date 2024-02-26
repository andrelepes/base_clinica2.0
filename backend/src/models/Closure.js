const db = require('../database/database');
class Closure {
  async findByPatientId(pacienteId) {
    return db.oneOrNone(
      'SELECT pc.*, u.nome_usuario FROM patient_closure AS pc JOIN usuarios AS u ON pc.usuario_id = u.usuario_id WHERE pc.paciente_id = ${pacienteId}',
      { pacienteId }
    );
  }

  async findByUserId(usuarioId) {
    return db.any(
      'SELECT * FROM patient_closure WHERE usuario_id = ${usuarioId}',
      {
        usuarioId,
      }
    );
  }

  async create(patientClosureData) {
    return db.none(
      'INSERT INTO patient_closure (usuario_id, paciente_id, case_status, overall_results_evaluation, initial_expectations_met, treatment_duration_sessions, healthy_life_habits_acquired, additional_relevant_information) VALUES (${usuario_id}, ${paciente_id}, ${case_status}, ${overall_results_evaluation}, ${initial_expectations_met}, ${treatment_duration_sessions}, ${healthy_life_habits_acquired}, ${additional_relevant_information})',
      patientClosureData
    );
  }

  async update(patientClosureId, patientClosureData) {
    return db.none(
      'UPDATE patient_closure SET usuario_id = ${usuario_id}, paciente_id = ${paciente_id}, case_status = ${case_status}, overall_results_evaluation = ${overall_results_evaluation}, initial_expectations_met = ${initial_expectations_met}, treatment_duration_sessions = ${treatment_duration_sessions}, healthy_life_habits_acquired = ${healthy_life_habits_acquired}, additional_relevant_information = ${additional_relevant_information}  WHERE patient_closure_id = ${patientClosureId}',
      { patientClosureId, ...patientClosureData }
    );
  }

  async delete(patientClosureId) {
    return db.none(
      'DELETE FROM patient_closure WHERE patient_closure_id = ${patientClosureId}',
      { patientClosureId }
    );
  }
}

module.exports = Closure;
