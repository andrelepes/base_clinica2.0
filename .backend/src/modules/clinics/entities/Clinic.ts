import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/User';

class Clinic {
  clinic_id?: string;

  user_id: string;

  user?: User;

  clinic_cnpj: string;

  clinic_name: string;

  clinic_email: string;

  clinic_cep: string;

  clinic_address: string;

  clinic_phone: string;

  clinic_administrator_name: string;

  created_at: Date;

  constructor({
    user_id,
    clinic_cnpj,
    clinic_name,
    clinic_email,
    clinic_cep,
    clinic_address,
    clinic_phone,
    clinic_administrator_name,
    user,
  }: Clinic) {
    this.user_id = user_id;
    this.clinic_id = this.clinic_id || uuidv4();
    this.clinic_cnpj = clinic_cnpj;
    this.clinic_name = clinic_name;
    this.clinic_email = clinic_email;
    this.clinic_cep = clinic_cep;
    this.clinic_address = clinic_address;
    this.clinic_phone = clinic_phone;
    this.clinic_administrator_name = clinic_administrator_name;
    this.created_at = new Date();
    if (user) {
      this.user = user;
    }
  }
}

export { Clinic };
