import { ICreateEvolutionDTO, IUpdateEvolutionDTO } from 'dtos/EvolutionsDTOs';
import { Evolution } from '../entities/Evolution';
import { IGenericRepository } from './IGenericRepository';

interface IEvolutionsRepository
  extends IGenericRepository<
    Evolution,
    string,
    ICreateEvolutionDTO,
    IUpdateEvolutionDTO
  > {
  findByPatient(id: string): Promise<Evolution[]>;
}

export { IEvolutionsRepository };
