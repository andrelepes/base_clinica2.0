import { Status } from 'utils/enums';
import { v4 as uuidv4 } from 'uuid';

class PsychologistAuthorization {
  authorization_id?: string;

  psychologist_id: string;

  patient_id: string;

  clinic_id: string;

  status: Status;

  created_at: Date;

  updated_at: Date;

  constructor(
    psychologist_id: string,
    patient_id: string,
    clinic_id: string,
    status: Status
  ) {
    this.authorization_id = this.authorization_id || uuidv4();
    this.psychologist_id = psychologist_id;
    this.patient_id = patient_id;
    this.clinic_id = clinic_id;
    this.status = status;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

export { PsychologistAuthorization };
