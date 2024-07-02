import {
  ICreatePsychologistDTO,
  IUpdatePsychologistDTO,
} from 'modules/psychologists/dtos/PsychologistsDTOs';
import { Psychologist } from 'modules/psychologists/entities/Psychologist';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

interface IPsychologistsRepository
  extends IGenericRepository<
    Psychologist,
    string,
    ICreatePsychologistDTO,
    IUpdatePsychologistDTO
  > {
  findByClinic(id: string): Promise<Psychologist[]>;
}

export { IPsychologistsRepository };
