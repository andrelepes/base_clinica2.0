import { ICreatePatientDTO, IUpdatePatientDTO } from 'modules/patients/dtos/PatientsDTOs';
import { Patient } from 'modules/patients/entities/Patient';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

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
