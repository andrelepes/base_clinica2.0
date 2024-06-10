import { ICreateSecretaryDTO, IUpdateSecretaryDTO } from 'dtos/SecretariesDTOs';
import { Secretary } from '../entities/Secretary';
import { IGenericRepository } from './IGenericRepository';

interface ISecretariesRepository
  extends IGenericRepository<
    Secretary,
    string,
    ICreateSecretaryDTO,
    IUpdateSecretaryDTO
  > {
  findByClinicId(id: string): Promise<Secretary[]>;
  findByEmail(email: string): Promise<Secretary | null>;
}

export { ISecretariesRepository };
