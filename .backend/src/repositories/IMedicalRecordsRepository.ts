import {
  ICreateMedicalRecordDTO,
  IUpdateMedicalRecordDTO,
} from 'dtos/MedicalRecordsDTOs';
import { MedicalRecord } from '../entities/MedicalRecord';
import { IGenericRepository } from './IGenericRepository';

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
