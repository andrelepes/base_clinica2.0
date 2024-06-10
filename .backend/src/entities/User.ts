import { v4 as uuidv4 } from 'uuid';

class User {
  user_id?: string;

  user_email: string;

  user_password: string;

  user_status: Status;

  user_role: Roles;

  constructor(
    user_email: string,
    user_password: string,
    user_status: Status,
    user_role: Roles
  ) {
    this.user_id = this.user_id || uuidv4();
    this.user_email = user_email;
    this.user_password = user_password;
    this.user_status = user_status;
    this.user_role = user_role;
  }
}

export { User };
