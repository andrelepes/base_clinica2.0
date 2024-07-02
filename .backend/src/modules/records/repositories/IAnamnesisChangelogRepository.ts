import { ICreateAnamnesisChangelogDTO } from 'modules/records/dtos/AnamnesisDTOs';
import { AnamnesisChangelog } from 'modules/records/entities/AnamnesisChangelog';
import { IGenericChangelogRepository } from 'modules/shared/repositories/IGenericChangelogRepository';

interface IAnamnesisChangelogRepository
  extends IGenericChangelogRepository<
    AnamnesisChangelog,
    string,
    ICreateAnamnesisChangelogDTO
  > {}

export { IAnamnesisChangelogRepository };
