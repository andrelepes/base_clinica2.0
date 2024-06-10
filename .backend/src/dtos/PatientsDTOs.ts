interface ICreatePatientDTO {
  clinic_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_cep: string;
  patient_address: string;
}
interface IUpdatePatientDTO {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_cep: string;
  patient_address: string;
}

export { ICreatePatientDTO, IUpdatePatientDTO };
