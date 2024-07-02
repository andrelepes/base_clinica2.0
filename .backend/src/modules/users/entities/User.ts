import { Roles, Status } from 'utils/enums';
import { v4 as uuidv4 } from 'uuid';

class User {
  user_id?: string;

  user_email: string;

  user_password: string;

  user_status: Status;

  user_role: Roles;

  profile_id: string;

  first_access_token?: string;

  constructor({ user_email, user_password, user_status, user_role, profile_id, first_access_token }: User) {
    this.user_id = this.user_id || uuidv4();
    this.user_email = user_email;
    this.user_password = user_password;
    this.user_status = user_status;
    this.user_role = user_role;
    this.profile_id = profile_id;
    this.first_access_token = first_access_token;
  }
}

export { User };
