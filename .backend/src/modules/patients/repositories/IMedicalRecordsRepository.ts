import {
  ICreateMedicalRecordDTO,
  IUpdateMedicalRecordDTO,
} from 'modules/patients/dtos/MedicalRecordsDTOs';
import { MedicalRecord } from 'modules/patients/entities/MedicalRecord';
import { IGenericRepository } from 'modules/shared/repositories/IGenericRepository';

interface IMedicalRecordsRepository
  extends IGenericRepository<
    MedicalRecord,
    string,
    ICreateMedicalRecordDTO,
    IUpdateMedicalRecordDTO
  > {
  findByClinic(id: string): Promise<MedicalRecord[]>;
  findByPatient(id: string): Promise<MedicalRecord[]>;
}

export { IMedicalRecordsRepository };
