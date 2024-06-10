import { compare, genSalt, hash } from 'bcrypt';
import {
  IAuthenticateUserDTO,
  ICreateUserDTO,
  IUpdateUserDTO,
} from 'dtos/UsersDTOs';
import { User } from 'entities/User';
import auth from 'config/auth';
import { AppError } from 'errors/AppError';
import { sign } from 'jsonwebtoken';
import { IUsersRepository } from 'repositories/IUsersRepository';

interface IAuthResponse {
  token: string;
  user_status: Status;
}

class UserService {
  private usersRepository: IUsersRepository;
  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async createUser({
    user_email,
    user_password,
    user_role,
  }: ICreateUserDTO): Promise<void> {
    if (!Object.values(Roles).includes(user_role)) {
      throw new AppError('Invalid user role');
    }

    const user = await this.usersRepository.findByEmail(user_email);

    if (!user) {
      throw new AppError('User already exists', 409);
    }

    const saltRounds = 10;

    const salt = await genSalt(saltRounds);

    const passwordHash = await hash(user_password, salt);

    await this.usersRepository.create({
      user_email,
      user_password: passwordHash,
      user_role,
      user_status: Status.Active,
    });
  }

  async updateUserPassword(
    user_id: string,
    { user_password }: IUpdateUserDTO
  ): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const saltRounds = 10;

    const salt = await genSalt(saltRounds);

    const passwordHash = await hash(user_password, salt);

    await this.usersRepository.update(user_id, {
      user_password: passwordHash,
    });
  }

  async updateUserStatus(
    user_id: string,
    { user_status }: IUpdateUserDTO
  ): Promise<void> {
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
