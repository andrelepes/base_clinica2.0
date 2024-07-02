import { ICreateSecretaryDTO, IUpdateSecretaryDTO } from 'modules/clinics/dtos/SecretariesDTOs';
import { Secretary } from 'modules/clinics/entities/Secretary';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

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
