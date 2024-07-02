import { Status } from "utils/enums";

class MedicalRecord {
  record_number: string;
  
  patient_id: string;
  
  psychologist_id: string;
  
  created_at: Date;
  
  status: Status;
  
  updated_at: Date;
  
  constructor(
    record_number: string,
    patient_id: string,
    psychologist_id: string,
    status: Status
  ) {
    this.record_number = record_number;
    this.patient_id = patient_id;
    this.psychologist_id = psychologist_id;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.status = status;
  }
}

export { MedicalRecord };
