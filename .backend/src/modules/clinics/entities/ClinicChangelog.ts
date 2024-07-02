interface OldClinicRecord {
  clinic_cnpj: string;
  clinic_name: string;
  clinic_email: string;
  clinic_cep: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_administrator_name: string;
}

class ClinicChangelog {
  clinic_change_id?: number;

  clinic_id: string;

  old_record: OldClinicRecord;

  updated_at: Date;

  constructor(
    clinic_id: string,
    old_record: OldClinicRecord,
    clinic_change_id?: number
  ) {
    this.clinic_change_id = clinic_change_id;
    this.clinic_id = clinic_id;
    this.old_record = old_record;
    this.updated_at = new Date();
  }
}

export { ClinicChangelog };
