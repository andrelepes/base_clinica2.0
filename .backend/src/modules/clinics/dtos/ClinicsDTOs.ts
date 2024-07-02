interface ICreateClinicDTO {
  user_id: string;
  clinic_cnpj: string;
  clinic_name: string;
  clinic_email: string;
  clinic_cep: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_administrator_name: string;
}
interface IUpdateClinicDTO {
  clinic_cnpj: string;
  clinic_name: string;
  clinic_email: string;
  clinic_cep: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_administrator_name: string;
}

interface ICreateClinicChangelogDTO {
  clinic_id: string;
  old_record: IUpdateClinicDTO;
}

export { ICreateClinicDTO, IUpdateClinicDTO, ICreateClinicChangelogDTO };
