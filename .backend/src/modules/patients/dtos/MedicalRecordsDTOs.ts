import { Status } from "utils/enums";

interface ICreateMedicalRecordDTO {
  record_number: string;
  patient_id: string;
  psychologist_id: string;
  status: Status;
}
interface IUpdateMedicalRecordDTO {
  status: Status;
}

export { ICreateMedicalRecordDTO, IUpdateMedicalRecordDTO };
