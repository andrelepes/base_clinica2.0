import { ICreateClinicChangelogDTO } from 'modules/clinics/dtos/ClinicsDTOs';
import { ClinicChangelog } from 'modules/clinics/entities/ClinicChangelog';
import { IGenericChangelogRepository } from 'modules/shared/repositories/IGenericChangelogRepository';

interface IClinicChangelogRepository
  extends IGenericChangelogRepository<
    ClinicChangelog,
    string,
    ICreateClinicChangelogDTO
  > {}

export { IClinicChangelogRepository };
