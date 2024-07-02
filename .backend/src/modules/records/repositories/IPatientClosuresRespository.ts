import {
  ICreatePatientClosureDTO,
  IUpdatePatientClosureDTO,
} from 'modules/records/dtos/PatientClosuresDTOs';
import { PatientClosure } from 'modules/records/entities/PatientClosure';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

interface IPatientClosuresRespository
  extends IGenericRepository<
    PatientClosure,
    string,
    ICreatePatientClosureDTO,
    IUpdatePatientClosureDTO
  > {}

export { IPatientClosuresRespository };
