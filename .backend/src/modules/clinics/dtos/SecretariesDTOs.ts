interface ICreateSecretaryDTO {
  user_id: string;
  secretary_name: string;
  secretary_phone: string;
  secretary_mail: string;
  clinic_id: string;
}
interface IUpdateSecretaryDTO {
  secretary_name: string;
  secretary_phone: string;
  secretary_mail: string;
}

export { ICreateSecretaryDTO, IUpdateSecretaryDTO };
