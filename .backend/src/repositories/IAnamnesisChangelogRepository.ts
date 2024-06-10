import { ICreateAnamnesisChangelogDTO } from 'dtos/AnamnesisDTOs';
import { AnamnesisChangelog } from '../entities/AnamnesisChangelog';
import { IGenericChangelogRepository } from './IGenericChangelogRepository';

interface IAnamnesisChangelogRepository
  extends IGenericChangelogRepository<
    AnamnesisChangelog,
    string,
    ICreateAnamnesisChangelogDTO
  > {}

export { IAnamnesisChangelogRepository };
