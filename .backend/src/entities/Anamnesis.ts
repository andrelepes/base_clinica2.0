import { v4 as uuidv4 } from 'uuid';

class Anamnesis {
  anamnesis_id?: string;

  patient_id: string;

  psychologist_id: string;

  created_at: Date;

  marital_status: string;

  care_modality: string;

  gender: string;

  occupation: string;

  education_level: string;

  socioeconomic_level: string;

  special_needs: string;

  referred_by: string;

  undergoing_treatment: string;

  treatment_expectation: string;

  diagnosis: string;

  healthy_life_habits: string;

  relevant_information: string;

  constructor(
    patient_id: string,
    psychologist_id: string,
    marital_status: string,
    care_modality: string,
    gender: string,
    occupation: string,
    education_level: string,
    socioeconomic_level: string,
    special_needs: string,
    referred_by: string,
    undergoing_treatment: string,
    treatment_expectation: string,
    diagnosis: string,
    healthy_life_habits: string,
    relevant_information: string
  ) {
    this.created_at = new Date();
    this.anamnesis_id = this.anamnesis_id || uuidv4();
    this.patient_id = patient_id;
    this.psychologist_id = psychologist_id;
    this.marital_status = marital_status;
    this.care_modality = care_modality;
    this.gender = gender;
    this.occupation = occupation;
    this.education_level = education_level;
    this.socioeconomic_level = socioeconomic_level;
    this.special_needs = special_needs;
    this.referred_by = referred_by;
    this.undergoing_treatment = undergoing_treatment;
    this.treatment_expectation = treatment_expectation;
    this.diagnosis = diagnosis;
    this.healthy_life_habits = healthy_life_habits;
    this.relevant_information = relevant_information;
  }
}

export { Anamnesis };
