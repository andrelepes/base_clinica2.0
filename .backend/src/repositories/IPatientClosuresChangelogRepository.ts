import { ICreatePatientClosureChangelogDTO } from 'dtos/PatientClosuresDTOs';
import { PatientClosureChangelog } from '../entities/PatientClosureChangelog';
import { IGenericChangelogRepository } from './IGenericChangelogRepository';

interface IPatientClosuresChangelogRepository
  extends IGenericChangelogRepository<
    PatientClosureChangelog,
    string,
    ICreatePatientClosureChangelogDTO
  > {}

export { IPatientClosuresChangelogRepository };
