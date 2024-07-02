interface ICreateOfficeDTO {
  clinic_id: string;
  office_name: string;
}
interface IUpdateOfficeDTO {
  office_name: string;
}

export { ICreateOfficeDTO, IUpdateOfficeDTO };
