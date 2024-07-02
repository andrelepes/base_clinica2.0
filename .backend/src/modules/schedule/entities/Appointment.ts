import { AppointmentStatus } from 'utils/enums';
import { v4 as uuidv4 } from 'uuid';

class Appointment {
  appointment_id?: string;

  patient_id: string;

  psychologist_id: string;

  cotherapyst_id?: string;

  office_id: number;

  duration: number;

  recurrence: number;

  status: AppointmentStatus;

  appointment_date: Date;

  created_at: Date;

  constructor({
    patient_id,
    psychologist_id,
    office_id,
    duration,
    recurrence,
    status,
    appointment_date,
    cotherapyst_id,
  }: Appointment) {
    this.appointment_id = this.appointment_id || uuidv4();
    this.patient_id = patient_id;
    this.psychologist_id = psychologist_id;
    this.cotherapyst_id = cotherapyst_id;
    this.office_id = office_id;
    this.duration = duration;
    this.recurrence = recurrence;
    this.status = status;
    this.appointment_date = appointment_date;
    this.created_at = new Date();
  }
}

export { Appointment };
