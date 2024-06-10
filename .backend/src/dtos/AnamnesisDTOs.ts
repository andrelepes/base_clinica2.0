interface ICreateAnamnesisDTO {
  patient_id: string;
  psychologist_id: string;
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
}
interface IUpdateAnamnesisDTO {
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
}

interface ICreateAnamnesisChangelogDTO {
  anamnesis_id: string;
  old_record: IUpdateAnamnesisDTO;
  updated_by: string;
  updated_by_role: Roles;
}

export {
  ICreateAnamnesisDTO,
  IUpdateAnamnesisDTO,
  ICreateAnamnesisChangelogDTO,
};
