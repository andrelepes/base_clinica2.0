import { v4 as uuidv4 } from 'uuid';

class Patient {
  patient_id?: string;

  clinic_id: string;

  patient_name: string;

  patient_email: string;

  patient_phone: string;

  patient_cep: string;

  patient_address: string;

  created_at: Date;

  updated_at: Date;

  constructor(
    clinic_id: string,
    patient_name: string,
    patient_email: string,
    patient_phone: string,
    patient_cep: string,
    patient_address: string,
  ) {
    this.patient_id = this.patient_id || uuidv4();
    this.clinic_id = clinic_id;
    this.patient_name = patient_name;
    this.patient_email = patient_email;
    this.patient_phone = patient_phone;
    this.patient_cep = patient_cep;
    this.patient_address = patient_address;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

export { Patient };
