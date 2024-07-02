import { v4 as uuidv4 } from 'uuid';

class Psychologist {
  psychologist_id?: string;

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

  created_at: Date;

  constructor(
    user_id: string,
    clinic_id: string,
    student_code: string,
    psychologist_cpf: string,
    psychologist_birth_date: Date,
    psychologist_name: string,
    psychologist_phone: string,
    psychologist_cep: string,
    psychologist_address: string,
    psychologist_auxiliar_mail: string
  ) {
    this.psychologist_id = this.psychologist_id || uuidv4();
    this.user_id = user_id;
    this.clinic_id = clinic_id;
    this.student_code = student_code;
    this.psychologist_cpf = psychologist_cpf;
    this.psychologist_birth_date = psychologist_birth_date;
    this.psychologist_name = psychologist_name;
    this.psychologist_phone = psychologist_phone;
    this.psychologist_cep = psychologist_cep;
    this.psychologist_address = psychologist_address;
    this.psychologist_auxiliar_mail = psychologist_auxiliar_mail;
    this.created_at = new Date();
  }
}

export { Psychologist };
