const db = require('../database/database');
class Anamnesis {
  async findByPatientId(pacienteId) {
    return db.oneOrNone(
      'SELECT an.*, u.nome_usuario FROM anamnesis AS an JOIN usuarios AS u ON an.usuario_id = u.usuario_id WHERE an.paciente_id = ${pacienteId}',
      { pacienteId }
    );
  }

  async findByUserId(usuarioId) {
    return db.any('SELECT * FROM anamnesis WHERE usuario_id = ${usuarioId}', {
      usuarioId,
    });
  }

  async create(anamnesisData) {
    return db.none(
      'INSERT INTO anamnesis (usuario_id, paciente_id, marital_status, care_modality, gender, occupation, education_level, socioeconomic_level, special_needs, referred_by, undergoing_treatment, treatment_expectation, diagnosis, healthy_life_habits, relevant_information) VALUES (${usuario_id}, ${paciente_id}, ${marital_status}, ${care_modality}, ${gender}, ${occupation}, ${education_level}, ${socioeconomic_level}, ${special_needs}, ${referred_by}, ${undergoing_treatment}, ${treatment_expectation}, ${diagnosis}, ${healthy_life_habits}, ${relevant_information})',
      anamnesisData
    );
  }

  async update(anamnesisId, anamnesisData) {
    return db.none(
      'UPDATE anamnesis SET usuario_id = ${usuario_id}, paciente_id = ${paciente_id}, marital_status = ${marital_status}, care_modality = ${care_modality}, gender = ${gender}, occupation = ${occupation}, education_level = ${education_level}, socioeconomic_level = ${socioeconomic_level}, special_needs = ${special_needs}, referred_by = ${referred_by}, undergoing_treatment = ${undergoing_treatment}, treatment_expectation = ${treatment_expectation}, diagnosis = ${diagnosis}, healthy_life_habits = ${healthy_life_habits}, relevant_information = ${relevant_information} WHERE anamnesis_id = ${anamnesisId}',
      { anamnesisId, ...anamnesisData }
    );
  }

  async delete(anamnesisId) {
    return db.none(
      'DELETE FROM anamnesis WHERE anamnesis_id = ${anamnesisId}',
      { anamnesisId }
    );
  }
}

module.exports = Anamnesis;
