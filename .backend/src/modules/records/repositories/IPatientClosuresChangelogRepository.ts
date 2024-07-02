import { ICreatePatientClosureChangelogDTO } from 'modules/records/dtos/PatientClosuresDTOs';
import { PatientClosureChangelog } from 'modules/records/entities/PatientClosureChangelog';
import { IGenericChangelogRepository } from 'modules/shared/repositories/IGenericChangelogRepository';

interface IPatientClosuresChangelogRepository
  extends IGenericChangelogRepository<
    PatientClosureChangelog,
    string,
    ICreatePatientClosureChangelogDTO
  > {}

export { IPatientClosuresChangelogRepository };
