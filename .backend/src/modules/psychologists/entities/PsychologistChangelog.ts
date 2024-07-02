import { Roles } from "utils/enums";

interface OldPsychologistRecord {
  student_code: string;
  psychologist_cpf: string;
  psychologist_birth_date: Date;
  psychologist_name: string;
  psychologist_phone: string;
  psychologist_cep: string;
  psychologist_address: string;
  psychologist_auxiliar_mail: string;
}

class PsychologistChangelog {
  psychologist_change_id?: number;

  psychologist_id: string;

  old_record: OldPsychologistRecord;

  updated_at: Date;

  updated_by: string;

  updated_by_role: Roles;

  constructor(
    psychologist_change_id: number,
    psychologist_id: string,
    old_record: OldPsychologistRecord,
    updated_by: string,
    updated_by_role: Roles
  ) {
    this.psychologist_change_id = psychologist_change_id;
    this.psychologist_id = psychologist_id;
    this.old_record = old_record;
    this.updated_at = new Date();
    this.updated_by = updated_by;
    this.updated_by_role = updated_by_role;
  }
}

export { PsychologistChangelog };
