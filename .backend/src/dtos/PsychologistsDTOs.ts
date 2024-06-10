interface ICreatePsychologistDTO {
  user_id: string;
  clinic_id: string;
  student_code: string;
  psychologist_cpf: string;
  psychologist_birth_date: Date;
  psychologist_name: string;
  psychologist_phone: string;
  psychologist_cep: string;
  psychologist_address: string;
  psychologist_auxiliar_mail: string;
}
interface IUpdatePsychologistDTO {
  student_code: string;
  psychologist_cpf: string;
  psychologist_birth_date: Date;
  psychologist_name: string;
  psychologist_phone: string;
  psychologist_cep: string;
  psychologist_address: string;
  psychologist_auxiliar_mail: string;
}

interface ICreatePsychologistChangelogDTO {
  psychologist_id: string;
  old_record: IUpdatePsychologistDTO;
  updated_by: string;
  updated_by_role: Roles;
}

export {
  ICreatePsychologistDTO,
  IUpdatePsychologistDTO,
  ICreatePsychologistChangelogDTO,
};
