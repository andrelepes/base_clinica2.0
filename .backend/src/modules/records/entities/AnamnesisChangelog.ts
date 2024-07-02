import { Roles } from 'utils/enums';

interface OldAnamnesisRecord {
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

class AnamnesisChangelog {
  anamnesis_change_id?: number;

  anamnesis_id: string;

  old_record: OldAnamnesisRecord;

  updated_at: Date;

  updated_by: string;

  updated_by_role: Roles;

  constructor({
    anamnesis_change_id,
    anamnesis_id,
    old_record,
    updated_by,
    updated_by_role,
  }: AnamnesisChangelog) {
    this.anamnesis_change_id = anamnesis_change_id;
    this.anamnesis_id = anamnesis_id;
    this.old_record = old_record;
    this.updated_at = new Date();
    this.updated_by = updated_by;
    this.updated_by_role = updated_by_role;
  }
}

export { AnamnesisChangelog };
