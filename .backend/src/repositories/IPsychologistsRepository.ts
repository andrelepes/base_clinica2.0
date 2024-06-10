import {
  ICreatePsychologistDTO,
  IUpdatePsychologistDTO,
} from 'dtos/PsychologistsDTOs';
import { Psychologist } from '../entities/Psychologist';
import { IGenericRepository } from './IGenericRepository';

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
