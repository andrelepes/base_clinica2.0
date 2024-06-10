import { ICreateClinicChangelogDTO } from 'dtos/ClinicsDTOs';
import { ClinicChangelog } from '../entities/ClinicChangelog';
import { IGenericChangelogRepository } from './IGenericChangelogRepository';

interface IClinicChangelogRepository
  extends IGenericChangelogRepository<
    ClinicChangelog,
    string,
    ICreateClinicChangelogDTO
  > {}

export { IClinicChangelogRepository };
