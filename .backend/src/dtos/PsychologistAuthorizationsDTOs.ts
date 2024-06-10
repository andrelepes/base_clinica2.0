interface ICreatePsychologistAuthorizationDTO {
  psychologist_id: string;
  patient_id: string;
  clinic_id: string;
  status: Status;
}
interface IUpdatePsychologistAuthorizationDTO {
  status: Status;
}

export {
  ICreatePsychologistAuthorizationDTO,
  IUpdatePsychologistAuthorizationDTO,
};
