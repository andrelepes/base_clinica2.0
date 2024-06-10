import { ICreateEvolutionChangelogDTO } from 'dtos/EvolutionsDTOs';
import { EvolutionChangelog } from '../entities/EvolutionChangelog';
import { IGenericChangelogRepository } from './IGenericChangelogRepository';

interface IEvolutionsChangelogRepository
  extends IGenericChangelogRepository<
    EvolutionChangelog,
    string,
    ICreateEvolutionChangelogDTO
  > {}

export { IEvolutionsChangelogRepository };
