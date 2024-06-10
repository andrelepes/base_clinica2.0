import { ICreateUserDTO, IUpdateUserDTO } from 'dtos/UsersDTOs';
import { User } from '../entities/User';
import { IGenericRepository } from './IGenericRepository';

interface IUsersRepository
  extends IGenericRepository<User, string, ICreateUserDTO, IUpdateUserDTO> {
  findByEmail(email: string): Promise<User | null>;
}

export { IUsersRepository };
