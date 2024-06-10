import {
  ICreatePatientClosureDTO,
  IUpdatePatientClosureDTO,
} from 'dtos/PatientClosuresDTOs';
import { PatientClosure } from '../entities/PatientClosure';
import { IGenericRepository } from './IGenericRepository';

interface IPatientClosuresRespository
  extends IGenericRepository<
    PatientClosure,
    string,
    ICreatePatientClosureDTO,
    IUpdatePatientClosureDTO
  > {}

export { IPatientClosuresRespository };
