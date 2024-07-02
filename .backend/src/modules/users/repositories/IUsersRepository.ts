import { ICreateUserDTO, IUpdateUserDTO } from 'modules/users/dtos/UsersDTOs';
import { User } from 'modules/users/entities/User';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

interface IUsersRepository
  extends IGenericRepository<User, string, ICreateUserDTO, IUpdateUserDTO> {
  findByEmail(email: string): Promise<User | null>;
}

export { IUsersRepository };
