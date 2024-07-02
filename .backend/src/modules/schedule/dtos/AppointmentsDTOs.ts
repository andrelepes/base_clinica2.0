import { AppointmentStatus } from "utils/enums";

interface ICreateAppointmentDTO {
  patient_id: string;
  psychologist_id: string;
  office_id: number;
  duration: number;
  recurrence: number;
  status: AppointmentStatus;
  appointment_date: Date;
  cotherapyst_id?: string;
}
interface IUpdateAppointmentDTO {
  office_id: number;
  duration: number;
  status: AppointmentStatus;
  appointment_date: Date;
  cotherapyst_id?: string;
}

export { ICreateAppointmentDTO, IUpdateAppointmentDTO };
