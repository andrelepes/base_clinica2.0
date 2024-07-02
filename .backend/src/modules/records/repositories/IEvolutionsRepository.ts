import { ICreateEvolutionDTO, IUpdateEvolutionDTO } from 'modules/records/dtos/EvolutionsDTOs';
import { Evolution } from 'modules/records/entities/Evolution';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

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
