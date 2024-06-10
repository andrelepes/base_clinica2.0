import { ICreatePatientDTO, IUpdatePatientDTO } from 'dtos/PatientsDTOs';
import { Patient } from '../entities/Patient';
import { IGenericRepository } from './IGenericRepository';

interface IPatientsRepository
  extends IGenericRepository<
    Patient,
    string,
    ICreatePatientDTO,
    IUpdatePatientDTO
  > {
  findByClinicId(id: string): Promise<Patient[]>;
}

export { IPatientsRepository };
