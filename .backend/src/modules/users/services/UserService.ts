import { compare, genSalt, hash } from 'bcrypt';
import { IAuthenticateUserDTO, ICreateUserDTO } from 'modules/users/dtos/UsersDTOs';
import auth from 'config/auth';
import { AppError } from 'errors/AppError';
import { sign } from 'jsonwebtoken';
import { IUsersRepository } from 'modules/users/repositories/IUsersRepository';
import { Roles, Status } from 'utils/enums';

interface IAuthResponse {
  token: string;
  user_status: Status;
}

class UserService {
  private usersRepository: IUsersRepository;
  private saltRounds = 12;
  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async createUser({
    user_email,
    user_password,
    user_role,
    profile_id,
    first_access_token
  }: ICreateUserDTO): Promise<void> {
    if (!Object.values(Roles).includes(user_role)) {
      throw new AppError('Invalid user role');
    }

    const user = await this.usersRepository.findByEmail(user_email);

    if (user) {
      throw new AppError('User already exists', 409);
    }

    const saltRounds = this.saltRounds;

    const salt = await genSalt(saltRounds);

    const passwordHash = await hash(user_password, salt);

    await this.usersRepository.create({
      user_email,
      user_password: passwordHash,
      user_role,
      user_status: Status.AwaitingConfirmation,
      profile_id,
      first_access_token
    });
  }

  async updateUserPassword(
    user_id: string,
    user_password: string
  ): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const saltRounds = this.saltRounds;

    const salt = await genSalt(saltRounds);

    const passwordHash = await hash(user_password, salt);

    await this.usersRepository.update(user_id, {
      user_password: passwordHash,
    });
  }

  async updateUserStatus(user_id: string, user_status: Status): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.usersRepository.update(user_id, {
      user_status,
    });
  }

  async authenticateUser({
    user_email,
    user_password,
  }: IAuthenticateUserDTO): Promise<IAuthResponse> {
    const user = await this.usersRepository.findByEmail(user_email);
    if (!user) {
      throw new AppError('Email or password incorrect!');
    }

    const passwordMatch = await compare(user_password, user.user_password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!');
    }

    const { expires_in_token, secret_token } = auth;

    const token = sign(
      {
        user_role: user.user_role,
        profile_id: user.profile_id,
      },
      secret_token,
      { expiresIn: expires_in_token, subject: user.user_id }
    );

    return {
      token,
      user_status: user.user_status,
    };
  }
}

export { UserService };
