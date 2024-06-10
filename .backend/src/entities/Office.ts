class Office {
  office_id?: number;

  clinic_id: string;

  office_name: string;

  constructor(clinic_id: string, office_name: string, office_id?: number) {
    this.office_id = office_id;
    this.clinic_id = clinic_id;
    this.office_name = office_name;
  }
}

export { Office };
