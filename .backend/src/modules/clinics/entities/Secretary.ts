import { v4 as uuidv4 } from 'uuid';

class Secretary {
  secretary_id?: string;

  user_id: string;

  clinic_id: string;

  secretary_name: string;

  secretary_phone: string;

  secretary_mail: string;

  constructor(
    user_id: string,
    secretary_name: string,
    secretary_phone: string,
    secretary_mail: string,
    clinic_id: string
  ) {
    this.secretary_id = this.secretary_id || uuidv4();
    this.user_id = user_id;
    this.secretary_name = secretary_name;
    this.secretary_phone = secretary_phone;
    this.secretary_mail = secretary_mail;
    this.clinic_id = clinic_id;
  }
}

export { Secretary };
