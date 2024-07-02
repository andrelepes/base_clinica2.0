import { ICreateEvolutionChangelogDTO } from 'modules/records/dtos/EvolutionsDTOs';
import { EvolutionChangelog } from 'modules/records/entities/EvolutionChangelog';
import { IGenericChangelogRepository } from 'modules/shared/repositories/IGenericChangelogRepository';

interface IEvolutionsChangelogRepository
  extends IGenericChangelogRepository<
    EvolutionChangelog,
    string,
    ICreateEvolutionChangelogDTO
  > {}

export { IEvolutionsChangelogRepository };
