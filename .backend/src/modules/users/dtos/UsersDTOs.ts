import { Roles, Status } from 'utils/enums';

interface ICreateUserDTO {
  user_email: string;
  user_password: string;
  user_status?: Status;
  user_role: Roles;
  profile_id: string;
  first_access_token?: string;
}
interface IUpdateUserDTO {
  user_password: string;
  user_status: Status;
}

interface IAuthenticateUserDTO {
  user_email: string;
  user_password: string;
}

export { ICreateUserDTO, IUpdateUserDTO, IAuthenticateUserDTO };
